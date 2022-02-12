"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _constants = require("./constants.js");

var _tape = require("./tape.js");

var core = null;
var memory = null;
var memoryData = null;
var workerFrameData = null;
var registerPairs = null;
var tapePulses = null;
var stopped = false;
var tape = null;
var tapeIsPlaying = false;

var loadCore = function loadCore(baseUrl) {
  WebAssembly.instantiateStreaming(fetch(new URL('jsspeccy-core.wasm', baseUrl), {})).then(function (results) {
    core = results.instance.exports;
    memory = core.memory;
    memoryData = new Uint8Array(memory.buffer);
    workerFrameData = memoryData.subarray(core.FRAME_BUFFER, _constants.FRAME_BUFFER_SIZE);
    registerPairs = new Uint16Array(core.memory.buffer, core.REGISTERS, 12);
    tapePulses = new Uint16Array(core.memory.buffer, core.TAPE_PULSES, core.TAPE_PULSES_LENGTH);
    postMessage({
      'message': 'ready'
    });
  });
};

var loadMemoryPage = function loadMemoryPage(page, data) {
  memoryData.set(data, core.MACHINE_MEMORY + page * 0x4000);
};

var loadSnapshot = function loadSnapshot(snapshot) {
  core.setMachineType(snapshot.model);

  for (var page in snapshot.memoryPages) {
    loadMemoryPage(page, snapshot.memoryPages[page]);
  }

  ['AF', 'BC', 'DE', 'HL', 'AF_', 'BC_', 'DE_', 'HL_', 'IX', 'IY', 'SP', 'IR'].forEach(function (r, i) {
    registerPairs[i] = snapshot.registers[r];
  });
  core.setPC(snapshot.registers.PC);
  core.setIFF1(snapshot.registers.iff1);
  core.setIFF2(snapshot.registers.iff2);
  core.setIM(snapshot.registers.im);
  core.setHalted(!!snapshot.halted);
  core.writePort(0x00fe, snapshot.ulaState.borderColour);

  if (snapshot.model != 48) {
    core.writePort(0x7ffd, snapshot.ulaState.pagingFlags);
  }

  core.setTStates(snapshot.tstates);
};

var trapTapeLoad = function trapTapeLoad() {
  if (!tape) return;
  var block = tape.getNextLoadableBlock();
  if (!block) return;
  /* get expected block type and load vs verify flag from AF' */

  var af_ = registerPairs[4];
  var expectedBlockType = af_ >> 8;
  var shouldLoad = af_ & 0x0001; // LOAD rather than VERIFY

  var addr = registerPairs[8];
  /* IX */

  var requestedLength = registerPairs[2];
  /* DE */

  var actualBlockType = block[0];
  var success = true;

  if (expectedBlockType != actualBlockType) {
    success = false;
  } else {
    if (shouldLoad) {
      var offset = 1;
      var loadedBytes = 0;
      var checksum = actualBlockType;

      while (loadedBytes < requestedLength) {
        if (offset >= block.length) {
          /* have run out of bytes to load */
          success = false;
          break;
        }

        var _byte = block[offset++];
        loadedBytes++;
        core.poke(addr, _byte);
        addr = addr + 1 & 0xffff;
        checksum ^= _byte;
      } // if loading is going right, we should still have a checksum byte left to read


      success &= offset < block.length;

      if (success) {
        var expectedChecksum = block[offset];
        success = checksum === expectedChecksum;
      }
    } else {
      // VERIFY. TODO: actually verify.
      success = true;
    }
  }

  if (success) {
    /* set carry to indicate success */
    registerPairs[0] |= 0x0001;
  } else {
    /* reset carry to indicate failure */
    registerPairs[0] &= 0xfffe;
  }

  core.setPC(0x05e2);
  /* address at which to exit the tape trap */
};

onmessage = function onmessage(e) {
  switch (e.data.message) {
    case 'loadCore':
      loadCore(e.data.baseUrl);
      break;

    case 'runFrame':
      if (stopped) return;
      var frameBuffer = e.data.frameBuffer;
      var frameData = new Uint8Array(frameBuffer);
      var audioBufferLeft = null;
      var audioBufferRight = null;
      var audioLength = 0;

      if ('audioBufferLeft' in e.data) {
        audioBufferLeft = e.data.audioBufferLeft;
        audioBufferRight = e.data.audioBufferRight;
        audioLength = audioBufferLeft.byteLength / 4;
        core.setAudioSamplesPerFrame(audioLength);
      } else {
        core.setAudioSamplesPerFrame(0);
      }

      if (tape && tapeIsPlaying) {
        var tapePulseBufferTstateCount = core.getTapePulseBufferTstateCount();
        var tapePulseWriteIndex = core.getTapePulseWriteIndex();

        var _tape$pulseGenerator$ = tape.pulseGenerator.emitPulses(tapePulses, tapePulseWriteIndex, 80000 - tapePulseBufferTstateCount),
            _tape$pulseGenerator$2 = (0, _slicedToArray2["default"])(_tape$pulseGenerator$, 3),
            newTapePulseWriteIndex = _tape$pulseGenerator$2[0],
            tstatesGenerated = _tape$pulseGenerator$2[1],
            tapeFinished = _tape$pulseGenerator$2[2];

        core.setTapePulseBufferState(newTapePulseWriteIndex, tapePulseBufferTstateCount + tstatesGenerated);

        if (tapeFinished) {
          tapeIsPlaying = false;
          postMessage({
            message: 'stoppedTape'
          });
        }
      }

      var status = core.runFrame();

      while (status) {
        switch (status) {
          case 1:
            stopped = true;
            throw "Unrecognised opcode!";

          case 2:
            trapTapeLoad();
            break;

          default:
            stopped = true;
            throw "runFrame returned unexpected result: " + status;
        }

        status = core.resumeFrame();
      }

      frameData.set(workerFrameData);

      if (audioLength) {
        var leftSource = new Float32Array(core.memory.buffer, core.AUDIO_BUFFER_LEFT, audioLength);
        var rightSource = new Float32Array(core.memory.buffer, core.AUDIO_BUFFER_RIGHT, audioLength);
        var leftData = new Float32Array(audioBufferLeft);
        var rightData = new Float32Array(audioBufferRight);
        leftData.set(leftSource);
        rightData.set(rightSource);
        postMessage({
          message: 'frameCompleted',
          frameBuffer: frameBuffer,
          audioBufferLeft: audioBufferLeft,
          audioBufferRight: audioBufferRight
        }, [frameBuffer, audioBufferLeft, audioBufferRight]);
      } else {
        postMessage({
          message: 'frameCompleted',
          frameBuffer: frameBuffer
        }, [frameBuffer]);
      }

      break;

    case 'keyDown':
      core.keyDown(e.data.row, e.data.mask);
      break;

    case 'keyUp':
      core.keyUp(e.data.row, e.data.mask);
      break;

    case 'setMachineType':
      core.setMachineType(e.data.type);
      break;

    case 'reset':
      core.reset();
      break;

    case 'loadMemory':
      loadMemoryPage(e.data.page, e.data.data);
      break;

    case 'loadSnapshot':
      loadSnapshot(e.data.snapshot);
      postMessage({
        message: 'fileOpened',
        id: e.data.id,
        mediaType: 'snapshot'
      });
      break;

    case 'openTAPFile':
      tape = new _tape.TAPFile(e.data.data);
      tapeIsPlaying = false;
      postMessage({
        message: 'fileOpened',
        id: e.data.id,
        mediaType: 'tape'
      });
      break;

    case 'openTZXFile':
      tape = new _tape.TZXFile(e.data.data);
      tapeIsPlaying = false;
      postMessage({
        message: 'fileOpened',
        id: e.data.id,
        mediaType: 'tape'
      });
      break;

    case 'playTape':
      if (tape && !tapeIsPlaying) {
        tapeIsPlaying = true;
        postMessage({
          message: 'playingTape'
        });
      }

      break;

    case 'stopTape':
      if (tape && tapeIsPlaying) {
        tapeIsPlaying = false;
        postMessage({
          message: 'stoppedTape'
        });
      }

      break;

    case 'setTapeTraps':
      core.setTapeTraps(e.data.value);
      break;

    default:
      console.log('message received by worker:', e.data);
  }
};
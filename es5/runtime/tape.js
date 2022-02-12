"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TZXFile = exports.TAPFile = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ToneSegment = /*#__PURE__*/function () {
  function ToneSegment(pulseLength, pulseCount) {
    (0, _classCallCheck2["default"])(this, ToneSegment);
    this.pulseLength = pulseLength;
    this.pulseCount = pulseCount;
    this.pulsesGenerated = 0;
  }

  (0, _createClass2["default"])(ToneSegment, [{
    key: "isFinished",
    value: function isFinished() {
      return this.pulsesGenerated == this.pulseCount;
    }
  }, {
    key: "getNextPulseLength",
    value: function getNextPulseLength() {
      this.pulsesGenerated++;
      return this.pulseLength;
    }
  }]);
  return ToneSegment;
}();

var PulseSequenceSegment = /*#__PURE__*/function () {
  function PulseSequenceSegment(pulses) {
    (0, _classCallCheck2["default"])(this, PulseSequenceSegment);
    this.pulses = pulses;
    this.index = 0;
  }

  (0, _createClass2["default"])(PulseSequenceSegment, [{
    key: "isFinished",
    value: function isFinished() {
      return this.index == this.pulses.length;
    }
  }, {
    key: "getNextPulseLength",
    value: function getNextPulseLength() {
      return this.pulses[this.index++];
    }
  }]);
  return PulseSequenceSegment;
}();

var DataSegment = /*#__PURE__*/function () {
  function DataSegment(data, zeroPulseLength, onePulseLength, lastByteBits) {
    (0, _classCallCheck2["default"])(this, DataSegment);
    this.data = data;
    this.zeroPulseLength = zeroPulseLength;
    this.onePulseLength = onePulseLength;
    this.bitCount = (this.data.length - 1) * 8 + lastByteBits;
    this.pulsesOutput = 0;
    this.lastPulseLength = null;
  }

  (0, _createClass2["default"])(DataSegment, [{
    key: "isFinished",
    value: function isFinished() {
      return this.pulsesOutput == this.bitCount * 2;
    }
  }, {
    key: "getNextPulseLength",
    value: function getNextPulseLength() {
      if (this.pulsesOutput & 0x01) {
        this.pulsesOutput++;
        return this.lastPulseLength;
      } else {
        var bitIndex = this.pulsesOutput >> 1;
        var byteIndex = bitIndex >> 3;
        var bitMask = 1 << 7 - (bitIndex & 0x07);
        this.lastPulseLength = this.data[byteIndex] & bitMask ? this.onePulseLength : this.zeroPulseLength;
        this.pulsesOutput++;
        return this.lastPulseLength;
      }
    }
  }]);
  return DataSegment;
}();

var PauseSegment = /*#__PURE__*/function () {
  function PauseSegment(duration) {
    (0, _classCallCheck2["default"])(this, PauseSegment);
    this.duration = duration;
    this.emitted = false;
  }

  (0, _createClass2["default"])(PauseSegment, [{
    key: "isFinished",
    value: function isFinished() {
      return this.emitted;
    }
  }, {
    key: "getNextPulseLength",
    value: function getNextPulseLength() {
      // TODO: take level back down to 0 after 1ms if it's currently high
      this.emitted = true;
      return this.duration * 3500;
    }
  }]);
  return PauseSegment;
}();

var PulseGenerator = /*#__PURE__*/function () {
  function PulseGenerator(getSegments) {
    (0, _classCallCheck2["default"])(this, PulseGenerator);
    this.segments = [];
    this.getSegments = getSegments;
    this.level = 0x0000;
    this.tapeIsFinished = false; // if true, don't call getSegments again

    this.pendingCycles = 0;
  }

  (0, _createClass2["default"])(PulseGenerator, [{
    key: "addSegment",
    value: function addSegment(segment) {
      this.segments.push(segment);
    }
  }, {
    key: "emitPulses",
    value: function emitPulses(buffer, startIndex, cycleCount) {
      var cyclesEmitted = 0;
      var index = startIndex;
      var isFinished = false;

      while (cyclesEmitted < cycleCount) {
        if (this.pendingCycles > 0) {
          if (this.pendingCycles >= 0x8000) {
            // emit a pulse of length 0x7fff
            buffer[index++] = this.level | 0x7fff;
            cyclesEmitted += 0x7fff;
            this.pendingCycles -= 0x7fff;
          } else {
            // emit a the remainder of this pulse in full
            buffer[index++] = this.level | this.pendingCycles;
            cyclesEmitted += this.pendingCycles;
            this.pendingCycles = 0;
          }
        } else if (this.segments.length === 0) {
          if (this.tapeIsFinished) {
            // mark end of tape
            isFinished = true;
            break;
          } else {
            // get more segments
            this.tapeIsFinished = !this.getSegments(this);
          }
        } else if (this.segments[0].isFinished()) {
          // discard finished segment
          this.segments.shift();
        } else {
          // new pulse
          this.pendingCycles = this.segments[0].getNextPulseLength();
          this.level ^= 0x8000;
        }
      }

      return [index, cyclesEmitted, isFinished];
    }
  }]);
  return PulseGenerator;
}();

var TAPFile = /*#__PURE__*/function () {
  function TAPFile(data) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, TAPFile);
    var i = 0;
    this.blocks = [];
    var tap = new DataView(data);

    while (i + 1 < data.byteLength) {
      var blockLength = tap.getUint16(i, true);
      i += 2;
      this.blocks.push(new Uint8Array(data, i, blockLength));
      i += blockLength;
    }

    this.nextBlockIndex = 0;
    this.pulseGenerator = new PulseGenerator(function (generator) {
      if (_this.blocks.length === 0) return false;
      var block = _this.blocks[_this.nextBlockIndex];
      _this.nextBlockIndex = (_this.nextBlockIndex + 1) % _this.blocks.length;

      if (block[0] & 0x80) {
        // add short leader tone for data block
        generator.addSegment(new ToneSegment(2168, 3223));
      } else {
        // add long leader tone for header block
        generator.addSegment(new ToneSegment(2168, 8063));
      }

      generator.addSegment(new PulseSequenceSegment([667, 735]));
      generator.addSegment(new DataSegment(block, 855, 1710, 8));
      generator.addSegment(new PauseSegment(1000)); // return false if tape has ended

      return _this.nextBlockIndex != 0;
    });
  }

  (0, _createClass2["default"])(TAPFile, [{
    key: "getNextLoadableBlock",
    value: function getNextLoadableBlock() {
      if (this.blocks.length === 0) return null;
      var block = this.blocks[this.nextBlockIndex];
      this.nextBlockIndex = (this.nextBlockIndex + 1) % this.blocks.length;
      return block;
    }
  }], [{
    key: "isValid",
    value: function isValid(data) {
      /* test whether the given ArrayBuffer is a valid TAP file, i.e. EOF is consistent with the
      block lengths we read from the file */
      var pos = 0;
      var tap = new DataView(data);

      while (pos < data.byteLength) {
        if (pos + 1 >= data.byteLength) return false;
        /* EOF in the middle of a length word */

        var blockLength = tap.getUint16(pos, true);
        pos += blockLength + 2;
      }

      return pos == data.byteLength;
      /* file is a valid TAP if pos is exactly at EOF and no further */
    }
  }]);
  return TAPFile;
}();

exports.TAPFile = TAPFile;
;

var TZXFile = /*#__PURE__*/function () {
  function TZXFile(data) {
    var _this2 = this;

    (0, _classCallCheck2["default"])(this, TZXFile);
    this.blocks = [];
    var tzx = new DataView(data);
    var offset = 0x0a;

    while (offset < data.byteLength) {
      var blockType = tzx.getUint8(offset);
      offset++;

      switch (blockType) {
        case 0x10:
          (function () {
            var pause = tzx.getUint16(offset, true);
            offset += 2;
            var dataLength = tzx.getUint16(offset, true);
            offset += 2;
            var blockData = new Uint8Array(data, offset, dataLength);

            _this2.blocks.push({
              'type': 'StandardSpeedData',
              'pause': pause,
              'data': blockData,
              'generatePulses': function generatePulses(generator) {
                if (blockData[0] & 0x80) {
                  // add short leader tone for data block
                  generator.addSegment(new ToneSegment(2168, 3223));
                } else {
                  // add long leader tone for header block
                  generator.addSegment(new ToneSegment(2168, 8063));
                }

                generator.addSegment(new PulseSequenceSegment([667, 735]));
                generator.addSegment(new DataSegment(blockData, 855, 1710, 8));
                if (pause) generator.addSegment(new PauseSegment(pause));
              }
            });

            offset += dataLength;
          })();

          break;

        case 0x11:
          (function () {
            var pilotPulseLength = tzx.getUint16(offset, true);
            offset += 2;
            var syncPulse1Length = tzx.getUint16(offset, true);
            offset += 2;
            var syncPulse2Length = tzx.getUint16(offset, true);
            offset += 2;
            var zeroBitLength = tzx.getUint16(offset, true);
            offset += 2;
            var oneBitLength = tzx.getUint16(offset, true);
            offset += 2;
            var pilotPulseCount = tzx.getUint16(offset, true);
            offset += 2;
            var lastByteMask = tzx.getUint8(offset);
            offset += 1;
            var pause = tzx.getUint16(offset, true);
            offset += 2;
            var dataLength = tzx.getUint16(offset, true) | tzx.getUint8(offset + 2) << 16;
            offset += 3;
            var blockData = new Uint8Array(data, offset, dataLength);

            _this2.blocks.push({
              'type': 'TurboSpeedData',
              'pilotPulseLength': pilotPulseLength,
              'syncPulse1Length': syncPulse1Length,
              'syncPulse2Length': syncPulse2Length,
              'zeroBitLength': zeroBitLength,
              'oneBitLength': oneBitLength,
              'pilotPulseCount': pilotPulseCount,
              'lastByteMask': lastByteMask,
              'pause': pause,
              'data': blockData,
              'generatePulses': function generatePulses(generator) {
                generator.addSegment(new ToneSegment(pilotPulseLength, pilotPulseCount));
                generator.addSegment(new PulseSequenceSegment([syncPulse1Length, syncPulse2Length]));
                generator.addSegment(new DataSegment(blockData, zeroBitLength, oneBitLength, lastByteMask));
                if (pause) generator.addSegment(new PauseSegment(pause));
              }
            });

            offset += dataLength;
          })();

          break;

        case 0x12:
          (function () {
            var pulseLength = tzx.getUint16(offset, true);
            offset += 2;
            var pulseCount = tzx.getUint16(offset, true);
            offset += 2;

            _this2.blocks.push({
              'type': 'PureTone',
              'pulseLength': pulseLength,
              'pulseCount': pulseCount,
              'generatePulses': function generatePulses(generator) {
                generator.addSegment(new ToneSegment(pulseLength, pulseCount));
              }
            });
          })();

          break;

        case 0x13:
          (function () {
            var pulseCount = tzx.getUint8(offset);
            offset += 1;
            var pulseLengths = [];

            for (var i = 0; i < pulseCount; i++) {
              pulseLengths[i] = tzx.getUint16(offset + i * 2, true);
            }

            _this2.blocks.push({
              'type': 'PulseSequence',
              'pulseLengths': pulseLengths,
              'generatePulses': function generatePulses(generator) {
                generator.addSegment(new PulseSequenceSegment(pulseLengths));
              }
            });

            offset += pulseCount * 2;
          })();

          break;

        case 0x14:
          (function () {
            var zeroBitLength = tzx.getUint16(offset, true);
            offset += 2;
            var oneBitLength = tzx.getUint16(offset, true);
            offset += 2;
            var lastByteMask = tzx.getUint8(offset);
            offset += 1;
            var pause = tzx.getUint16(offset, true);
            offset += 2;
            var dataLength = tzx.getUint16(offset, true) | tzx.getUint8(offset + 2) << 16;
            offset += 3;
            var blockData = new Uint8Array(data, offset, dataLength);

            _this2.blocks.push({
              'type': 'PureData',
              'zeroBitLength': zeroBitLength,
              'oneBitLength': oneBitLength,
              'lastByteMask': lastByteMask,
              'pause': pause,
              'data': blockData,
              'generatePulses': function generatePulses(generator) {
                generator.addSegment(new DataSegment(blockData, zeroBitLength, oneBitLength, lastByteMask));
                if (pause) generator.addSegment(new PauseSegment(pause));
              }
            });

            offset += dataLength;
          })();

          break;

        case 0x15:
          (function () {
            var tstatesPerSample = tzx.getUint16(offset, true);
            offset += 2;
            var pause = tzx.getUint16(offset, true);
            offset += 2;
            var lastByteMask = tzx.getUint8(offset);
            offset += 1;
            var dataLength = tzx.getUint16(offset, true) | tzx.getUint8(offset + 2) << 16;
            offset += 3;

            _this2.blocks.push({
              'type': 'DirectRecording',
              'tstatesPerSample': tstatesPerSample,
              'lastByteMask': lastByteMask,
              'pause': pause,
              'data': new Uint8Array(data, offset, dataLength)
            });

            offset += dataLength;
          })();

          break;

        case 0x20:
          (function () {
            // TODO: handle pause length of 0 (= stop tape)
            var pause = tzx.getUint16(offset, true);
            offset += 2;

            _this2.blocks.push({
              'type': 'Pause',
              'pause': pause,
              'generatePulses': function generatePulses(generator) {
                generator.addSegment(new PauseSegment(pause));
              }
            });
          })();

          break;

        case 0x21:
          (function () {
            var nameLength = tzx.getUint8(offset);
            offset += 1;
            var nameBytes = new Uint8Array(data, offset, nameLength);
            offset += nameLength;
            var name = String.fromCharCode.apply(null, nameBytes);

            _this2.blocks.push({
              'type': 'GroupStart',
              'name': name
            });
          })();

          break;

        case 0x22:
          (function () {
            _this2.blocks.push({
              'type': 'GroupEnd'
            });
          })();

          break;

        case 0x23:
          (function () {
            var jumpOffset = tzx.getUint16(offset, true);
            offset += 2;

            _this2.blocks.push({
              'type': 'JumpToBlock',
              'offset': jumpOffset
            });
          })();

          break;

        case 0x24:
          (function () {
            var repeatCount = tzx.getUint16(offset, true);
            offset += 2;

            _this2.blocks.push({
              'type': 'LoopStart',
              'repeatCount': repeatCount
            });
          })();

          break;

        case 0x25:
          (function () {
            _this2.blocks.push({
              'type': 'LoopEnd'
            });
          })();

          break;

        case 0x26:
          (function () {
            var callCount = tzx.getUint16(offset, true);
            offset += 2;
            var offsets = [];

            for (var i = 0; i < callCount; i++) {
              offsets[i] = tzx.getUint16(offset + i * 2, true);
            }

            _this2.blocks.push({
              'type': 'CallSequence',
              'offsets': offsets
            });

            offset += callCount * 2;
          })();

          break;

        case 0x27:
          (function () {
            _this2.blocks.push({
              'type': 'ReturnFromSequence'
            });
          })();

          break;

        case 0x28:
          (function () {
            var blockLength = tzx.getUint16(offset, true);
            offset += 2;
            /* This is a silly block. Don't bother parsing it further. */

            _this2.blocks.push({
              'type': 'Select',
              'data': new Uint8Array(data, offset, blockLength)
            });

            offset += blockLength;
          })();

          break;

        case 0x30:
          (function () {
            var textLength = tzx.getUint8(offset);
            offset += 1;
            var textBytes = new Uint8Array(data, offset, textLength);
            offset += textLength;
            var text = String.fromCharCode.apply(null, textBytes);

            _this2.blocks.push({
              'type': 'TextDescription',
              'text': text
            });
          })();

          break;

        case 0x31:
          (function () {
            var displayTime = tzx.getUint8(offset);
            offset += 1;
            var textLength = tzx.getUint8(offset);
            offset += 1;
            var textBytes = new Uint8Array(data, offset, textLength);
            offset += textLength;
            var text = String.fromCharCode.apply(null, textBytes);

            _this2.blocks.push({
              'type': 'MessageBlock',
              'displayTime': displayTime,
              'text': text
            });
          })();

          break;

        case 0x32:
          (function () {
            var blockLength = tzx.getUint16(offset, true);
            offset += 2;

            _this2.blocks.push({
              'type': 'ArchiveInfo',
              'data': new Uint8Array(data, offset, blockLength)
            });

            offset += blockLength;
          })();

          break;

        case 0x33:
          (function () {
            var blockLength = tzx.getUint8(offset) * 3;
            offset += 1;

            _this2.blocks.push({
              'type': 'HardwareType',
              'data': new Uint8Array(data, offset, blockLength)
            });

            offset += blockLength;
          })();

          break;

        case 0x35:
          (function () {
            var identifierBytes = new Uint8Array(data, offset, 10);
            offset += 10;
            var identifier = String.fromCharCode.apply(null, identifierBytes);
            var dataLength = tzx.getUint32(offset, true);

            _this2.blocks.push({
              'type': 'CustomInfo',
              'identifier': identifier,
              'data': new Uint8Array(data, offset, dataLength)
            });

            offset += dataLength;
          })();

          break;

        case 0x5A:
          (function () {
            offset += 9;

            _this2.blocks.push({
              'type': 'Glue'
            });
          })();

          break;

        default:
          (function () {
            /* follow extension rule: next 4 bytes = length of block */
            var blockLength = tzx.getUint32(offset, true);
            offset += 4;

            _this2.blocks.push({
              'type': 'unknown',
              'data': new Uint8Array(data, offset, blockLength)
            });

            offset += blockLength;
          })();

      }
    }

    this.nextBlockIndex = 0;
    this.loopToBlockIndex;
    this.repeatCount;
    this.callStack = [];
    this.pulseGenerator = new PulseGenerator(function (generator) {
      var block = _this2.getNextMeaningfulBlock(false);

      if (!block) return false;
      block.generatePulses(generator);
      return true;
    });
  }

  (0, _createClass2["default"])(TZXFile, [{
    key: "getNextMeaningfulBlock",
    value: function getNextMeaningfulBlock(wrapAtEnd) {
      var startedAtZero = this.nextBlockIndex === 0;

      while (true) {
        if (this.nextBlockIndex >= this.blocks.length) {
          if (startedAtZero || !wrapAtEnd) return null;
          /* have looped around; quit now */

          this.nextBlockIndex = 0;
          startedAtZero = true;
        }

        var block = this.blocks[this.nextBlockIndex];

        switch (block.type) {
          case 'StandardSpeedData':
          case 'TurboSpeedData':
          case 'PureTone':
          case 'PulseSequence':
          case 'PureData':
          case 'DirectRecording':
          case 'Pause':
            /* found a meaningful block */
            this.nextBlockIndex++;
            return block;

          case 'JumpToBlock':
            this.nextBlockIndex += block.offset;
            break;

          case 'LoopStart':
            this.loopToBlockIndex = this.nextBlockIndex + 1;
            this.repeatCount = block.repeatCount;
            this.nextBlockIndex++;
            break;

          case 'LoopEnd':
            this.repeatCount--;

            if (this.repeatCount > 0) {
              this.nextBlockIndex = this.loopToBlockIndex;
            } else {
              this.nextBlockIndex++;
            }

            break;

          case 'CallSequence':
            /* push the future destinations (where to go on reaching a ReturnFromSequence block)
                onto the call stack in reverse order, starting with the block immediately
                after the CallSequence (which we go to when leaving the sequence) */
            this.callStack.unshift(this.nextBlockIndex + 1);

            for (var i = block.offsets.length - 1; i >= 0; i--) {
              this.callStack.unshift(this.nextBlockIndex + block.offsets[i]);
            }
            /* now visit the first destination on the list */


            this.nextBlockIndex = this.callStack.shift();
            break;

          case 'ReturnFromSequence':
            this.nextBlockIndex = this.callStack.shift();
            break;

          default:
            /* not one of the types we care about; skip past it */
            this.nextBlockIndex++;
        }
      }
    }
  }, {
    key: "getNextLoadableBlock",
    value: function getNextLoadableBlock() {
      while (true) {
        var block = this.getNextMeaningfulBlock(true);
        if (!block) return null;

        if (block.type == 'StandardSpeedData' || block.type == 'TurboSpeedData') {
          return block.data;
        }
        /* FIXME: avoid infinite loop if the TZX file consists only of meaningful but non-loadable blocks */

      }
    }
  }], [{
    key: "isValid",
    value: function isValid(data) {
      var tzx = new DataView(data);
      var signature = "ZXTape!\x1A";

      for (var i = 0; i < signature.length; i++) {
        if (signature.charCodeAt(i) != tzx.getUint8(i)) {
          return false;
        }
      }

      return true;
    }
  }]);
  return TZXFile;
}();

exports.TZXFile = TZXFile;
;
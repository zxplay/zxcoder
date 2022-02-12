"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioHandler = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ENABLE_OSCILLOSCOPE = false;
var BUFFER_SIZE = 0x10000;

var AudioHandler = /*#__PURE__*/function () {
  function AudioHandler() {
    (0, _classCallCheck2["default"])(this, AudioHandler);
    this.isActive = false;

    if (ENABLE_OSCILLOSCOPE) {
      this.canvas = document.createElement('canvas');
      document.body.appendChild(this.canvas);
      this.canvasCtx = this.canvas.getContext('2d');
    }
  }

  (0, _createClass2["default"])(AudioHandler, [{
    key: "start",
    value: function start() {
      var _this = this;

      var AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext({
        latencyHint: 'interactive'
      });
      this.samplesPerFrame = this.audioContext.sampleRate / 50;
      this.frameBuffers = [new ArrayBuffer(this.samplesPerFrame * 4), new ArrayBuffer(this.samplesPerFrame * 4)];
      this.leftBuffer = new Float32Array(BUFFER_SIZE);
      this.rightBuffer = new Float32Array(BUFFER_SIZE);
      this.readPtr = 0;
      this.writePtr = 0;
      this.scriptNode = this.audioContext.createScriptProcessor(0, 0, 2);

      this.scriptNode.onaudioprocess = function (audioProcessingEvent) {
        var outputBuffer = audioProcessingEvent.outputBuffer;
        var leftData = outputBuffer.getChannelData(0);
        var rightData = outputBuffer.getChannelData(1);
        var availableDataLength = _this.writePtr - _this.readPtr;
        if (availableDataLength < 0) availableDataLength += BUFFER_SIZE;

        if (availableDataLength >= leftData.length) {
          // enough data is available to fill the buffer
          if (_this.readPtr + leftData.length <= BUFFER_SIZE) {
            // can copy all in one go
            leftData.set(_this.leftBuffer.slice(_this.readPtr, _this.readPtr + leftData.length));
            rightData.set(_this.rightBuffer.slice(_this.readPtr, _this.readPtr + rightData.length));
            _this.readPtr = (_this.readPtr + leftData.length) % BUFFER_SIZE;
          } else {
            // straddles the end of our circular buffer - need to copy in two steps
            var firstChunkLength = BUFFER_SIZE - _this.readPtr;
            var secondChunkLength = leftData.length - firstChunkLength;
            leftData.set(_this.leftBuffer.slice(_this.readPtr, _this.readPtr + firstChunkLength));
            rightData.set(_this.rightBuffer.slice(_this.readPtr, _this.readPtr + firstChunkLength));
            leftData.set(_this.leftBuffer.slice(0, secondChunkLength), firstChunkLength);
            rightData.set(_this.rightBuffer.slice(0, secondChunkLength), firstChunkLength);
            _this.readPtr = secondChunkLength;
          }

          if (ENABLE_OSCILLOSCOPE) {
            _this.drawOscilloscope(leftData, rightData);
          }
        }
      };

      this.scriptNode.connect(this.audioContext.destination);
      this.isActive = true;

      if (ENABLE_OSCILLOSCOPE) {
        this.canvas.width = this.samplesPerFrame;
        this.canvas.height = 64;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.scriptNode.disconnect(this.audioContext.destination);
      this.audioContext.close();
    }
  }, {
    key: "frameCompleted",
    value: function frameCompleted(audioBufferLeft, audioBufferRight) {
      this.frameBuffers[0] = audioBufferLeft;
      this.frameBuffers[1] = audioBufferRight;
      if (!this.isActive) return;
      var dataLength = audioBufferLeft.byteLength / 4;

      if (this.writePtr + dataLength <= BUFFER_SIZE) {
        /* can copy all in one go */
        var leftData = new Float32Array(audioBufferLeft);
        var rightData = new Float32Array(audioBufferRight);
        this.leftBuffer.set(leftData, this.writePtr);
        this.rightBuffer.set(rightData, this.writePtr);
        this.writePtr = (this.writePtr + dataLength) % BUFFER_SIZE;
      } else {
        /* straddles the end of our circular buffer - need to copy in two steps */
        var firstChunkLength = BUFFER_SIZE - this.writePtr;
        var secondChunkLength = dataLength - firstChunkLength;
        var leftData1 = new Float32Array(audioBufferLeft, 0, firstChunkLength);
        var rightData1 = new Float32Array(audioBufferRight, 0, firstChunkLength);
        this.leftBuffer.set(leftData1, this.writePtr);
        this.rightBuffer.set(rightData1, this.writePtr);
        var leftData2 = new Float32Array(audioBufferLeft, firstChunkLength * 4, secondChunkLength);
        var rightData2 = new Float32Array(audioBufferRight, firstChunkLength * 4, secondChunkLength);
        this.leftBuffer.set(leftData2, 0);
        this.rightBuffer.set(rightData2, 0);
        this.writePtr = secondChunkLength;
      }
    }
  }, {
    key: "drawOscilloscope",
    value: function drawOscilloscope(leftBuffer, rightBuffer) {
      this.canvasCtx.fillStyle = '#000';
      this.canvasCtx.strokeStyle = '#0f0';
      this.canvasCtx.fillRect(0, 0, this.samplesPerFrame, 64);
      var leftData = new Float32Array(leftBuffer);
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(0, 16);

      for (var i = 0; i < this.samplesPerFrame; i++) {
        this.canvasCtx.lineTo(i, 16 - leftData[i] * 16);
      }

      this.canvasCtx.stroke();
      var rightData = new Float32Array(rightBuffer);
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(0, 48);

      for (var _i = 0; _i < this.samplesPerFrame; _i++) {
        this.canvasCtx.lineTo(_i, 48 - rightData[_i] * 16);
      }

      this.canvasCtx.stroke();
    }
  }]);
  return AudioHandler;
}();

exports.AudioHandler = AudioHandler;
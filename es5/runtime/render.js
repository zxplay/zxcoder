"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayHandler = exports.CanvasRenderer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _constants = require("./constants.js");

var CanvasRenderer = /*#__PURE__*/function () {
  function CanvasRenderer(canvas) {
    (0, _classCallCheck2["default"])(this, CanvasRenderer);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.imageData = this.ctx.getImageData(0, 0, 320, 240);
    this.pixels = new Uint32Array(this.imageData.data.buffer);
    this.flashPhase = 0;
    this.palette = new Uint32Array([
    /* RGBA dark */
    0x000000ff, 0x0000ddff, 0xdd0000ff, 0xdd00ddff, 0x00dd00ff, 0x00ddddff, 0xdddd00ff, 0xddddddff,
    /* RGBA bright */
    0x000000ff, 0x0000ffff, 0xff0000ff, 0xff00ffff, 0x00ff00ff, 0x00ffffff, 0xffff00ff, 0xffffffff]);
    var testUint8 = new Uint8Array(new Uint16Array([0x8000]).buffer);
    var isLittleEndian = testUint8[0] === 0;

    if (isLittleEndian) {
      /* need to reverse the byte ordering of palette */
      for (var i = 0; i < 16; i++) {
        var color = this.palette[i];
        this.palette[i] = color << 24 & 0xff000000 | color << 8 & 0xff0000 | color >>> 8 & 0xff00 | color >>> 24 & 0xff;
      }
    }
  }

  (0, _createClass2["default"])(CanvasRenderer, [{
    key: "showFrame",
    value: function showFrame(frameBuffer) {
      var frameBytes = new Uint8Array(frameBuffer);
      var pixelPtr = 0;
      var bufferPtr = 0;
      /* top border */

      for (var y = 0; y < 24; y++) {
        for (var x = 0; x < 160; x++) {
          var border = this.palette[frameBytes[bufferPtr++]];
          this.pixels[pixelPtr++] = border;
          this.pixels[pixelPtr++] = border;
        }
      }

      for (var _y = 0; _y < 192; _y++) {
        /* left border */
        for (var _x = 0; _x < 16; _x++) {
          var _border = this.palette[frameBytes[bufferPtr++]];
          this.pixels[pixelPtr++] = _border;
          this.pixels[pixelPtr++] = _border;
        }
        /* main screen */


        for (var _x2 = 0; _x2 < 32; _x2++) {
          var bitmap = frameBytes[bufferPtr++];
          var attr = frameBytes[bufferPtr++];
          var ink = void 0,
              paper = void 0;

          if (attr & 0x80 && this.flashPhase & 0x10) {
            // reverse ink and paper
            paper = this.palette[(attr & 0x40) >> 3 | attr & 0x07];
            ink = this.palette[(attr & 0x78) >> 3];
          } else {
            ink = this.palette[(attr & 0x40) >> 3 | attr & 0x07];
            paper = this.palette[(attr & 0x78) >> 3];
          }

          for (var i = 0; i < 8; i++) {
            this.pixels[pixelPtr++] = bitmap & 0x80 ? ink : paper;
            bitmap <<= 1;
          }
        }
        /* right border */


        for (var _x3 = 0; _x3 < 16; _x3++) {
          var _border2 = this.palette[frameBytes[bufferPtr++]];
          this.pixels[pixelPtr++] = _border2;
          this.pixels[pixelPtr++] = _border2;
        }
      }
      /* bottom border */


      for (var _y2 = 0; _y2 < 24; _y2++) {
        for (var _x4 = 0; _x4 < 160; _x4++) {
          var _border3 = this.palette[frameBytes[bufferPtr++]];
          this.pixels[pixelPtr++] = _border3;
          this.pixels[pixelPtr++] = _border3;
        }
      }

      this.ctx.putImageData(this.imageData, 0, 0);
      this.flashPhase = this.flashPhase + 1 & 0x1f;
    }
  }]);
  return CanvasRenderer;
}();

exports.CanvasRenderer = CanvasRenderer;

var DisplayHandler = /*#__PURE__*/function () {
  /*
  Handles triple-buffering so that at any given time we can have:
  - one buffer being drawn to the screen by the renderer
  - one buffer just finished being built by the worker process and waiting to be shown
    on the next animation frame
  - one buffer buffer being built by the worker process
  */
  function DisplayHandler(canvas) {
    (0, _classCallCheck2["default"])(this, DisplayHandler);
    this.renderer = new CanvasRenderer(canvas);
    this.frameBuffers = [new ArrayBuffer(_constants.FRAME_BUFFER_SIZE), new ArrayBuffer(_constants.FRAME_BUFFER_SIZE), new ArrayBuffer(_constants.FRAME_BUFFER_SIZE)];
    this.bufferBeingShown = null;
    this.bufferAwaitingShow = null;
    this.lockedBuffer = null;
  }

  (0, _createClass2["default"])(DisplayHandler, [{
    key: "frameCompleted",
    value: function frameCompleted(newFrameBuffer) {
      this.frameBuffers[this.lockedBuffer] = newFrameBuffer;
      this.bufferAwaitingShow = this.lockedBuffer;
      this.lockedBuffer = null;
    }
  }, {
    key: "getNextFrameBufferIndex",
    value: function getNextFrameBufferIndex() {
      for (var i = 0; i < 3; i++) {
        if (i !== this.bufferBeingShown && i !== this.bufferAwaitingShow) {
          return i;
        }
      }
    }
  }, {
    key: "getNextFrameBuffer",
    value: function getNextFrameBuffer() {
      this.lockedBuffer = this.getNextFrameBufferIndex();
      return this.frameBuffers[this.lockedBuffer];
    }
  }, {
    key: "readyToShow",
    value: function readyToShow() {
      return this.bufferAwaitingShow !== null;
    }
  }, {
    key: "show",
    value: function show() {
      this.bufferBeingShown = this.bufferAwaitingShow;
      this.bufferAwaitingShow = null;
      this.renderer.showFrame(this.frameBuffers[this.bufferBeingShown]);
      this.bufferBeingShown = null;
    }
  }]);
  return DisplayHandler;
}();

exports.DisplayHandler = DisplayHandler;
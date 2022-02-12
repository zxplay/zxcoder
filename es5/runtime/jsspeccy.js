"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _events = _interopRequireDefault(require("events"));

var _fileDialog = _interopRequireDefault(require("file-dialog"));

var _jszip = _interopRequireDefault(require("jszip"));

var _render = require("./render.js");

var _ui = require("./ui.js");

var _snapshot = require("./snapshot.js");

var _tape = require("./tape.js");

var _keyboard = require("./keyboard.js");

var _audio = require("./audio.js");

var _open = _interopRequireDefault(require("./icons/open.svg"));

var _reset = _interopRequireDefault(require("./icons/reset.svg"));

var _play = _interopRequireDefault(require("./icons/play.svg"));

var _pause = _interopRequireDefault(require("./icons/pause.svg"));

var _fullscreen = _interopRequireDefault(require("./icons/fullscreen.svg"));

var _exitfullscreen = _interopRequireDefault(require("./icons/exitfullscreen.svg"));

var _tape_play = _interopRequireDefault(require("./icons/tape_play.svg"));

var _tape_pause = _interopRequireDefault(require("./icons/tape_pause.svg"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var scriptUrl = document.currentScript.src;

var Emulator = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(Emulator, _EventEmitter);

  var _super = _createSuper(Emulator);

  function Emulator(canvas, opts) {
    var _this;

    (0, _classCallCheck2["default"])(this, Emulator);
    _this = _super.call(this);
    _this.canvas = canvas;
    _this.worker = new Worker(new URL('jsspeccy-worker.js', scriptUrl));
    _this.keyboardHandler = new _keyboard.KeyboardHandler(_this.worker);
    _this.displayHandler = new _render.DisplayHandler(_this.canvas);
    _this.audioHandler = new _audio.AudioHandler();
    _this.isRunning = false;
    _this.isInitiallyPaused = !opts.autoStart;
    _this.autoLoadTapes = opts.autoLoadTapes || false;
    _this.tapeAutoLoadMode = opts.tapeAutoLoadMode || 'default'; // or usr0

    _this.tapeIsPlaying = false;
    _this.tapeTrapsEnabled = 'tapeTrapsEnabled' in opts ? opts.tapeTrapsEnabled : true;
    _this.msPerFrame = 20;
    _this.isExecutingFrame = false;
    _this.nextFrameTime = null;
    _this.machineType = null;
    _this.nextFileOpenID = 0;
    _this.fileOpenPromiseResolutions = {};

    _this.worker.onmessage = function (e) {
      switch (e.data.message) {
        case 'ready':
          _this.loadRoms().then(function () {
            _this.setMachine(opts.machine || 128);

            _this.setTapeTraps(_this.tapeTrapsEnabled);

            if (opts.openUrl) {
              _this.openUrlList(opts.openUrl)["catch"](function (err) {
                alert(err);
              }).then(function () {
                if (opts.autoStart) _this.start();
              });
            } else if (opts.autoStart) {
              _this.start();
            }
          });

          break;

        case 'frameCompleted':
          // benchmarkRunCount++;
          if ('audioBufferLeft' in e.data) {
            _this.audioHandler.frameCompleted(e.data.audioBufferLeft, e.data.audioBufferRight);
          }

          _this.displayHandler.frameCompleted(e.data.frameBuffer);

          if (_this.isRunning) {
            var time = performance.now();

            if (time > _this.nextFrameTime) {
              /* running at full blast - start next frame but adjust time base
              to give it the full time allocation */
              _this.runFrame();

              _this.nextFrameTime = time + _this.msPerFrame;
            } else {
              _this.isExecutingFrame = false;
            }
          } else {
            _this.isExecutingFrame = false;
          }

          break;

        case 'fileOpened':
          if (e.data.mediaType == 'tape' && _this.autoLoadTapes) {
            var TAPE_LOADERS_BY_MACHINE = {
              '48': {
                'default': '../tapeloaders/tape_48.szx',
                'usr0': 'tapeloaders/tape_48.szx'
              },
              '128': {
                'default': '../tapeloaders/tape_128.szx',
                'usr0': 'tapeloaders/tape_128_usr0.szx'
              },
              '5': {
                'default': '../tapeloaders/tape_pentagon.szx',
                'usr0': 'tapeloaders/tape_pentagon_usr0.szx'
              }
            };

            _this.openUrl(new URL(TAPE_LOADERS_BY_MACHINE[_this.machineType][_this.tapeAutoLoadMode], scriptUrl));

            if (!_this.tapeTrapsEnabled) {
              _this.playTape();
            }
          }

          _this.fileOpenPromiseResolutions[e.data.id]({
            mediaType: e.data.mediaType
          });

          if (e.data.mediaType == 'tape') {
            _this.emit('openedTapeFile');
          }

          break;

        case 'playingTape':
          _this.tapeIsPlaying = true;

          _this.emit('playingTape');

          break;

        case 'stoppedTape':
          _this.tapeIsPlaying = false;

          _this.emit('stoppedTape');

          break;

        default:
          console.log('message received by host:', e.data);
      }
    };

    _this.worker.postMessage({
      message: 'loadCore',
      baseUrl: scriptUrl
    });

    return _this;
  }

  (0, _createClass2["default"])(Emulator, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      if (!this.isRunning) {
        this.isRunning = true;
        this.isInitiallyPaused = false;
        this.nextFrameTime = performance.now();
        this.keyboardHandler.start();
        this.audioHandler.start();
        this.emit('start');
        window.requestAnimationFrame(function (t) {
          _this2.runAnimationFrame(t);
        });
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.isRunning) {
        this.isRunning = false;
        this.keyboardHandler.stop();
        this.audioHandler.stop();
        this.emit('pause');
      }
    }
  }, {
    key: "loadRom",
    value: function () {
      var _loadRom = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url, page) {
        var response, data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetch(new URL(url, scriptUrl));

              case 2:
                response = _context.sent;
                _context.t0 = Uint8Array;
                _context.next = 6;
                return response.arrayBuffer();

              case 6:
                _context.t1 = _context.sent;
                data = new _context.t0(_context.t1);
                this.worker.postMessage({
                  message: 'loadMemory',
                  data: data,
                  page: page
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadRom(_x, _x2) {
        return _loadRom.apply(this, arguments);
      }

      return loadRom;
    }()
  }, {
    key: "loadRoms",
    value: function () {
      var _loadRoms = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.loadRom('../roms/128-0.rom', 8);

              case 2:
                _context2.next = 4;
                return this.loadRom('../roms/128-1.rom', 9);

              case 4:
                _context2.next = 6;
                return this.loadRom('../roms/48.rom', 10);

              case 6:
                _context2.next = 8;
                return this.loadRom('../roms/pentagon-0.rom', 12);

              case 8:
                _context2.next = 10;
                return this.loadRom('../roms/trdos.rom', 13);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loadRoms() {
        return _loadRoms.apply(this, arguments);
      }

      return loadRoms;
    }()
  }, {
    key: "runFrame",
    value: function runFrame() {
      this.isExecutingFrame = true;
      var frameBuffer = this.displayHandler.getNextFrameBuffer();

      if (this.audioHandler.isActive) {
        var _this$audioHandler$fr = (0, _slicedToArray2["default"])(this.audioHandler.frameBuffers, 2),
            audioBufferLeft = _this$audioHandler$fr[0],
            audioBufferRight = _this$audioHandler$fr[1];

        this.worker.postMessage({
          message: 'runFrame',
          frameBuffer: frameBuffer,
          audioBufferLeft: audioBufferLeft,
          audioBufferRight: audioBufferRight
        }, [frameBuffer, audioBufferLeft, audioBufferRight]);
      } else {
        this.worker.postMessage({
          message: 'runFrame',
          frameBuffer: frameBuffer
        }, [frameBuffer]);
      }
    }
  }, {
    key: "runAnimationFrame",
    value: function runAnimationFrame(time) {
      var _this3 = this;

      if (this.displayHandler.readyToShow()) {
        this.displayHandler.show(); // benchmarkRenderCount++;
      }

      if (this.isRunning) {
        if (time > this.nextFrameTime && !this.isExecutingFrame) {
          this.runFrame();
          this.nextFrameTime += this.msPerFrame;
        }

        window.requestAnimationFrame(function (t) {
          _this3.runAnimationFrame(t);
        });
      }
    }
  }, {
    key: "setMachine",
    value: function setMachine(type) {
      if (type != 128 && type != 5) type = 48;
      this.worker.postMessage({
        message: 'setMachineType',
        type: type
      });
      this.machineType = type;
      this.emit('setMachine', type);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.worker.postMessage({
        message: 'reset'
      });
    }
  }, {
    key: "loadSnapshot",
    value: function loadSnapshot(snapshot) {
      var _this4 = this;

      var fileID = this.nextFileOpenID++;
      this.worker.postMessage({
        message: 'loadSnapshot',
        id: fileID,
        snapshot: snapshot
      });
      this.emit('setMachine', snapshot.model);
      return new Promise(function (resolve, reject) {
        _this4.fileOpenPromiseResolutions[fileID] = resolve;
      });
    }
  }, {
    key: "openTAPFile",
    value: function openTAPFile(data) {
      var _this5 = this;

      var fileID = this.nextFileOpenID++;
      this.worker.postMessage({
        message: 'openTAPFile',
        id: fileID,
        data: data
      });
      return new Promise(function (resolve, reject) {
        _this5.fileOpenPromiseResolutions[fileID] = resolve;
      });
    }
  }, {
    key: "openTZXFile",
    value: function openTZXFile(data) {
      var _this6 = this;

      var fileID = this.nextFileOpenID++;
      this.worker.postMessage({
        message: 'openTZXFile',
        id: fileID,
        data: data
      });
      return new Promise(function (resolve, reject) {
        _this6.fileOpenPromiseResolutions[fileID] = resolve;
      });
    }
  }, {
    key: "getFileOpener",
    value: function getFileOpener(filename) {
      var _this7 = this;

      var cleanName = filename.toLowerCase();

      if (cleanName.endsWith('.z80')) {
        return function (arrayBuffer) {
          var z80file = (0, _snapshot.parseZ80File)(arrayBuffer);
          return _this7.loadSnapshot(z80file);
        };
      } else if (cleanName.endsWith('.szx')) {
        return function (arrayBuffer) {
          var szxfile = (0, _snapshot.parseSZXFile)(arrayBuffer);
          return _this7.loadSnapshot(szxfile);
        };
      } else if (cleanName.endsWith('.sna')) {
        return function (arrayBuffer) {
          var snafile = (0, _snapshot.parseSNAFile)(arrayBuffer);
          return _this7.loadSnapshot(snafile);
        };
      } else if (cleanName.endsWith('.tap')) {
        return function (arrayBuffer) {
          if (!_tape.TAPFile.isValid(arrayBuffer)) {
            alert('Invalid TAP file');
          } else {
            return _this7.openTAPFile(arrayBuffer);
          }
        };
      } else if (cleanName.endsWith('.tzx')) {
        return function (arrayBuffer) {
          if (!_tape.TZXFile.isValid(arrayBuffer)) {
            alert('Invalid TZX file');
          } else {
            return _this7.openTZXFile(arrayBuffer);
          }
        };
      } else if (cleanName.endsWith('.zip')) {
        return /*#__PURE__*/function () {
          var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(arrayBuffer) {
            var zip, openers;
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return _jszip["default"].loadAsync(arrayBuffer);

                  case 2:
                    zip = _context4.sent;
                    openers = [];
                    zip.forEach(function (path, file) {
                      if (path.startsWith('__MACOSX/')) return;

                      var opener = _this7.getFileOpener(path);

                      if (opener) {
                        var boundOpener = /*#__PURE__*/function () {
                          var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                            var buf;
                            return _regenerator["default"].wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return file.async('arraybuffer');

                                  case 2:
                                    buf = _context3.sent;
                                    return _context3.abrupt("return", opener(buf));

                                  case 4:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function boundOpener() {
                            return _ref2.apply(this, arguments);
                          };
                        }();

                        openers.push(boundOpener);
                      }
                    });

                    if (!(openers.length == 1)) {
                      _context4.next = 9;
                      break;
                    }

                    return _context4.abrupt("return", openers[0]());

                  case 9:
                    if (!(openers.length == 0)) {
                      _context4.next = 13;
                      break;
                    }

                    throw 'No loadable files found inside ZIP file: ' + filename;

                  case 13:
                    throw 'Multiple loadable files found inside ZIP file: ' + filename;

                  case 14:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          return function (_x3) {
            return _ref.apply(this, arguments);
          };
        }();
      }
    }
  }, {
    key: "openFile",
    value: function () {
      var _openFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(file) {
        var opener, buf;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                opener = this.getFileOpener(file.name);

                if (!opener) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 4;
                return file.arrayBuffer();

              case 4:
                buf = _context5.sent;
                return _context5.abrupt("return", opener(buf)["catch"](function (err) {
                  alert(err);
                }));

              case 8:
                throw 'Unrecognised file type: ' + file.name;

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function openFile(_x4) {
        return _openFile.apply(this, arguments);
      }

      return openFile;
    }()
  }, {
    key: "openUrl",
    value: function () {
      var _openUrl = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(url) {
        var opener, response, buf;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                opener = this.getFileOpener(url.toString());

                if (!opener) {
                  _context6.next = 11;
                  break;
                }

                _context6.next = 4;
                return fetch(url);

              case 4:
                response = _context6.sent;
                _context6.next = 7;
                return response.arrayBuffer();

              case 7:
                buf = _context6.sent;
                return _context6.abrupt("return", opener(buf));

              case 11:
                throw 'Unrecognised file type: ' + url.split('/').pop();

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function openUrl(_x5) {
        return _openUrl.apply(this, arguments);
      }

      return openUrl;
    }()
  }, {
    key: "openUrlList",
    value: function () {
      var _openUrlList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(urls) {
        var _iterator, _step, url;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(typeof urls === 'string')) {
                  _context7.next = 6;
                  break;
                }

                _context7.next = 3;
                return this.openUrl(urls);

              case 3:
                return _context7.abrupt("return", _context7.sent);

              case 6:
                _iterator = _createForOfIteratorHelper(urls);
                _context7.prev = 7;

                _iterator.s();

              case 9:
                if ((_step = _iterator.n()).done) {
                  _context7.next = 15;
                  break;
                }

                url = _step.value;
                _context7.next = 13;
                return this.openUrl(url);

              case 13:
                _context7.next = 9;
                break;

              case 15:
                _context7.next = 20;
                break;

              case 17:
                _context7.prev = 17;
                _context7.t0 = _context7["catch"](7);

                _iterator.e(_context7.t0);

              case 20:
                _context7.prev = 20;

                _iterator.f();

                return _context7.finish(20);

              case 23:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[7, 17, 20, 23]]);
      }));

      function openUrlList(_x6) {
        return _openUrlList.apply(this, arguments);
      }

      return openUrlList;
    }()
  }, {
    key: "setAutoLoadTapes",
    value: function setAutoLoadTapes(val) {
      this.autoLoadTapes = val;
      this.emit('setAutoLoadTapes', val);
    }
  }, {
    key: "setTapeTraps",
    value: function setTapeTraps(val) {
      this.tapeTrapsEnabled = val;
      this.worker.postMessage({
        message: 'setTapeTraps',
        value: val
      });
      this.emit('setTapeTraps', val);
    }
  }, {
    key: "playTape",
    value: function playTape() {
      this.worker.postMessage({
        message: 'playTape'
      });
    }
  }, {
    key: "stopTape",
    value: function stopTape() {
      this.worker.postMessage({
        message: 'stopTape'
      });
    }
  }, {
    key: "exit",
    value: function exit() {
      this.pause();
      this.worker.terminate();
    }
  }]);
  return Emulator;
}(_events["default"]);

window.JSSpeccy = function (container, opts) {
  // let benchmarkRunCount = 0;
  // let benchmarkRenderCount = 0;
  opts = opts || {};
  var canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 240;
  var emu = new Emulator(canvas, {
    machine: opts.machine || 48,
    autoStart: opts.autoStart || false,
    autoLoadTapes: opts.autoLoadTapes || false,
    tapeAutoLoadMode: opts.tapeAutoLoadMode || 'default',
    openUrl: opts.openUrl,
    tapeTrapsEnabled: 'tapeTrapsEnabled' in opts ? opts.tapeTrapsEnabled : true
  });
  var ui = new _ui.UIController(container, emu, {
    zoom: opts.zoom || 1,
    sandbox: opts.sandbox
  });
  var fileMenu = ui.menuBar.addMenu('File');

  if (!opts.sandbox) {
    fileMenu.addItem('Open...', function () {
      _openFileDialog();
    });
    fileMenu.addItem('Find games...', function () {
      openGameBrowser();
    });
    var autoLoadTapesMenuItem = fileMenu.addItem('Auto-load tapes', function () {
      emu.setAutoLoadTapes(!emu.autoLoadTapes);
    });

    var updateAutoLoadTapesCheckbox = function updateAutoLoadTapesCheckbox() {
      if (emu.autoLoadTapes) {
        autoLoadTapesMenuItem.setCheckbox();
      } else {
        autoLoadTapesMenuItem.unsetCheckbox();
      }
    };

    emu.on('setAutoLoadTapes', updateAutoLoadTapesCheckbox);
    updateAutoLoadTapesCheckbox();
  }

  var tapeTrapsMenuItem = fileMenu.addItem('Instant tape loading', function () {
    emu.setTapeTraps(!emu.tapeTrapsEnabled);
  });

  var updateTapeTrapsCheckbox = function updateTapeTrapsCheckbox() {
    if (emu.tapeTrapsEnabled) {
      tapeTrapsMenuItem.setCheckbox();
    } else {
      tapeTrapsMenuItem.unsetCheckbox();
    }
  };

  emu.on('setTapeTraps', updateTapeTrapsCheckbox);
  updateTapeTrapsCheckbox();
  var machineMenu = ui.menuBar.addMenu('Machine');
  var machine48Item = machineMenu.addItem('Spectrum 48K', function () {
    emu.setMachine(48);
  });
  var machine128Item = machineMenu.addItem('Spectrum 128K', function () {
    emu.setMachine(128);
  });
  var machinePentagonItem = machineMenu.addItem('Pentagon 128', function () {
    emu.setMachine(5);
  });
  var displayMenu = ui.menuBar.addMenu('Display');
  var zoomItemsBySize = {
    1: displayMenu.addItem('100%', function () {
      return ui.setZoom(1);
    }),
    2: displayMenu.addItem('200%', function () {
      return ui.setZoom(2);
    }),
    3: displayMenu.addItem('300%', function () {
      return ui.setZoom(3);
    })
  };
  var fullscreenItem = displayMenu.addItem('Fullscreen', function () {
    ui.enterFullscreen();
  });

  var setZoomCheckbox = function setZoomCheckbox(factor) {
    if (factor == 'fullscreen') {
      fullscreenItem.setBullet();

      for (var i in zoomItemsBySize) {
        zoomItemsBySize[i].unsetBullet();
      }
    } else {
      fullscreenItem.unsetBullet();

      for (var _i in zoomItemsBySize) {
        if (parseInt(_i) == factor) {
          zoomItemsBySize[_i].setBullet();
        } else {
          zoomItemsBySize[_i].unsetBullet();
        }
      }
    }
  };

  ui.on('setZoom', setZoomCheckbox);
  setZoomCheckbox(ui.zoom);
  emu.on('setMachine', function (type) {
    if (type == 48) {
      machine48Item.setBullet();
      machine128Item.unsetBullet();
      machinePentagonItem.unsetBullet();
    } else if (type == 128) {
      machine48Item.unsetBullet();
      machine128Item.setBullet();
      machinePentagonItem.unsetBullet();
    } else {
      // pentagon
      machine48Item.unsetBullet();
      machine128Item.unsetBullet();
      machinePentagonItem.setBullet();
    }
  });

  if (!opts.sandbox) {
    ui.toolbar.addButton(_open["default"], {
      label: 'Open file'
    }, function () {
      _openFileDialog();
    });
  }

  ui.toolbar.addButton(_reset["default"], {
    label: 'Reset'
  }, function () {
    emu.reset();
  });
  var pauseButton = ui.toolbar.addButton(_play["default"], {
    label: 'Unpause'
  }, function () {
    if (emu.isRunning) {
      emu.pause();
    } else {
      emu.start();
    }
  });
  emu.on('pause', function () {
    pauseButton.setIcon(_play["default"]);
    pauseButton.setLabel('Unpause');
  });
  emu.on('start', function () {
    pauseButton.setIcon(_pause["default"]);
    pauseButton.setLabel('Pause');
  });
  var tapeButton = ui.toolbar.addButton(_tape_play["default"], {
    label: 'Start tape'
  }, function () {
    if (emu.tapeIsPlaying) {
      emu.stopTape();
    } else {
      emu.playTape();
    }
  });
  tapeButton.disable();
  emu.on('openedTapeFile', function () {
    tapeButton.enable();
  });
  emu.on('playingTape', function () {
    tapeButton.setIcon(_tape_pause["default"]);
    tapeButton.setLabel('Stop tape');
  });
  emu.on('stoppedTape', function () {
    tapeButton.setIcon(_tape_play["default"]);
    tapeButton.setLabel('Start tape');
  });
  var fullscreenButton = ui.toolbar.addButton(_fullscreen["default"], {
    label: 'Enter full screen mode',
    align: 'right'
  }, function () {
    ui.toggleFullscreen();
  });
  ui.on('setZoom', function (factor) {
    if (factor == 'fullscreen') {
      fullscreenButton.setIcon(_exitfullscreen["default"]);
      fullscreenButton.setLabel('Exit full screen mode');
    } else {
      fullscreenButton.setIcon(_fullscreen["default"]);
      fullscreenButton.setLabel('Enter full screen mode');
    }
  });

  var _openFileDialog = function openFileDialog() {
    (0, _fileDialog["default"])().then(function (files) {
      var file = files[0];
      emu.openFile(file).then(function () {
        if (emu.isInitiallyPaused) emu.start();
      })["catch"](function (err) {
        alert(err);
      });
    });
  };

  var openGameBrowser = function openGameBrowser() {
    emu.pause();
    var body = ui.showDialog();
    body.innerHTML = "\n            <label>Find games</label>\n            <form>\n                <input type=\"search\">\n                <button type=\"submit\">Search</button>\n            </form>\n            <div class=\"results\">\n            </div>\n        ";
    var input = body.querySelector('input');
    var searchButton = body.querySelector('button');
    var searchForm = body.querySelector('form');
    var resultsContainer = body.querySelector('.results');
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      searchButton.innerText = 'Searching...';
      var searchTerm = input.value.replace(/[^\w\s\-\']/, '');

      var encodeParam = function encodeParam(key, val) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
      };

      var searchUrl = 'https://archive.org/advancedsearch.php?' + encodeParam('q', 'collection:softwarelibrary_zx_spectrum title:"' + searchTerm + '"') + '&' + encodeParam('fl[]', 'creator') + '&' + encodeParam('fl[]', 'identifier') + '&' + encodeParam('fl[]', 'title') + '&' + encodeParam('rows', '50') + '&' + encodeParam('page', '1') + '&' + encodeParam('output', 'json');
      fetch(searchUrl).then(function (response) {
        searchButton.innerText = 'Search';
        return response.json();
      }).then(function (data) {
        resultsContainer.innerHTML = '<ul></ul><p>- powered by <a href="https://archive.org/">Internet Archive</a></p>';
        var ul = resultsContainer.querySelector('ul');
        var results = data.response.docs;
        results.forEach(function (result) {
          var li = document.createElement('li');
          ul.appendChild(li);
          var resultLink = document.createElement('a');
          resultLink.href = '#';
          resultLink.innerText = result.title;
          var creator = document.createTextNode(' - ' + result.creator);
          li.appendChild(resultLink);
          li.appendChild(creator);
          resultLink.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('https://archive.org/metadata/' + result.identifier).then(function (response) {
              return response.json();
            }).then(function (data) {
              var chosenFilename = null;
              data.files.forEach(function (file) {
                var ext = file.name.split('.').pop().toLowerCase();

                if (ext == 'z80' || ext == 'sna' || ext == 'tap' || ext == 'tzx' || ext == 'szx') {
                  chosenFilename = file.name;
                }
              });

              if (!chosenFilename) {
                alert('No loadable file found');
              } else {
                var finalUrl = 'https://cors.archive.org/cors/' + result.identifier + '/' + chosenFilename;
                emu.openUrl(finalUrl)["catch"](function (err) {
                  alert(err);
                }).then(function () {
                  ui.hideDialog();
                  emu.start();
                });
              }
            });
          });
        });
      });
    });
    input.focus();
  };

  var _exit = function exit() {
    emu.exit();
    ui.unload();
  };
  /*
      const benchmarkElement = document.getElementById('benchmark');
      setInterval(() => {
          benchmarkElement.innerText = (
              "Running at " + benchmarkRunCount + "fps, rendering at "
              + benchmarkRenderCount + "fps"
          );
          benchmarkRunCount = 0;
          benchmarkRenderCount = 0;
      }, 1000)
  */


  return {
    setZoom: function setZoom(zoom) {
      ui.setZoom(zoom);
    },
    toggleFullscreen: function toggleFullscreen() {
      ui.toggleFullscreen();
    },
    enterFullscreen: function enterFullscreen() {
      ui.enterFullscreen();
    },
    exitFullscreen: function exitFullscreen() {
      ui.exitFullscreen();
    },
    setMachine: function setMachine(model) {
      emu.setMachine(model);
    },
    openFileDialog: function openFileDialog() {
      _openFileDialog();
    },
    openUrl: function openUrl(url) {
      emu.openUrl(url)["catch"](function (err) {
        alert(err);
      });
    },
    exit: function exit() {
      _exit();
    }
  };
};
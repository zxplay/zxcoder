"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIController = exports.Toolbar = exports.MenuBar = exports.Menu = void 0;

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _events = _interopRequireDefault(require("events"));

var _play = _interopRequireDefault(require("./icons/play.svg"));

var _close = _interopRequireDefault(require("./icons/close.svg"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var MenuBar = /*#__PURE__*/function () {
  function MenuBar(container) {
    (0, _classCallCheck2["default"])(this, MenuBar);
    this.elem = document.createElement('div');
    this.elem.style.display = 'flow-root';
    this.elem.style.backgroundColor = '#eee';
    this.elem.style.fontFamily = 'Arial, Helvetica, sans-serif';
    this.elem.style.top = '0';
    this.elem.style.width = '100%';
    container.appendChild(this.elem);
    this.currentMouseenterEvent = null;
    this.currentMouseoutEvent = null;
  }

  (0, _createClass2["default"])(MenuBar, [{
    key: "addMenu",
    value: function addMenu(title) {
      return new Menu(this.elem, title);
    }
  }, {
    key: "enterFullscreen",
    value: function enterFullscreen() {
      this.elem.style.position = 'absolute';
    }
  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      this.elem.style.position = 'static';
    }
  }, {
    key: "show",
    value: function show() {
      this.elem.style.visibility = 'visible';
      this.elem.style.display = 'block';
    }
  }, {
    key: "hide",
    value: function hide() {
      this.elem.style.visibility = 'hidden';
      this.elem.style.display = 'none';
    }
  }, {
    key: "onmouseenter",
    value: function onmouseenter(e) {
      if (this.currentMouseenterEvent) {
        this.elem.removeEventListener('mouseenter', this.currentMouseenterEvent);
      }

      if (e) {
        this.elem.addEventListener('mouseenter', e);
      }

      this.currentMouseenterEvent = e;
    }
  }, {
    key: "onmouseout",
    value: function onmouseout(e) {
      if (this.currentMouseoutEvent) {
        this.elem.removeEventListener('mouseleave', this.currentMouseoutEvent);
      }

      if (e) {
        this.elem.addEventListener('mouseleave', e);
      }

      this.currentMouseoutEvent = e;
    }
  }]);
  return MenuBar;
}();

exports.MenuBar = MenuBar;

var Menu = /*#__PURE__*/function () {
  function Menu(container, title) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, Menu);
    var elem = document.createElement('div');
    elem.style["float"] = 'left';
    elem.style.position = 'relative';
    container.appendChild(elem);
    var button = document.createElement('button');
    button.style.margin = '2px';
    button.innerText = title;
    elem.appendChild(button);
    this.list = document.createElement('ul');
    this.list.style.position = 'absolute';
    this.list.style.width = '150px';
    this.list.style.backgroundColor = '#eee';
    this.list.style.listStyleType = 'none';
    this.list.style.margin = '0';
    this.list.style.padding = '0';
    this.list.style.border = '1px solid #888';
    this.list.style.display = 'none';
    elem.appendChild(this.list);
    button.addEventListener('click', function () {
      if (_this.isOpen()) {
        _this.close();
      } else {
        _this.open();
      }
    });
    document.addEventListener('click', function (e) {
      if (e.target != button && _this.isOpen()) _this.close();
    });
  }

  (0, _createClass2["default"])(Menu, [{
    key: "isOpen",
    value: function isOpen() {
      return this.list.style.display == 'block';
    }
  }, {
    key: "open",
    value: function open() {
      this.list.style.display = 'block';
    }
  }, {
    key: "close",
    value: function close() {
      this.list.style.display = 'none';
    }
  }, {
    key: "addItem",
    value: function addItem(title, onClick) {
      var li = document.createElement('li');
      this.list.appendChild(li);
      var button = document.createElement('button');
      button.innerText = title;
      button.style.width = '100%';
      button.style.textAlign = 'left';
      button.style.borderWidth = '0';
      button.style.paddingTop = '4px';
      button.style.paddingBottom = '4px'; // eww.

      button.addEventListener('mouseenter', function () {
        button.style.backgroundColor = '#ddd';
      });
      button.addEventListener('mouseout', function () {
        button.style.backgroundColor = 'inherit';
      });

      if (onClick) {
        button.addEventListener('click', onClick);
      }

      li.appendChild(button);
      return {
        setBullet: function setBullet() {
          button.innerText = String.fromCharCode(0x2022) + ' ' + title;
        },
        unsetBullet: function unsetBullet() {
          button.innerText = title;
        },
        setCheckbox: function setCheckbox() {
          button.innerText = String.fromCharCode(0x2713) + ' ' + title;
        },
        unsetCheckbox: function unsetCheckbox() {
          button.innerText = title;
        }
      };
    }
  }]);
  return Menu;
}();

exports.Menu = Menu;

var Toolbar = /*#__PURE__*/function () {
  function Toolbar(container) {
    (0, _classCallCheck2["default"])(this, Toolbar);
    this.elem = document.createElement('div');
    this.elem.style.backgroundColor = '#ccc';
    this.elem.style.bottom = '0';
    this.elem.style.width = '100%';
    container.appendChild(this.elem);
    this.currentMouseenterEvent = null;
    this.currentMouseoutEvent = null;
  }

  (0, _createClass2["default"])(Toolbar, [{
    key: "addButton",
    value: function addButton(icon, opts, onClick) {
      opts = opts || {};
      var button = new ToolbarButton(icon, opts, onClick);
      if (opts.align == 'right') button.elem.style["float"] = 'right';
      this.elem.appendChild(button.elem);
      return button;
    }
  }, {
    key: "enterFullscreen",
    value: function enterFullscreen() {
      this.elem.style.position = 'absolute';
    }
  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      this.elem.style.position = 'static';
    }
  }, {
    key: "show",
    value: function show() {
      this.elem.style.visibility = 'visible';
      this.elem.style.display = 'block';
    }
  }, {
    key: "hide",
    value: function hide() {
      this.elem.style.visibility = 'hidden';
      this.elem.style.display = 'none';
    }
  }, {
    key: "onmouseenter",
    value: function onmouseenter(e) {
      if (this.currentMouseenterEvent) {
        this.elem.removeEventListener('mouseenter', this.currentMouseenterEvent);
      }

      if (e) {
        this.elem.addEventListener('mouseenter', e);
      }

      this.currentMouseenterEvent = e;
    }
  }, {
    key: "onmouseout",
    value: function onmouseout(e) {
      if (this.currentMouseoutEvent) {
        this.elem.removeEventListener('mouseleave', this.currentMouseoutEvent);
      }

      if (e) {
        this.elem.addEventListener('mouseleave', e);
      }

      this.currentMouseoutEvent = e;
    }
  }]);
  return Toolbar;
}();

exports.Toolbar = Toolbar;

var ToolbarButton = /*#__PURE__*/function () {
  function ToolbarButton(icon, opts, onClick) {
    (0, _classCallCheck2["default"])(this, ToolbarButton);
    this.elem = document.createElement('button');
    this.elem.style.margin = '2px';
    this.setIcon(icon);
    if (opts.label) this.setLabel(opts.label);
    this.elem.addEventListener('click', onClick);
  }

  (0, _createClass2["default"])(ToolbarButton, [{
    key: "setIcon",
    value: function setIcon(icon) {
      this.elem.innerHTML = icon;
      this.elem.firstChild.style.height = '20px';
      this.elem.firstChild.style.verticalAlign = 'middle';
    }
  }, {
    key: "setLabel",
    value: function setLabel(label) {
      this.elem.title = label;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.elem.disabled = true;
      this.elem.firstChild.style.opacity = '0.5';
    }
  }, {
    key: "enable",
    value: function enable() {
      this.elem.disabled = false;
      this.elem.firstChild.style.opacity = '1';
    }
  }]);
  return ToolbarButton;
}();

var UIController = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(UIController, _EventEmitter);

  var _super = _createSuper(UIController);

  function UIController(container, emulator, opts) {
    var _this2;

    (0, _classCallCheck2["default"])(this, UIController);
    _this2 = _super.call(this);
    _this2.canvas = emulator.canvas;
    /* build UI elements */

    _this2.dialog = document.createElement('div');
    _this2.dialog.style.display = 'none';
    container.appendChild(_this2.dialog);
    var dialogCloseButton = document.createElement('button');
    dialogCloseButton.innerHTML = _close["default"];
    dialogCloseButton.style["float"] = 'right';
    dialogCloseButton.style.border = 'none';
    dialogCloseButton.firstChild.style.height = '20px';
    dialogCloseButton.firstChild.style.verticalAlign = 'middle';

    _this2.dialog.appendChild(dialogCloseButton);

    dialogCloseButton.addEventListener('click', function () {
      _this2.hideDialog();
    });
    _this2.dialogBody = document.createElement('div');
    _this2.dialogBody.style.clear = 'both';

    _this2.dialog.appendChild(_this2.dialogBody);

    _this2.appContainer = document.createElement('div');
    container.appendChild(_this2.appContainer);
    _this2.appContainer.style.position = 'relative'; //k

    _this2.menuBar = new MenuBar(_this2.appContainer);

    _this2.appContainer.appendChild(_this2.canvas);

    _this2.canvas.style.objectFit = 'contain';
    _this2.canvas.style.display = 'block'; //k

    _this2.toolbar = new Toolbar(_this2.appContainer);
    _this2.startButton = document.createElement('button');
    _this2.startButton.innerHTML = _play["default"];

    _this2.appContainer.appendChild(_this2.startButton);

    _this2.startButton.style.position = 'absolute';
    _this2.startButton.style.top = '50%';
    _this2.startButton.style.left = '50%';
    _this2.startButton.style.width = '192px';
    _this2.startButton.style.height = '128px';
    _this2.startButton.style.marginLeft = '-96px';
    _this2.startButton.style.marginTop = '-64px';
    _this2.startButton.style.backgroundColor = 'rgba(160, 160, 160, 0.7)';
    _this2.startButton.style.border = 'none';
    _this2.startButton.style.borderRadius = '4px';
    _this2.startButton.firstChild.style.height = '56px';
    _this2.startButton.firstChild.style.verticalAlign = 'middle';

    _this2.startButton.addEventListener('mouseenter', function () {
      _this2.startButton.style.backgroundColor = 'rgba(128, 128, 128, 0.7)';
    });

    _this2.startButton.addEventListener('mouseleave', function () {
      _this2.startButton.style.backgroundColor = 'rgba(160, 160, 160, 0.7)';
    });

    _this2.startButton.addEventListener('click', function (e) {
      emulator.start();
    });

    emulator.on('start', function () {
      _this2.startButton.style.display = 'none';
    });
    emulator.on('pause', function () {
      _this2.startButton.style.display = 'block';
    });
    /* variables for tracking zoom / fullscreen state */

    _this2.zoom = null;
    _this2.isFullscreen = false;
    _this2.uiIsHidden = false;
    _this2.allowUIHiding = true;
    _this2.hideUITimeout = null;
    _this2.ignoreNextMouseMove = false;
    /* state changes when entering / exiting fullscreen */

    var fullscreenMouseMove = function fullscreenMouseMove() {
      if (_this2.ignoreNextMouseMove) {
        _this2.ignoreNextMouseMove = false;
        return;
      }

      _this2.showUI();

      if (_this2.hideUITimeout) clearTimeout(_this2.hideUITimeout);
      _this2.hideUITimeout = setTimeout(function () {
        _this2.hideUI();
      }, 3000);
    };

    _this2.appContainer.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement) {
        _this2.isFullscreen = true;
        _this2.canvas.style.width = '100%';
        _this2.canvas.style.height = '100%';
        document.addEventListener('mousemove', fullscreenMouseMove);
        /* a bogus mousemove event is emitted on entering fullscreen, so ignore it */

        _this2.ignoreNextMouseMove = true;

        _this2.menuBar.enterFullscreen();

        _this2.menuBar.onmouseenter(function () {
          _this2.allowUIHiding = false;
        });

        _this2.menuBar.onmouseout(function () {
          _this2.allowUIHiding = true;
        });

        _this2.toolbar.enterFullscreen();

        _this2.toolbar.onmouseenter(function () {
          _this2.allowUIHiding = false;
        });

        _this2.toolbar.onmouseout(function () {
          _this2.allowUIHiding = true;
        });

        _this2.hideUI();

        _this2.emit('setZoom', 'fullscreen');
      } else {
        _this2.isFullscreen = false;
        if (_this2.hideUITimeout) clearTimeout(_this2.hideUITimeout);

        _this2.showUI();

        _this2.menuBar.exitFullscreen();

        _this2.menuBar.onmouseenter(null);

        _this2.menuBar.onmouseout(null);

        _this2.toolbar.exitFullscreen();

        _this2.toolbar.onmouseenter(null);

        _this2.toolbar.onmouseout(null);

        document.removeEventListener('mousemove', fullscreenMouseMove);

        _this2.setZoom(_this2.zoom);
      }
    });

    _this2.setZoom(opts.zoom || 1);

    if (!opts.sandbox) {
      /* drag-and-drop for loading files */
      _this2.appContainer.addEventListener('drop', function (ev) {
        ev.preventDefault();
        var loadList = Promise.resolve();

        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          var _iterator = _createForOfIteratorHelper(ev.dataTransfer.items),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;

              // If dropped items aren't files, reject them
              if (item.kind === 'file') {
                (function () {
                  var file = item.getAsFile();
                  loadList = loadList.then(function () {
                    emulator.openFile(file);
                  });
                })();
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          var _iterator2 = _createForOfIteratorHelper(ev.dataTransfer.files),
              _step2;

          try {
            var _loop = function _loop() {
              var file = _step2.value;
              loadList = loadList.then(function () {
                emulator.openFile(file);
              });
            };

            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }

        loadList.then(function () {
          if (emulator.isInitiallyPaused) emulator.start();
        });
      });

      _this2.appContainer.addEventListener('dragover', function (ev) {
        ev.preventDefault();
      });
    }

    _this2.hideUI();

    return _this2;
  }

  (0, _createClass2["default"])(UIController, [{
    key: "setZoom",
    value: function setZoom(factor) {
      this.zoom = factor;

      if (this.isFullscreen) {
        document.exitFullscreen();
        return; // setZoom will be retriggered once fullscreen has exited
      }

      var displayWidth = 320 * this.zoom;
      var displayHeight = 240 * this.zoom;
      this.canvas.style.width = '' + displayWidth + 'px';
      this.canvas.style.height = '' + displayHeight + 'px';
      this.appContainer.style.width = '' + displayWidth + 'px';
      this.emit('setZoom', factor);
    }
  }, {
    key: "enterFullscreen",
    value: function enterFullscreen() {
      this.appContainer.requestFullscreen();
    }
  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      if (this.isFullscreen) {
        document.exitFullscreen();
      }
    }
  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      if (this.isFullscreen) {
        this.exitFullscreen();
      } else {
        this.enterFullscreen();
      }
    }
  }, {
    key: "hideUI",
    value: function hideUI() {
      if (this.allowUIHiding && !this.uiIsHidden) {
        this.uiIsHidden = true;
        this.appContainer.style.cursor = 'none';
        this.menuBar.hide();
        this.toolbar.hide();
      }
    }
  }, {
    key: "showUI",
    value: function showUI() {
      if (this.uiIsHidden) {
        this.uiIsHidden = false;
        this.appContainer.style.cursor = 'default';
        this.menuBar.show();
        this.toolbar.show();
      }
    }
  }, {
    key: "showDialog",
    value: function showDialog() {
      this.dialog.style.display = 'block';
      this.dialog.style.position = 'absolute';
      this.dialog.style.backgroundColor = '#eee';
      this.dialog.style.zIndex = '100';
      this.dialog.style.width = '75%';
      this.dialog.style.height = '80%';
      this.dialog.style.left = '12%';
      this.dialog.style.top = '10%';
      this.dialog.style.overflow = 'scroll'; // TODO: less hacky scrolling that doesn't hide the close button

      this.dialogBody.style.paddingLeft = '8px';
      this.dialogBody.style.paddingRight = '8px';
      this.dialogBody.style.paddingBottom = '8px';
      return this.dialogBody;
    }
  }, {
    key: "hideDialog",
    value: function hideDialog() {
      this.dialog.style.display = 'none';
      this.dialogBody.innerHTML = '';
    }
  }, {
    key: "unload",
    value: function unload() {
      this.dialog.remove();
      this.appContainer.remove();
    }
  }]);
  return UIController;
}(_events["default"]);

exports.UIController = UIController;
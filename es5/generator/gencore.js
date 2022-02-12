"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _process = require("process");

var fs = _interopRequireDefault(require("fs"));

var readline = _interopRequireDefault(require("readline"));

var _instructions = _interopRequireDefault(require("./instructions.mjs"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

if (_process.argv.length != 4) {
  console.log("Usage: node gencore.js path/to/input.ts.in path/to/output.ts");
  (0, _process.exit)(1);
}

var inputFilename = _process.argv[2];
var outputFilename = _process.argv[3];

var loadOpcodeTable = function loadOpcodeTable(filename, table, altTable) {
  var _iterator = _createForOfIteratorHelper(fs.readFileSync(filename).toString().split("\n")),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      var match = line.match(/^(\w+)\s+(.*)$/);

      if (match) {
        var code = parseInt(match[1], 16);
        var instruction = match[2];
        table[code] = instruction;

        if (altTable) {
          var altInstruction = instruction.replaceAll(/\bIX\b/g, 'IY').replaceAll(/\bIXH\b/g, 'IYH').replaceAll(/\bIXL\b/g, 'IYL').replaceAll(/prefix ddcb/g, 'prefix fdcb');
          altTable[code] = altInstruction;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

var baseOpcodes = {};
loadOpcodeTable('src/generator/opcodes_base.txt', baseOpcodes);
var cbOpcodes = {};
loadOpcodeTable('src/generator/opcodes_cb.txt', cbOpcodes);
var ddOpcodes = {};
var fdOpcodes = {};
loadOpcodeTable('src/generator/opcodes_dd.txt', ddOpcodes, fdOpcodes);
var ddcbOpcodes = {};
var fdcbOpcodes = {};
loadOpcodeTable('src/generator/opcodes_ddcb.txt', ddcbOpcodes, fdcbOpcodes);
var edOpcodes = {};
loadOpcodeTable('src/generator/opcodes_ed.txt', edOpcodes);

var Variable = /*#__PURE__*/function () {
  function Variable() {
    (0, _classCallCheck2["default"])(this, Variable);
  }

  (0, _createClass2["default"])(Variable, [{
    key: "getter",
    value: function getter() {
      throw "getter not implemented";
    }
  }, {
    key: "setter",
    value: function setter(expr) {
      throw "setter not implemented";
    }
  }, {
    key: "arrayGetter",
    value: function arrayGetter(index) {
      throw "arrayGetter not implemented";
    }
  }, {
    key: "arraySetter",
    value: function arraySetter(index, expr) {
      throw "arraySetter not implemented";
    }
  }]);
  return Variable;
}();

var Constant = /*#__PURE__*/function (_Variable) {
  (0, _inherits2["default"])(Constant, _Variable);

  var _super = _createSuper(Constant);

  function Constant(expr) {
    var _this;

    (0, _classCallCheck2["default"])(this, Constant);
    _this = _super.call(this);
    _this.expr = expr;
    return _this;
  }

  (0, _createClass2["default"])(Constant, [{
    key: "getter",
    value: function getter() {
      return parseExpression(this.expr);
    }
  }]);
  return Constant;
}(Variable);

var PointerVariable = /*#__PURE__*/function (_Variable2) {
  (0, _inherits2["default"])(PointerVariable, _Variable2);

  var _super2 = _createSuper(PointerVariable);

  function PointerVariable(address, type) {
    var _this2;

    (0, _classCallCheck2["default"])(this, PointerVariable);
    _this2 = _super2.call(this);
    _this2.address = address;
    _this2.type = type;
    return _this2;
  }

  (0, _createClass2["default"])(PointerVariable, [{
    key: "getter",
    value: function getter() {
      return "load<".concat(this.type, ">(").concat(this.address, ")");
    }
  }, {
    key: "setter",
    value: function setter(expr) {
      return "store<".concat(this.type, ">(").concat(this.address, ", (").concat(parseExpression(expr), "));");
    }
  }]);
  return PointerVariable;
}(Variable);

var ArrayVariable = /*#__PURE__*/function (_Variable3) {
  (0, _inherits2["default"])(ArrayVariable, _Variable3);

  var _super3 = _createSuper(ArrayVariable);

  function ArrayVariable(address, type) {
    var _this3;

    (0, _classCallCheck2["default"])(this, ArrayVariable);
    _this3 = _super3.call(this);
    _this3.address = address;
    _this3.type = type;
    _this3.typeSize = TYPE_SIZES[type];
    return _this3;
  }

  (0, _createClass2["default"])(ArrayVariable, [{
    key: "arrayGetter",
    value: function arrayGetter(index) {
      if (this.typeSize == 1) {
        return "load<".concat(this.type, ">(").concat(this.address, " + (").concat(parseExpression(index), "))");
      } else {
        return "load<".concat(this.type, ">(").concat(this.address, " + ").concat(this.typeSize, " * (").concat(parseExpression(index), "))");
      }
    }
  }, {
    key: "arraySetter",
    value: function arraySetter(index, expr) {
      if (this.typeSize == 1) {
        return "store<".concat(this.type, ">(").concat(this.address, " + (").concat(parseExpression(index), "), (").concat(parseExpression(expr), "));");
      } else {
        return "store<".concat(this.type, ">(").concat(this.address, " + ").concat(this.typeSize, " * (").concat(parseExpression(index), "), (").concat(parseExpression(expr), "));");
      }
    }
  }, {
    key: "setter",
    value: function setter(expr) {
      var _this4 = this;

      var match = expr.match(/^\s*\[([^\]]*)\]\s*$/);

      if (!match) {
        throw "bad array assignment: " + expr;
      }

      var result = '';
      match[1].split(/\s*\,\s*/).forEach(function (element, i) {
        result += "store<".concat(_this4.type, ">(").concat(_this4.address + i * _this4.typeSize, ", ").concat(parseExpression(element), ");\n");
      });
      return result;
    }
  }]);
  return ArrayVariable;
}(Variable);
/* Memory allocations */


var TYPE_SIZES = {
  'bool': 1,
  'u8': 1,
  'u16': 2,
  'u32': 4,
  'f32': 4
};
var mem = 0;
var vars = {};

var allocateArray = function allocateArray(varName, type, count) {
  var len = TYPE_SIZES[type] * count;
  vars[varName] = new ArrayVariable(mem, type);
  mem += len;
};

var allocateRegisterPair = function allocateRegisterPair(pair, hi, lo) {
  vars[pair] = new PointerVariable(mem, 'u16');
  if (lo) vars[lo] = new PointerVariable(mem, 'u8');
  if (hi) vars[hi] = new PointerVariable(mem + 1, 'u8');
  mem += 2;
};

var defineConstant = function defineConstant(varName, val) {
  vars[varName] = new Constant(val);
};

var parseExpression = function parseExpression(expr) {
  /* array accesses: foo[x] */
  expr = expr.replaceAll(/(\w+)\s*\[([^\]]+)\]/g, function (str, varName, index) {
    if (varName in vars) {
      return vars[varName].arrayGetter(index);
    } else {
      return str;
    }
  });
  /* address getting: (&foo) - note that parentheses are required */

  expr = expr.replaceAll(/\(\&(\w+)\)/g, function (str, varName) {
    return varName in vars ? vars[varName].address : varName;
  });
  /* plain variable accesses: foo */

  expr = expr.replaceAll(/\w+/g, function (varName) {
    return varName in vars ? vars[varName].getter() : varName;
  });
  return expr;
};

var generateOpcode = function generateOpcode(code, instruction, outFile) {
  var exactMatchFunc = null;
  var fuzzyMatchFunc = null;
  var fuzzyMatchArgs = null;
  /* check every instruction in the table for a match */

  for (var _i = 0, _Object$entries = Object.entries(_instructions["default"]); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
        candidate = _Object$entries$_i[0],
        func = _Object$entries$_i[1];

    if (candidate == instruction) {
      exactMatchFunc = func;
      break;
    } else {
      /*
      look for a fuzzy match - e.g. ADD A,r for ADD A,B.
      Split candidate and target instruction into tokens by word break;
      a fuzzy match succeeds if both are the same length, and each token either:
      - matches exactly, or
      - is a placeholder that's valid for the target instruction
        ('r' is valid for any of ABCDEHL; 'rr' is valid for BC, DE, HL, SP),
        in which case the token in the target is stored to be passed as a parameter.
      */
      var instructionTokens = instruction.split(/[\s,]/);
      var candidateTokens = candidate.split(/[\s,]/);
      var fuzzyMatchOk = true;
      var args = [];

      if (instructionTokens.length != candidateTokens.length) {
        fuzzyMatchOk = false;
      } else {
        for (var i = 0; i < instructionTokens.length; i++) {
          var instructionToken = instructionTokens[i];
          var candidateToken = candidateTokens[i];

          if (candidateToken == 'r' && instructionToken.match(/^([ABCDEHL]|I[XY][HL])$/)) {
            args.push(instructionToken);
          } else if (candidateToken == 'rr' && instructionToken.match(/^(AF|BC|DE|HL|IX|IY|SP)$/)) {
            args.push(instructionToken);
          } else if (candidateToken == 'c' && instructionToken.match(/^(C|NC|Z|NZ|PO|PE|P|M)$/)) {
            args.push(instructionToken);
          } else if (candidateToken == 'v' && instructionToken.match(/^([ABCDEHL]|I[XY][HL]|\(HL\)|\(I[XY]\+n\)|\(I[XY]\+n\>[ABCDEHL]\)|n)$/)) {
            args.push(instructionToken);
          } else if (candidateToken == 'k' && instructionToken.match(/^[0123456789abcdefx]+$/)) {
            args.push(parseInt(instructionToken));
          } else if (candidateToken != instructionToken) {
            fuzzyMatchOk = false;
            break;
          }
        }
      }

      if (fuzzyMatchOk) {
        fuzzyMatchFunc = func;
        fuzzyMatchArgs = args;
      }
    }
  }

  var impl;

  if (exactMatchFunc) {
    impl = exactMatchFunc();
  } else if (fuzzyMatchFunc) {
    impl = fuzzyMatchFunc.apply(void 0, (0, _toConsumableArray2["default"])(fuzzyMatchArgs));
  } else {
    throw "Unmatched instruction: " + instruction;
  }

  outFile.write("\n        case 0x".concat(code.toString(16), ":  /* ").concat(instruction, " */\n    "));

  var _iterator2 = _createForOfIteratorHelper(impl.split(/\n/)),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var implLine = _step2.value;
      processLine(implLine);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  outFile.write("\n            break;\n    ");
};

var generateOpcodeTable = function generateOpcodeTable(prefix, outFile) {
  if (prefix == 'base') {
    for (var i = 0; i < 0x100; i++) {
      generateOpcode(i, baseOpcodes[i], outFile);
    }
  } else if (prefix == 'cb') {
    for (var _i2 = 0; _i2 < 0x100; _i2++) {
      generateOpcode(_i2, cbOpcodes[_i2], outFile);
    }
  } else if (prefix == 'dd') {
    for (var _i3 = 0; _i3 < 0x100; _i3++) {
      if (_i3 in ddOpcodes) {
        generateOpcode(_i3, ddOpcodes[_i3], outFile);
      } else {
        generateOpcode(_i3, baseOpcodes[_i3], outFile);
      }
    }
  } else if (prefix == 'ddcb') {
    for (var _i4 = 0; _i4 < 0x100; _i4++) {
      generateOpcode(_i4, ddcbOpcodes[_i4], outFile);
    }
  } else if (prefix == 'ed') {
    for (var _i5 = 0; _i5 < 0x100; _i5++) {
      if (_i5 in edOpcodes) {
        generateOpcode(_i5, edOpcodes[_i5], outFile);
      } else {
        generateOpcode(_i5, 'NOP', outFile);
      }
    }
  } else if (prefix == 'fd') {
    for (var _i6 = 0; _i6 < 0x100; _i6++) {
      if (_i6 in fdOpcodes) {
        generateOpcode(_i6, fdOpcodes[_i6], outFile);
      } else {
        generateOpcode(_i6, baseOpcodes[_i6], outFile);
      }
    }
  } else if (prefix == 'fdcb') {
    for (var _i7 = 0; _i7 < 0x100; _i7++) {
      generateOpcode(_i7, fdcbOpcodes[_i7], outFile);
    }
  } else {
    throw "unknown opcode table prefix: " + prefix;
  }
};

var inFile = fs.createReadStream(inputFilename);
var outFile = fs.createWriteStream(outputFilename);

var processLine = function processLine(line) {
  if (line.startsWith('#')) {
    var match;
    match = line.match(/^#alloc\s+(\w+)\s*\[\s*(\w+)\s*\]\s*:\s*(\w+)\s*$/);

    if (match) {
      var varName = match[1];
      var len = parseInt(match[2]);
      var type = match[3];
      allocateArray(varName, type, len);
      return;
    }

    match = line.match(/^#const\s+(\w+)\s+(.+)$/);

    if (match) {
      var _varName = match[1];
      var expr = match[2];
      defineConstant(_varName, expr);
      return;
    }

    match = line.match(/^#regpair\s+(\w+)\s+(\w+)\s+(\w+)\s*$/);

    if (match) {
      var pair = match[1];
      var hi = match[2];
      var lo = match[3];
      allocateRegisterPair(pair, hi, lo);
      return;
    }

    match = line.match(/^#regpair\s+(\w+)\s*$/);

    if (match) {
      var _pair = match[1];
      allocateRegisterPair(_pair);
      return;
    }

    throw "Unrecognised directive: " + line;
  } else {
    var _match;
    /* opcode table */


    _match = line.match(/^\s*#optable\s+(\w+)$/);

    if (_match) {
      var prefix = _match[1];
      generateOpcodeTable(prefix, outFile);
      return;
    }
    /* opcode case */


    _match = line.match(/^\s*#op\s+(\w+)\s+(.*)$/);

    if (_match) {
      var code = parseInt(_match[1], 16);

      var instruction = _match[2].trim();

      generateOpcode(code, instruction, outFile);
      return;
    }
    /* array assignment */


    _match = line.match(/^\s*(\w+)\s*\[([^\]]+)\]\s*(\|\=|\=)\s*(.*);/);

    if (_match && _match[1] in vars) {
      var variable = vars[_match[1]];
      var index = _match[2];
      var operator = _match[3];
      var _expr = _match[4];

      if (operator == '=') {
        outFile.write(variable.arraySetter(index, _expr) + "\n");
      } else if (operator == '|=') {
        outFile.write(variable.arraySetter(index, "".concat(variable.arrayGetter(index), " | (").concat(_expr, ")")) + "\n");
      } else {
        throw "unknown operator " + operator;
      }

      return;
    }
    /* var assignment */


    _match = line.match(/^\s*(\w+)\s*=\s*(.*);/);

    if (_match && _match[1] in vars) {
      var _variable = vars[_match[1]];

      var _expr2 = parseExpression(_match[2]);

      outFile.write(_variable.setter(_expr2) + "\n");
      return;
    }

    outFile.write(parseExpression(line) + "\n");
  }
};

var reader = readline.createInterface({
  input: inFile,
  crlfDelay: Infinity
});

var _iterator3 = _createForOfIteratorHelper(reader),
    _step3;

try {
  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
    var line = _step3.value;
    processLine(line);
  }
} catch (err) {
  _iterator3.e(err);
} finally {
  _iterator3.f();
}

inFile.close();
outFile.close();
/* check that allocated memory fits within the memoryBase set in asconfig.json */

var asconfig = JSON.parse(fs.readFileSync('asconfig.json', {
  encoding: 'utf-8'
}));
console.log('memory allocated:', mem);
console.log('memory available:', asconfig.options.memoryBase);

if (mem > asconfig.options.memoryBase) {
  console.log("ERROR: not enough memory allocated in asconfig.json");
  (0, _process.exit)(1);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var CONDITIONS = {
  'Z': '(F & FLAG_Z)',
  'NZ': '!(F & FLAG_Z)',
  'C': '(F & FLAG_C)',
  'NC': '!(F & FLAG_C)',
  'PE': '(F & FLAG_V)',
  'PO': '!(F & FLAG_V)',
  'M': '(F & FLAG_S)',
  'P': '!(F & FLAG_S)'
};

var valueGetter = function valueGetter(expr, hasPreviousIndexOffset) {
  if (expr.match(/^([ABCDEHL]|I[XY][HL])$/)) {
    return "const val = ".concat(expr, ";");
  } else if (expr == 'n') {
    return 'const val = readMem(pc++);';
  } else if (expr == '(HL)') {
    return "\n            const hl:u16 = HL;\n            const val = readMem(hl);\n        ";
  } else if (expr.match(/^(\(IX\+n\)|\(IX\+n\>[ABCDEHL]\))$/)) {
    if (hasPreviousIndexOffset) {
      return "\n                const ixAddr:u16 = IX + indexOffset;\n                contendDirtyRead(pc-1);\n                t++;\n                contendDirtyRead(pc-1);\n                t++;\n                const val = readMem(ixAddr);\n            ";
    } else {
      return "\n                const ixAddr:u16 = IX + i8(readMem(pc));\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                pc++;\n                const val = readMem(ixAddr);\n            ";
    }
  } else if (expr.match(/^(\(IY\+n\)|\(IY\+n\>[ABCDEHL]\))$/)) {
    if (hasPreviousIndexOffset) {
      return "\n                const iyAddr:u16 = IY + indexOffset;\n                contendDirtyRead(pc-1);\n                t++;\n                contendDirtyRead(pc-1);\n                t++;\n                const val = readMem(iyAddr);\n            ";
    } else {
      return "\n                const iyAddr:u16 = IY + i8(readMem(pc));\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                contendDirtyRead(pc);\n                t++;\n                pc++;\n                const val = readMem(iyAddr);\n            ";
    }
  } else {
    throw "Unrecognised expression for value initter: " + expr;
  }
};

var valueSetter = function valueSetter(expr) {
  var match;

  if (expr.match(/^([ABCDEHL]|I[XY][HL])$/)) {
    return "".concat(expr, " = result;");
  } else if (expr == '(HL)') {
    return "\n            contendDirtyRead(hl);\n            t++;\n            writeMem(hl, result);\n        ";
  } else if (expr == '(IX+n)') {
    return "\n            contendDirtyRead(ixAddr);\n            t++;\n            writeMem(ixAddr, result);\n        ";
  } else if (match = expr.match(/^\(IX\+n\>([ABCDEHL])\)$/)) {
    return "\n            contendDirtyRead(ixAddr);\n            t++;\n            writeMem(ixAddr, result);\n            ".concat(match[1], " = result;\n        ");
  } else if (expr == '(IY+n)') {
    return "\n            contendDirtyRead(iyAddr);\n            t++;\n            writeMem(iyAddr, result);\n        ";
  } else if (match = expr.match(/^\(IY\+n\>([ABCDEHL])\)$/)) {
    return "\n            contendDirtyRead(iyAddr);\n            t++;\n            writeMem(iyAddr, result);\n            ".concat(match[1], " = result;\n        ");
  } else {
    throw "Unrecognised expression for value setter: " + expr;
  }
};

var _default = {
  'prefix cb': function prefixCb() {
    return "\n        opcodePrefix = 0xcb;\n        interruptible = false;\n    ";
  },
  'prefix dd': function prefixDd() {
    return "\n        opcodePrefix = 0xdd;\n        interruptible = false;\n    ";
  },
  'prefix ddcb': function prefixDdcb() {
    return "\n        opcodePrefix = 0xdc;\n        interruptible = false;\n    ";
  },
  'prefix ed': function prefixEd() {
    return "\n        opcodePrefix = 0xed;\n        interruptible = false;\n    ";
  },
  'prefix fd': function prefixFd() {
    return "\n        opcodePrefix = 0xfd;\n        interruptible = false;\n    ";
  },
  'prefix fdcb': function prefixFdcb() {
    return "\n        opcodePrefix = 0xfc;\n        interruptible = false;\n    ";
  },
  'ADC A,v': function ADCAV(v) {
    return "\n        ".concat(valueGetter(v), "\n        let a:u32 = u32(A);\n        const result:u32 = a + val + (F & FLAG_C);\n        const lookup:u32 = ( (a & 0x88) >> 3 ) | ( (val & 0x88) >> 2 ) | ( (result & 0x88) >> 1 );\n        A = result;\n        F = (result & 0x100 ? FLAG_C : 0) | halfcarryAddTable[lookup & 0x07] | overflowAddTable[lookup >> 4] | sz53Table[u8(result)];\n    ");
  },
  'ADC HL,rr': function ADCHLRr(rr) {
    return "\n        const hl:u32 = u32(HL);\n        const rr:u32 = u32(".concat(rr, ");\n        const result:u32 = hl + rr + (F & FLAG_C);\n        const lookup:u32 = ((hl & 0x8800) >> 11) | ((rr & 0x8800) >> 10) | ((result & 0x8800) >>  9);\n        HL = result;\n        F = (result & 0x10000 ? FLAG_C : 0) | overflowAddTable[lookup >> 4] | ((result >> 8) & (FLAG_3 | FLAG_5 | FLAG_S)) | halfcarryAddTable[lookup & 0x07] | ((result & 0xffff) ? 0 : FLAG_Z);\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n    ");
  },
  'ADD rr,rr': function ADDRrRr(rr1, rr2) {
    return "\n        const rr1:u16 = ".concat(rr1, ";\n        const rr2:u16 = ").concat(rr2, ";\n        const add16temp:u32 = u32(rr1) + u32(rr2);\n        const lookup:u32 = ((rr1 & 0x0800) >> 11) | ((rr2 & 0x0800) >> 10) | ((add16temp & 0x0800) >>  9);\n        ").concat(rr1, " = add16temp;\n        F = (F & ( FLAG_V | FLAG_Z | FLAG_S )) | (add16temp & 0x10000 ? FLAG_C : 0) | ((add16temp >> 8) & ( FLAG_3 | FLAG_5 )) | halfcarryAddTable[lookup];\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n    ");
  },
  'ADD A,v': function ADDAV(v) {
    return "\n        ".concat(valueGetter(v), "\n        let a:u32 = u32(A);\n        const result:u32 = a + u32(val);\n        const lookup:u32 = ( (a & 0x88) >> 3 ) | ( (val & 0x88) >> 2 ) | ( (result & 0x88) >> 1 );\n        A = result;\n        F = (result & 0x100 ? FLAG_C : 0) | halfcarryAddTable[lookup & 0x07] | overflowAddTable[lookup >> 4] | sz53Table[u8(result)];\n    ");
  },
  'AND A': function ANDA() {
    return "\n        F = FLAG_H | sz53pTable[A];\n    ";
  },
  'AND v': function ANDV(v) {
    return "\n        ".concat(valueGetter(v), "\n        const result:u8 = A & val;\n        A = result;\n        F = FLAG_H | sz53pTable[result];\n    ");
  },
  'BIT k,(HL)': function BITKHL(k) {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        let f:u8 = ( F & FLAG_C ) | FLAG_H | ( val & ( FLAG_3 | FLAG_5 ) );\n        if ( !(val & ".concat(1 << k, ") ) f |= FLAG_P | FLAG_Z;\n        ").concat(k == 7 ? 'if (val & 0x80) f |= FLAG_S;' : '', "\n        F = f;\n        contendDirtyRead(hl);\n        t++;\n    ");
  },
  'BIT k,(IX+n)': function BITKIXN(k) {
    return "\n        ".concat(valueGetter('(IX+n)', true), "\n        let f:u8 = ( F & FLAG_C ) | FLAG_H | ( u8(ixAddr >> 8) & ( FLAG_3 | FLAG_5 ) );\n        if( !(val & ").concat(1 << k, ") ) f |= FLAG_P | FLAG_Z;\n        ").concat(k == 7 ? 'if (val & 0x80) f |= FLAG_S;' : '', "\n        F = f;\n        contendDirtyRead(ixAddr);\n        t++;\n    ");
  },
  'BIT k,(IY+n)': function BITKIYN(k) {
    return "\n        ".concat(valueGetter('(IY+n)', true), "\n        let f:u8 = ( F & FLAG_C ) | FLAG_H | ( u8(iyAddr >> 8) & ( FLAG_3 | FLAG_5 ) );\n        if( !(val & ").concat(1 << k, ") ) f |= FLAG_P | FLAG_Z;\n        ").concat(k == 7 ? 'if (val & 0x80) f |= FLAG_S;' : '', "\n        F = f;\n        contendDirtyRead(iyAddr);\n        t++;\n    ");
  },
  'BIT k,r': function BITKR(k, r) {
    return "\n        const val:u8 = ".concat(r, ";\n        let f:u8 = ( F & FLAG_C ) | FLAG_H | ( val & ( FLAG_3 | FLAG_5 ) );\n        if ( !(val & ").concat(1 << k, ") ) f |= FLAG_P | FLAG_Z;\n        ").concat(k == 7 ? 'if (val & 0x80) f |= FLAG_S;' : '', "\n        F = f;\n    ");
  },
  'CALL c,nn': function CALLCNn(cond) {
    return "\n        if (".concat(CONDITIONS[cond], ") {\n            let lo = u16(readMem(pc++));\n            let hi = u16(readMem(pc));\n            contendDirtyRead(pc);\n            t++;\n            pc++;\n            let sp = SP;\n            sp--;\n            writeMem(sp, u8(pc >> 8));\n            sp--;\n            writeMem(sp, u8(pc & 0xff));\n            SP = sp;\n            pc = lo + (hi << 8);\n        } else {\n            contendRead(pc++);\n            t += 3;\n            contendRead(pc++);\n            t += 3;\n        }\n    ");
  },
  'CALL nn': function CALLNn() {
    return "\n        let lo = u16(readMem(pc++));\n        let hi = u16(readMem(pc));\n        contendDirtyRead(pc);\n        t++;\n        pc++;\n        let sp = SP;\n        sp--;\n        writeMem(sp, u8(pc >> 8));\n        sp--;\n        writeMem(sp, u8(pc & 0xff));\n        SP = sp;\n        pc = lo + (hi << 8);\n    ";
  },
  'CCF': function CCF() {
    return "\n        const f:u8 = F;\n        F = ( f & ( FLAG_P | FLAG_Z | FLAG_S ) ) | ( ( f & FLAG_C ) ? FLAG_H : FLAG_C ) | ( A & ( FLAG_3 | FLAG_5 ) );\n    ";
  },
  'CP v': function CPV(v) {
    return "\n        ".concat(valueGetter(v), "\n        let a:u32 = u32(A);\n        let cptemp:u32 = a - u32(val);\n        let lookup:u32 = ( (a & 0x88) >> 3 ) | ( (val & 0x88) >> 2 ) | ( (cptemp & 0x88) >> 1 );\n        F = ( cptemp & 0x100 ? FLAG_C : ( cptemp ? 0 : FLAG_Z ) ) | FLAG_N | halfcarrySubTable[lookup & 0x07] | overflowSubTable[lookup >> 4] | ( val & ( FLAG_3 | FLAG_5 ) ) | ( cptemp & FLAG_S );\n    ");
  },
  'CPD': function CPD() {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const a:u8 = A;\n        let result:u8 = a - val;\n        const lookup:u8 = ((a & 0x08) >> 3) | ((val & 0x08) >> 2) | ((result & 0x08) >> 1);\n        HL = hl - 1;\n        const bc:u16 = BC - 1;\n        BC = bc;\n        const f:u8 = (F & FLAG_C) | (bc ? (FLAG_V | FLAG_N) : FLAG_N) | halfcarrySubTable[lookup] | (result ? 0 : FLAG_Z) | (result & FLAG_S);\n        if (f & FLAG_H) result--;\n        F = f | (result & FLAG_3) | ( (result & 0x02) ? FLAG_5 : 0 );\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n    ";
  },
  'CPDR': function CPDR() {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const a:u8 = A;\n        let result:u8 = a - val;\n        const lookup:u8 = ((a & 0x08) >> 3) | ((val & 0x08) >> 2) | ((result & 0x08) >> 1);\n        HL = hl - 1;\n        const bc:u16 = BC - 1;\n        BC = bc;\n        let f:u8 = (F & FLAG_C) | (bc ? (FLAG_V | FLAG_N) : FLAG_N) | halfcarrySubTable[lookup] | (result ? 0 : FLAG_Z) | (result & FLAG_S);\n        if (f & FLAG_H) result--;\n        f |= (result & FLAG_3) | ( (result & 0x02) ? FLAG_5 : 0 );\n        F = f;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        if ((f & (FLAG_V | FLAG_Z)) == FLAG_V) {\n            pc -= 2;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;    \n        }\n    ";
  },
  'CPI': function CPI() {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const a:u8 = A;\n        let result:u8 = a - val;\n        const lookup:u8 = ((a & 0x08) >> 3) | ((val & 0x08) >> 2) | ((result & 0x08) >> 1);\n        HL = hl + 1;\n        const bc:u16 = BC - 1;\n        BC = bc;\n        const f:u8 = (F & FLAG_C) | (bc ? (FLAG_V | FLAG_N) : FLAG_N) | halfcarrySubTable[lookup] | (result ? 0 : FLAG_Z) | (result & FLAG_S);\n        if (f & FLAG_H) result--;\n        F = f | (result & FLAG_3) | ( (result & 0x02) ? FLAG_5 : 0 );\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n    ";
  },
  'CPIR': function CPIR() {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const a:u8 = A;\n        let result:u8 = a - val;\n        const lookup:u8 = ((a & 0x08) >> 3) | ((val & 0x08) >> 2) | ((result & 0x08) >> 1);\n        HL = hl + 1;\n        const bc:u16 = BC - 1;\n        BC = bc;\n        let f:u8 = (F & FLAG_C) | (bc ? (FLAG_V | FLAG_N) : FLAG_N) | halfcarrySubTable[lookup] | (result ? 0 : FLAG_Z) | (result & FLAG_S);\n        if (f & FLAG_H) result--;\n        f |= (result & FLAG_3) | ( (result & 0x02) ? FLAG_5 : 0 );\n        F = f;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        if ((f & (FLAG_V | FLAG_Z)) == FLAG_V) {\n            pc -= 2;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n            contendDirtyRead(hl);\n            t++;\n        }\n    ";
  },
  'CPL': function CPL() {
    return "\n        const result:u8 = A ^ 0xff;\n        A = result;\n        F = (F & (FLAG_C | FLAG_P | FLAG_Z | FLAG_S)) | (result & (FLAG_3 | FLAG_5)) | FLAG_N | FLAG_H;\n    ";
  },
  'DAA': function DAA() {
    return "\n        let add:u32 = 0;\n        let a:u32 = u32(A);\n        let f:u8 = F;\n        let carry:u8 = f & FLAG_C;\n        if ((f & FLAG_H) || ((a & 0x0f) > 9)) add = 6;\n        if (carry || (a > 0x99)) add |= 0x60;\n        if (a > 0x99) carry = FLAG_C;\n        let result:u32;\n        if (f & FLAG_N) {\n            result = a - add;\n            const lookup:u32 = ((a & 0x88) >> 3) | ((add & 0x88) >> 2) | ((result & 0x88) >> 1);\n            A = result;\n            f = (result & 0x100 ? FLAG_C : 0) | FLAG_N | halfcarrySubTable[lookup & 0x07] | overflowSubTable[lookup >> 4] | sz53Table[u8(result)];\n        } else {\n            result = a + add;\n            const lookup:u32 = ((a & 0x88) >> 3) | ((add & 0x88) >> 2) | ((result & 0x88) >> 1);\n            A = result;\n            f = (result & 0x100 ? FLAG_C : 0) | halfcarryAddTable[lookup & 0x07] | overflowAddTable[lookup >> 4] | sz53Table[u8(result)];\n        }\n        F = (f & ~(FLAG_C | FLAG_P)) | carry | parityTable[u8(result)];\n    ";
  },
  'DEC rr': function DECRr(rr) {
    return "\n        ".concat(rr, " = ").concat(rr, " - 1;\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n    ");
  },
  'DEC v': function DECV(v) {
    return "\n        ".concat(valueGetter(v), "\n        const tempF:u8 = (F & FLAG_C) | (val & 0x0f ? 0 : FLAG_H) | FLAG_N;\n        const result:u8 = val - 1;\n        ").concat(valueSetter(v), "\n        F = tempF | (result == 0x7f ? FLAG_V : 0) | sz53Table[result];\n    ");
  },
  'DI': function DI() {
    return "\n        iff1 = iff2 = 0;\n    ";
  },
  'DJNZ n': function DJNZN() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        const b:u8 = B - 1;\n        B = b;\n        if (b) {\n            /* take branch */\n            const offset = i8(readMem(pc));\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            pc += i16(offset) + 1;\n        } else {\n            /* do not take branch */\n            contendRead(pc++);\n            t += 3;\n        }\n    ";
  },
  'EI': function EI() {
    return "\n        iff1 = iff2 = 1;\n        interruptible = false;\n    ";
  },
  'EX (SP),rr': function EXSPRr(rr) {
    return "\n        const sp:u16 = SP;\n        const lo = u16(readMem(sp));\n        const hi = u16(readMem(sp + 1));\n        contendDirtyRead(sp + 1);\n        t++;\n        const rr:u16 = ".concat(rr, ";\n        writeMem(sp + 1, u8(rr >> 8));\n        writeMem(sp, u8(rr & 0xff));\n        ").concat(rr, " = lo | (hi << 8);\n        contendDirtyWrite(sp);\n        t++;\n        contendDirtyWrite(sp);\n        t++;\n    ");
  },
  'EX AF,AF\'': function EXAFAF() {
    return "\n        let tmp:u16 = AF;\n        AF = AF_;\n        AF_ = tmp;\n    ";
  },
  'EX DE,HL': function EXDEHL() {
    return "\n        let tmp:u16 = DE;\n        DE = HL;\n        HL = tmp;\n    ";
  },
  'EXX': function EXX() {
    return "\n        let tmp:u16 = BC;\n        BC = BC_;\n        BC_ = tmp;\n        tmp = DE;\n        DE = DE_;\n        DE_ = tmp;\n        tmp = HL;\n        HL = HL_;\n        HL_ = tmp;\n    ";
  },
  'HALT': function HALT() {
    return "\n        halted = 1;\n        pc--;\n    ";
  },
  'IM k': function IMK(k) {
    return "\n        im = ".concat(k, ";\n    ");
  },
  'IN r,(C)': function INRC(r) {
    return "\n        const result:u8 = readPort(BC);\n        ".concat(r, " = result;\n        F = (F & FLAG_C) | sz53pTable[result];\n    ");
  },
  'IN A,(n)': function INAN() {
    return "\n        const port:u16 = (u16(A) << 8) | u16(readMem(pc++));\n        A = readPort(port);\n    ";
  },
  'IN F,(C)': function INFC() {
    return "\n        const result:u8 = readPort(BC);\n        F = (F & FLAG_C) | sz53pTable[result];\n    ";
  },
  'INC v': function INCV(v) {
    return "\n        ".concat(valueGetter(v), "\n        const result:u8 = val + 1;\n        ").concat(valueSetter(v), "\n        F = (F & FLAG_C) | (result == 0x80 ? FLAG_V : 0) | (result & 0x0f ? 0 : FLAG_H) | sz53Table[result];\n    ");
  },
  'INC rr': function INCRr(rr) {
    return "\n        ".concat(rr, " = ").concat(rr, " + 1;\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n    ");
  },
  'IND': function IND() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        const bc:u16 = BC;\n        const result:u8 = readPort(bc);\n        const hl:u16 = HL;\n        writeMem(hl, result);\n        const b:u8 = u8(bc >> 8) - 1;\n        B = b;\n        HL = hl - 1;\n\n        const initemp2:u8 = (result + u8(bc & 0xff) - 1);\n\n        F = (result & 0x80 ? FLAG_N : 0) | ((initemp2 < result) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(initemp2 & 0x07) ^ b] ? FLAG_P : 0) | sz53Table[b];\n    ";
  },
  'INDR': function INDR() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        const bc:u16 = BC;\n        const result:u8 = readPort(bc);\n        const hl:u16 = HL;\n        writeMem(hl, result);\n        const b:u8 = u8(bc >> 8) - 1;\n        B = b;\n        HL = hl - 1;\n\n        const initemp2:u8 = (result + u8(bc & 0xff) - 1);\n\n        F = (result & 0x80 ? FLAG_N : 0) | ((initemp2 < result) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(initemp2 & 0x07) ^ b] ? FLAG_P : 0) | sz53Table[b];\n        if (b) {\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            pc -= 2;\n        }\n    ";
  },
  'INI': function INI() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        const bc:u16 = BC;\n        const result:u8 = readPort(bc);\n        const hl:u16 = HL;\n        writeMem(hl, result);\n        const b:u8 = u8(bc >> 8) - 1;\n        B = b;\n        HL = hl + 1;\n\n        const initemp2:u8 = (result + u8(bc & 0xff) + 1);\n\n        F = (result & 0x80 ? FLAG_N : 0) | ((initemp2 < result) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(initemp2 & 0x07) ^ b] ? FLAG_P : 0) | sz53Table[b];\n    ";
  },
  'INIR': function INIR() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        const bc:u16 = BC;\n        const result:u8 = readPort(bc);\n        const hl:u16 = HL;\n        writeMem(hl, result);\n        const b:u8 = u8(bc >> 8) - 1;\n        B = b;\n        HL = hl + 1;\n\n        const initemp2:u8 = (result + u8(bc & 0xff) + 1);\n\n        F = (result & 0x80 ? FLAG_N : 0) | ((initemp2 < result) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(initemp2 & 0x07) ^ b] ? FLAG_P : 0) | sz53Table[b];\n        if (b) {\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            contendDirtyWrite(hl);\n            t++;\n            pc -= 2;\n        }\n    ";
  },
  'JP c,nn': function JPCNn(cond) {
    return "\n        if (".concat(CONDITIONS[cond], ") {\n            let lo = u16(readMem(pc++));\n            let hi = u16(readMem(pc++));\n            pc = lo + (hi << 8);\n        } else {\n            contendRead(pc++);\n            t += 3;\n            contendRead(pc++);\n            t += 3;\n        }\n    ");
  },
  'JP nn': function JPNn() {
    return "\n        let lo = u16(readMem(pc++));\n        let hi = u16(readMem(pc++));\n        pc = lo + (hi << 8);\n    ";
  },
  'JP (HL)': function JPHL() {
    return "\n        pc = HL;\n    ";
  },
  'JP (IX)': function JPIX() {
    return "\n        pc = IX;\n    ";
  },
  'JP (IY)': function JPIY() {
    return "\n        pc = IY;\n    ";
  },
  'JR c,n': function JRCN(cond) {
    return "\n        if (".concat(CONDITIONS[cond], ") {\n            let offset = i8(readMem(pc));\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            contendDirtyRead(pc);\n            t++;\n            pc += i16(offset) + 1;\n        } else {\n            contendRead(pc++);\n            t += 3;\n        }\n    ");
  },
  'JR n': function JRN() {
    return "\n        let offset = i8(readMem(pc));\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        pc += i16(offset) + 1;\n    ";
  },
  'LD (nn),rr': function LDNnRr(rr) {
    return "\n        const lo = u16(readMem(pc++));\n        const hi = u16(readMem(pc++));\n        const addr = lo | (hi << 8);\n        const rr:u16 = ".concat(rr, ";\n        writeMem(addr, u8(rr & 0xff));\n        writeMem(addr + 1, u8(rr >> 8));\n    ");
  },
  'LD (nn),A': function LDNnA() {
    return "\n        const lo = u16(readMem(pc++));\n        const hi = u16(readMem(pc++));\n        writeMem(lo | (hi << 8), A);\n    ";
  },
  'LD r,v': function LDRV(r, v) {
    return r == v ? '' : "\n        ".concat(valueGetter(v), "\n        ").concat(r, " = val;\n        ");
  },
  'LD rr,(nn)': function LDRrNn(rr) {
    return "\n        const lo = u16(readMem(pc++));\n        const hi = u16(readMem(pc++));\n        const addr = lo | (hi << 8);\n        ".concat(rr, " = u16(readMem(addr)) | (u16(readMem(addr + 1)) << 8);\n    ");
  },
  'LD rr,nn': function LDRrNn(rr) {
    return "\n        const lo = u16(readMem(pc++));\n        const hi = u16(readMem(pc++));\n        ".concat(rr, " = lo | (hi << 8);\n    ");
  },
  'LD SP,rr': function LDSPRr(rr2) {
    return "\n        SP = ".concat(rr2, ";\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n    ");
  },
  'LD (BC),A': function LDBCA() {
    return "\n        writeMem(BC, A);\n    ";
  },
  'LD (DE),A': function LDDEA() {
    return "\n        writeMem(DE, A);\n    ";
  },
  'LD (HL),n': function LDHLN() {
    return "\n        writeMem(HL, readMem(pc++));\n    ";
  },
  'LD (HL),r': function LDHLR(r) {
    return "\n        writeMem(HL, ".concat(r, ");\n    ");
  },
  'LD (IX+n),n': function LDIXNN() {
    return "\n        const ixAddr:u16 = IX + i8(readMem(pc++));\n        const result = readMem(pc);\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        pc++;\n        writeMem(ixAddr, result);\n    ";
  },
  'LD (IX+n),r': function LDIXNR(r) {
    return "\n        const ixAddr:u16 = IX + i8(readMem(pc));\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        pc++;\n        writeMem(ixAddr, ".concat(r, ");\n    ");
  },
  'LD (IY+n),n': function LDIYNN() {
    return "\n        const iyAddr:u16 = IY + i8(readMem(pc++));\n        const result = readMem(pc);\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        pc++;\n        writeMem(iyAddr, result);\n    ";
  },
  'LD (IY+n),r': function LDIYNR(r) {
    return "\n        const iyAddr:u16 = IY + i8(readMem(pc));\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        contendDirtyRead(pc);\n        t++;\n        pc++;\n        writeMem(iyAddr, ".concat(r, ");\n    ");
  },
  'LD A,(nn)': function LDANn() {
    return "\n        const lo = u16(readMem(pc++));\n        const hi = u16(readMem(pc++));\n        A = readMem(lo | (hi << 8));\n    ";
  },
  'LD A,(BC)': function LDABC() {
    return "\n        A = readMem(BC);\n    ";
  },
  'LD A,(DE)': function LDADE() {
    return "\n        A = readMem(DE);\n    ";
  },
  'LD A,(HL)': function LDAHL() {
    return "\n        A = readMem(HL);\n    ";
  },
  'LD A,I': function LDAI() {
    return "\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        const val:u8 = u8(ir >> 8);\n        A = val;\n        F = (F & FLAG_C) | sz53Table[val] | (iff2 ? FLAG_V : 0);\n    ";
  },
  'LD A,R': function LDAR() {
    return "\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        const val:u8 = u8(ir & 0xff);\n        A = val;\n        F = (F & FLAG_C) | sz53Table[val] | (iff2 ? FLAG_V : 0);\n    ";
  },
  'LD I,A': function LDIA() {
    return "\n        contendDirtyRead(IR);\n        I = A;\n        t++;\n    ";
  },
  'LD R,A': function LDRA() {
    return "\n        contendDirtyRead(IR);\n        R = A;\n        t++;\n    ";
  },
  'LDD': function LDD() {
    return "\n        const hl:u16 = HL;\n        const de:u16 = DE;\n        let val:u8 = readMem(hl);\n        writeMem(de, val);\n        const bc = BC - 1;\n        BC = bc;\n        val += A;\n        F = (F & ( FLAG_C | FLAG_Z | FLAG_S )) | (bc ? FLAG_V : 0) | (val & FLAG_3) | ((val & 0x02) ? FLAG_5 : 0);\n        HL = hl - 1;\n        DE = de - 1;\n        contendDirtyWrite(de);\n        t++;\n        contendDirtyWrite(de);\n        t++;\n    ";
  },
  'LDDR': function LDDR() {
    return "\n        const hl:u16 = HL;\n        const de:u16 = DE;\n        let val:u8 = readMem(hl);\n        writeMem(de, val);\n        const bc = BC - 1;\n        BC = bc;\n        val += A;\n        F = (F & ( FLAG_C | FLAG_Z | FLAG_S )) | (bc ? FLAG_V : 0) | (val & FLAG_3) | ((val & 0x02) ? FLAG_5 : 0);\n        HL = hl - 1;\n        DE = de - 1;\n        contendDirtyWrite(de);\n        t++;\n        contendDirtyWrite(de);\n        t++;\n        if (bc) {\n            pc -= 2;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n        }\n    ";
  },
  'LDI': function LDI() {
    return "\n        const hl:u16 = HL;\n        const de:u16 = DE;\n        let val:u8 = readMem(hl);\n        writeMem(de, val);\n        const bc = BC - 1;\n        BC = bc;\n        val += A;\n        F = (F & ( FLAG_C | FLAG_Z | FLAG_S )) | (bc ? FLAG_V : 0) | (val & FLAG_3) | ((val & 0x02) ? FLAG_5 : 0);\n        HL = hl + 1;\n        DE = de + 1;\n        contendDirtyWrite(de);\n        t++;\n        contendDirtyWrite(de);\n        t++;\n    ";
  },
  'LDIR': function LDIR() {
    return "\n        const hl:u16 = HL;\n        const de:u16 = DE;\n        let val:u8 = readMem(hl);\n        writeMem(de, val);\n        const bc = BC - 1;\n        BC = bc;\n        val += A;\n        F = (F & ( FLAG_C | FLAG_Z | FLAG_S )) | (bc ? FLAG_V : 0) | (val & FLAG_3) | ((val & 0x02) ? FLAG_5 : 0);\n        HL = hl + 1;\n        DE = de + 1;\n        contendDirtyWrite(de);\n        t++;\n        contendDirtyWrite(de);\n        t++;\n        if (bc) {\n            pc -= 2;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n            contendDirtyWrite(de);\n            t++;\n        }\n    ";
  },
  'NEG': function NEG() {
    return "\n        const a:i32 = i32(A);\n        const result:i32 = -a;\n        const lookup:i32 = ((a & 0x88) >> 2) | ((result & 0x88) >> 1);\n        A = result;\n        F = (result & 0x100 ? FLAG_C : 0) | FLAG_N | halfcarrySubTable[lookup & 0x07] | overflowSubTable[lookup >> 4] | sz53Table[u8(result)];\n    ";
  },
  'NOP': function NOP() {
    return '';
  },
  'OR A': function ORA() {
    return "\n        F = sz53pTable[A];\n    ";
  },
  'OR v': function ORV(v) {
    return "\n        ".concat(valueGetter(v), "\n        const result:u8 = A | val;\n        A = result;\n        F = sz53pTable[result];\n    ");
  },
  'OTDR': function OTDR() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        let hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const bc:u16 = BC - 0x100;  /* the decrement does happen first, despite what the specs say */\n        const b:u8 = u8(bc >> 8);\n        B = b;\n        writePort(bc, val);\n        hl--;\n        HL = hl;\n        const outitemp2:u8 = val + u8(hl & 0xff);\n        F = (val & 0x80 ? FLAG_N : 0) | ((outitemp2 < val) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(outitemp2 & 0x07) ^ b ] ? FLAG_P : 0 ) | sz53Table[b];\n        if (b) {\n            pc -= 2;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n        }\n    ";
  },
  'OTIR': function OTIR() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        let hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const bc:u16 = BC - 0x100;  /* the decrement does happen first, despite what the specs say */\n        const b:u8 = u8(bc >> 8);\n        B = b;\n        writePort(bc, val);\n        hl++;\n        HL = hl;\n        const outitemp2:u8 = val + u8(hl & 0xff);\n        F = (val & 0x80 ? FLAG_N : 0) | ((outitemp2 < val) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(outitemp2 & 0x07) ^ b ] ? FLAG_P : 0 ) | sz53Table[b];\n        if (b) {\n            pc -= 2;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n            contendDirtyRead(bc);\n            t++;\n        }\n    ";
  },
  'OUT (n),A': function OUTNA() {
    return "\n        const lo:u16 = u16(readMem(pc++));\n        const a:u8 = A;\n        writePort(lo | (u16(a) << 8), a);\n    ";
  },
  'OUT (C),0': function OUTC0() {
    return "\n        writePort(BC, 0);\n    ";
  },
  'OUT (C),r': function OUTCR(r) {
    return "\n        writePort(BC, ".concat(r, ");\n    ");
  },
  'OUTD': function OUTD() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        let hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const bc:u16 = BC - 0x100;  /* the decrement does happen first, despite what the specs say */\n        const b:u8 = u8(bc >> 8);\n        B = b;\n        writePort(bc, val);\n        hl--;\n        HL = hl;\n        const outitemp2:u8 = val + u8(hl & 0xff);\n        F = (val & 0x80 ? FLAG_N : 0) | ((outitemp2 < val) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(outitemp2 & 0x07) ^ b ] ? FLAG_P : 0 ) | sz53Table[b];\n    ";
  },
  'OUTI': function OUTI() {
    return "\n        contendDirtyRead(IR);\n        t++;\n        let hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        const bc:u16 = BC - 0x100;  /* the decrement does happen first, despite what the specs say */\n        const b:u8 = u8(bc >> 8);\n        B = b;\n        writePort(bc, val);\n        hl++;\n        HL = hl;\n        const outitemp2:u8 = val + u8(hl & 0xff);\n        F = (val & 0x80 ? FLAG_N : 0) | ((outitemp2 < val) ? (FLAG_H | FLAG_C) : 0) | (parityTable[(outitemp2 & 0x07) ^ b ] ? FLAG_P : 0 ) | sz53Table[b];\n    ";
  },
  'POP rr': function POPRr(rr) {
    return "\n        let sp = SP;\n        const lo = u16(readMem(sp++));\n        const hi = u16(readMem(sp++));\n        SP = sp;\n        ".concat(rr, " = lo | (hi << 8);\n    ");
  },
  'PUSH rr': function PUSHRr(rr) {
    return "\n        contendDirtyRead(IR);\n        t++;\n        const rr:u16 = ".concat(rr, ";\n        let sp = SP;\n        sp--;\n        writeMem(sp, u8(rr >> 8));\n        sp--;\n        writeMem(sp, u8(rr & 0xff));\n        SP = sp;\n    ");
  },
  'RES k,v': function RESKV(k, v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const result:u8 = val & ").concat(0xff ^ 1 << k, ";\n        ").concat(valueSetter(v), "\n    ");
  },
  'RET': function RET() {
    return "\n        let sp = SP;\n        const lo = u16(readMem(sp++));\n        const hi = u16(readMem(sp++));\n        SP = sp;\n        pc = lo | (hi << 8);\n    ";
  },
  'RET c': function RETC(cond) {
    return "\n        contendDirtyRead(IR);\n        t++;\n        if (".concat(CONDITIONS[cond], ") {\n            let sp = SP;\n            const lo = u16(readMem(sp++));\n            const hi = u16(readMem(sp++));\n            SP = sp;\n            pc = lo | (hi << 8);\n        }\n    ");
  },
  'RETN': function RETN() {
    return "\n        iff1 = iff2;\n        let sp = SP;\n        const lo = u16(readMem(sp++));\n        const hi = u16(readMem(sp++));\n        SP = sp;\n        pc = lo | (hi << 8);\n    ";
  },
  'RL v': function RLV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const result:u8 = (val << 1) | (F & FLAG_C);\n        F = (val >> 7) | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'RLA': function RLA() {
    return "\n        const val:u8 = A;\n        const f:u8 = F;\n        const result:u8 = (val << 1) | (f & FLAG_C);\n        A = result;\n        F = (f & (FLAG_P | FLAG_Z | FLAG_S)) | (result & (FLAG_3 | FLAG_5)) | (val >> 7);\n    ";
  },
  'RLC v': function RLCV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const result:u8 = ((val << 1) | (val >> 7));\n        F = (result & FLAG_C) | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'RLCA': function RLCA() {
    return "\n        let a:u8 = A;\n        a = (a << 1) | (a >> 7);\n        A = a;\n        F = (F & (FLAG_P | FLAG_Z | FLAG_S)) | (a & (FLAG_C | FLAG_3 | FLAG_5));\n    ";
  },
  'RLD': function RLD() {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        const a:u8 = A;\n        const result:u8 = (val << 4) | (a & 0x0f);\n        writeMem(hl, result);\n        const finalA:u8 = (a & 0xf0) | (val >> 4);\n        A = finalA;\n        F = (F & FLAG_C) | sz53pTable[finalA];\n    ";
  },
  'RR v': function RRV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const result:u8 = (val >> 1) | (F << 7);\n        F = (val & FLAG_C) | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'RRA': function RRA() {
    return "\n        const val:u8 = A;\n        const f:u8 = F;\n        const result = (val >> 1) | (f << 7);\n        A = result;\n        F = (f & (FLAG_P | FLAG_Z | FLAG_S)) | (result & (FLAG_3 | FLAG_5)) | (val & FLAG_C);\n    ";
  },
  'RRC v': function RRCV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const f:u8 = val & FLAG_C;\n        const result:u8 = ((val >> 1) | (val << 7));\n        F = f | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'RRCA': function RRCA() {
    return "\n        let a:u8 = A;\n        const f:u8 = (F & (FLAG_P | FLAG_Z | FLAG_S)) | (a & FLAG_C);\n        a = (a >> 1) | (a << 7);\n        A = a;\n        F = f | (a & (FLAG_3 | FLAG_5));\n    ";
  },
  'RRD': function RRD() {
    return "\n        const hl:u16 = HL;\n        const val:u8 = readMem(hl);\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        contendDirtyRead(hl);\n        t++;\n        const a:u8 = A;\n        const result:u8 = (a << 4) | (val >> 4);\n        writeMem(hl, result);\n        const finalA:u8 = (a & 0xf0) | (val & 0x0f);\n        A = finalA;\n        F = (F & FLAG_C) | sz53pTable[finalA];\n    ";
  },
  'RST k': function RSTK(k) {
    return "\n        contendDirtyRead(IR);\n        t++;\n        let sp = SP;\n        sp--;\n        writeMem(sp, u8(pc >> 8));\n        sp--;\n        writeMem(sp, u8(pc & 0xff));\n        SP = sp;\n        pc = ".concat(k, ";\n    ");
  },
  'SBC A,v': function SBCAV(v) {
    return "\n        ".concat(valueGetter(v), "\n        let a:u32 = u32(A);\n        const result:u32 = a - u32(val) - u32(F & FLAG_C);\n        const lookup:u32 = ( (a & 0x88) >> 3 ) | ( (val & 0x88) >> 2 ) | ( (result & 0x88) >> 1 );\n        A = result;\n        F = (result & 0x100 ? FLAG_C : 0) | FLAG_N | halfcarrySubTable[lookup & 0x07] | overflowSubTable[lookup >> 4] | sz53Table[u8(result)];\n    ");
  },
  'SBC HL,rr': function SBCHLRr(rr) {
    return "\n        const hl:u16 = HL;\n        const rr:u16 = ".concat(rr, ";\n        const sub16temp:u32 = u32(hl) - u32(rr) - (F & FLAG_C);\n        const lookup:u32 = ((hl & 0x8800) >> 11) | ((rr & 0x8800) >> 10) | ((sub16temp & 0x8800) >> 9);\n        HL = u16(sub16temp);\n        F = (sub16temp & 0x10000 ? FLAG_C : 0) | FLAG_N | overflowSubTable[lookup >> 4] | (((sub16temp & 0xff00) >> 8) & ( FLAG_3 | FLAG_5 | FLAG_S )) | halfcarrySubTable[lookup&0x07] | (sub16temp & 0xffff ? 0 : FLAG_Z);\n        const ir:u16 = IR;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n        contendDirtyRead(ir);\n        t++;\n    ");
  },
  'SCF': function SCF() {
    return "\n        F = (F & (FLAG_P | FLAG_Z | FLAG_S)) | (A & (FLAG_3 | FLAG_5)) | FLAG_C;\n    ";
  },
  'SET k,v': function SETKV(k, v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const result:u8 = val | ").concat(1 << k, ";\n        ").concat(valueSetter(v), "\n    ");
  },
  'SLA v': function SLAV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const f:u8 = val >> 7;\n        const result:u8 = val << 1;\n        F = f | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'SLL v': function SLLV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const f:u8 = val >> 7;\n        const result:u8 = (val << 1) | 0x01;\n        F = f | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'SRA v': function SRAV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const f:u8 = val & FLAG_C;\n        const result:u8 = (val & 0x80) | (val >> 1);\n        F = f | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'SRL v': function SRLV(v) {
    return "\n        ".concat(valueGetter(v, true), "\n        const f:u8 = val & FLAG_C;\n        const result:u8 = val >> 1;\n        F = f | sz53pTable[result];\n        ").concat(valueSetter(v), "\n    ");
  },
  'SUB v': function SUBV(v) {
    return "\n        ".concat(valueGetter(v), "\n        let a:u32 = u32(A);\n        const result:u32 = a - u32(val);\n        const lookup:u32 = ( (a & 0x88) >> 3 ) | ( (val & 0x88) >> 2 ) | ( (result & 0x88) >> 1 );\n        A = result;\n        F = (result & 0x100 ? FLAG_C : 0) | FLAG_N | halfcarrySubTable[lookup & 0x07] | overflowSubTable[lookup >> 4] | sz53Table[u8(result)];\n    ");
  },
  'XOR A': function XORA() {
    return "\n        A = 0;\n        F = sz53pTable[0];\n    ";
  },
  'XOR v': function XORV(v) {
    return "\n        ".concat(valueGetter(v), "\n        const result:u8 = A ^ val;\n        A = result;\n        F = sz53pTable[result];\n    ");
  }
};
exports["default"] = _default;
import {actionTypes} from "../actions/zxbasic";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    basicCode: `REM From the ZX Spectrum 48K Manual

DIM m, n, c AS BYTE

FOR m = 0 TO 1: BRIGHT m
FOR n = 1 TO 10
FOR c = 0 TO 7
PAPER c: PRINT "    ";: REM 4 coloured spaces
NEXT c: NEXT n: NEXT m

FOR m = 0 TO 1: BRIGHT m: PAPER 7
FOR c = 0 TO 3
INK c: PRINT c; "   ";
NEXT c: PAPER 0
FOR c = 4 TO 7
INK c: PRINT c; "   ";
NEXT c: NEXT m
PAPER 7: INK 0: BRIGHT 0`
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function setBasicCode(state, action) {
    return {
        ...state,
        basicCode: action.basic
    }
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setBasicCode]: setBasicCode,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

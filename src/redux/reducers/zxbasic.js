import {actionTypes} from "../actions/zxbasic";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    basicCode:
        '10 CLS\n' +
        '20 PRINT "HELLO WORLD!"\n'
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

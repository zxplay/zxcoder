import {actionTypes} from "../actions/basic";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    basicCode: '10 PRINT "Hello"\n20 GO TO 10'
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

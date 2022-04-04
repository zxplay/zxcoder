import {actionTypes} from "../actions/eightbit";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    // tap: undefined
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

/*
function setTap(state, action) {
    return {
        ...state,
        tap: action.tap,
    };
}
*/

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    // [actionTypes.setTap]: setTap,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

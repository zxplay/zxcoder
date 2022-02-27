import {actionTypes} from "../actions/project";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    type: undefined,
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function setType(state, action) {
    return {
        ...state,
        type: action.type,
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setType]: setType,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

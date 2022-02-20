import {actionTypes} from "../actions/jsspeccy";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    selectedTabIndex: 0
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function setSelectedTabIndex(state, action) {
    return {
        ...state,
        selectedTabIndex: action.index
    }
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setSelectedTabIndex]: setSelectedTabIndex,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

import {actionTypes} from "../actions/project";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    selectedTabIndex: 0,
    type: undefined,
    ready: false,
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

function setReady(state, action) {
    return {
        ...state,
        ready: action.ready,
    };
}

function showNewProjectForm(state, action) {
    return {
        ...initialState,
        type: action.projectType,
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setSelectedTabIndex]: setSelectedTabIndex,
    [actionTypes.setReady]: setReady,
    [actionTypes.showNewProjectForm]: showNewProjectForm,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

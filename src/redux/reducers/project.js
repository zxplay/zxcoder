import {actionTypes} from "../actions/project";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    selectedTabIndex: 0,
    type: undefined,
    ready: false,
    code: '',
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

function showNewProjectForm(state, action) {
    return {
        ...initialState,
        type: action.projectType,
    };
}

function setReady(state, action) {
    return {
        ...state,
        ready: action.ready,
    };
}

function setCode(state, action) {
    return {
        ...state,
        code: action.code,
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setSelectedTabIndex]: setSelectedTabIndex,
    [actionTypes.showNewProjectForm]: showNewProjectForm,
    [actionTypes.setReady]: setReady,
    [actionTypes.setCode]: setCode,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

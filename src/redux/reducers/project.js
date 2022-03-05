import {actionTypes, loadProject} from "../actions/project";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    selectedTabIndex: 0,
    type: undefined, // lang
    id: undefined,
    title: undefined,
    code: '',
    savedCode: ''
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function reset() {
    return {...initialState};
}

function setSelectedTabIndex(state, action) {
    return {
        ...state,
        selectedTabIndex: action.index
    };
}

function createNewProject(state, action) {
    return {
        ...state,
        title: action.title,
        selectedTabIndex: 0
    };
}

function receiveLoadedProject(state, action) {
    return {
        ...state,
        id: action.id,
        title: action.title,
        type: action.lang,
        code: action.code,
        savedCode: action.code,
        selectedTabIndex: 0
    };
}

function setCode(state, action) {
    return {
        ...state,
        code: action.code,
    };
}

function setSavedCode(state, action) {
    return {
        ...state,
        savedCode: action.code,
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.reset]: reset,
    [actionTypes.loadProject]: reset,
    [actionTypes.setSelectedTabIndex]: setSelectedTabIndex,
    [actionTypes.createNewProject]: createNewProject,
    [actionTypes.receiveLoadedProject]: receiveLoadedProject,
    [actionTypes.setCode]: setCode,
    [actionTypes.setSavedCode]: setSavedCode,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

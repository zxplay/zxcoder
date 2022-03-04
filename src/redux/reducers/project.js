import {actionTypes} from "../actions/project";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    selectedTabIndex: 0,
    type: undefined, // lang
    ready: false,
    id: undefined,
    title: undefined,
    code: '',
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function reset(state, action) {
    return {...initialState};
}

function setSelectedTabIndex(state, action) {
    return {
        ...state,
        selectedTabIndex: action.index
    };
}

function showNewProjectForm(state, action) {
    return {
        ...initialState,
        type: action.projectType,
    };
}

function hideNewProjectForm(state, _) {
    return !state.ready ? {...initialState} : {...state};
}

function createNewProject(state, action) {
    let selectedTabIndex = 0;
    switch (state.type) {
        case 'zxbasic':
            selectedTabIndex = 0;
            break;
        case 'basic':
            selectedTabIndex = 1;
            break;
        case 'asm':
            selectedTabIndex = 2;
            break;
    }

    return {
        ...state,
        title: action.title,
        selectedTabIndex
    };
}

function receiveLoadedProject(state, action) {
    let selectedTabIndex = 0;
    switch (action.lang) {
        case 'zxbasic':
            selectedTabIndex = 0;
            break;
        case 'basic':
            selectedTabIndex = 1;
            break;
        case 'asm':
            selectedTabIndex = 2;
            break;
    }

    return {
        ...state,
        id: action.id,
        title: action.title,
        type: action.lang,
        code: action.code,
        selectedTabIndex,
        ready: true
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
    [actionTypes.reset]: reset,
    [actionTypes.setSelectedTabIndex]: setSelectedTabIndex,
    [actionTypes.showNewProjectForm]: showNewProjectForm,
    [actionTypes.hideNewProjectForm]: hideNewProjectForm,
    [actionTypes.createNewProject]: createNewProject,
    [actionTypes.receiveLoadedProject]: receiveLoadedProject,
    [actionTypes.setReady]: setReady,
    [actionTypes.setCode]: setCode,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

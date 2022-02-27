import {actionTypes} from "../actions/project";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    selectedTabIndex: 0,
    type: undefined,
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

function newZXBasicProject(state, _) {
    return {
        ...state,
        type: 'zxbasic',
    };
}

function newSinclairBasicProject(state, _) {
    return {
        ...state,
        type: 'basic',
    };
}

function newAssemblyProject(state, _) {
    return {
        ...state,
        type: 'asm',
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.setSelectedTabIndex]: setSelectedTabIndex,
    [actionTypes.newZXBasicProject]: newZXBasicProject,
    [actionTypes.newSinclairBasicProject]: newSinclairBasicProject,
    [actionTypes.newAssemblyProject]: newAssemblyProject,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

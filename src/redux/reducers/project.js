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
    [actionTypes.newZXBasicProject]: newZXBasicProject,
    [actionTypes.newSinclairBasicProject]: newSinclairBasicProject,
    [actionTypes.newAssemblyProject]: newAssemblyProject,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

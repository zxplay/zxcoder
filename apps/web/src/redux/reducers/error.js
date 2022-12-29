import {actionTypes} from "../error/actions";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    errorTitle: undefined,
    errorDescription: undefined,
    errorRoute: undefined,
    isError: false,
    isNotFound: false,
    isAccessDenied: false,
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function reset() {
    return {...initialState};
}

function error(state, action) {
    return {
        ...state,
        errorTitle: action.title,
        errorDescription: action.description,
        errorRoute: undefined,
        isError: true,
        isNotFound: false,
        isAccessDenied: false,
    };
}

function notFound(state, action) {
    return {
        ...state,
        errorTitle: undefined,
        errorDescription: undefined,
        errorRoute: action.route,
        isError: false,
        isNotFound: true,
        isAccessDenied: false,
    };
}

function accessDenied(state/*, action*/) {
    return {
        ...state,
        errorTitle: undefined,
        errorDescription: undefined,
        errorRoute: undefined,
        isError: false,
        isNotFound: false,
        isAccessDenied: true,
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.reset]: reset,
    [actionTypes.error]: error,
    [actionTypes.notFound]: notFound,
    [actionTypes.accessDenied]: accessDenied,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

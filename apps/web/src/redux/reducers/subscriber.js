import {actionTypes} from "../subscriber/subscriber";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    subscribeFunctionReceived: false,
    subscribedActions: {}
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function notifySubscribeFunctionReceived(state/*, action*/) {
    return {
        ...state,
        subscribeFunctionReceived: true,
    };
}

function subscribeAction(state, action) {
    const actions = state.subscribedActions;
    actions[action.action.type] = action.action;
    return {
        ...state,
        subscribedActions: actions,
    };
}

function unsubscribeAction(state, action) {
    const actions = state.subscribedActions;
    delete actions[action.action.type];
    return {
        ...state,
        subscribedActions: actions,
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.notifySubscribeFunctionReceived]: notifySubscribeFunctionReceived,
    [actionTypes.subscribeAction]: subscribeAction,
    [actionTypes.unsubscribeAction]: unsubscribeAction,
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}

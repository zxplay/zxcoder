export const actionTypes = {
    connectClient: 'subscriber/connectClient',
    notifySubscribeFunctionReceived: 'subscriber/notifySubscribeFunctionReceived',
    subscribeAction: 'subscriber/subscribeAction',
    unsubscribeAction: 'subscriber/unsubscribeAction',
    subscribe: 'subscriber/subscribe',
};

export const connectClient = () => ({
    type: actionTypes.connectClient
});

export const notifySubscribeFunctionReceived = () => ({
    type: actionTypes.notifySubscribeFunctionReceived
});

export const subscribeAction = (action) => ({
    type: actionTypes.subscribeAction,
    action
});

export const unsubscribeAction = (action) => ({
    type: actionTypes.unsubscribeAction,
    action
});

export const subscribe = (action, query, variables, callback) => ({
    type: actionTypes.subscribe,
    action, query, variables, callback
});

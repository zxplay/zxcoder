// NOTE: Based on https://github.com/rob-blackbourn/jetblack-graphql-client

import Constants from "./constants";

export class SubscriptionClient {

    constructor(url, options, callback, protocols = 'graphql-ws') {
        this.callback = callback;

        this.nextId = 1;
        this.subscriptions = new Map();
        this.webSocket = new WebSocket(url, protocols);

        this.webSocket.onopen = event => {

            // Initiate the connection
            this.webSocket.send(JSON.stringify({
                type: GQL.CONNECTION_INIT,
                payload: options
            }))
        }

        this.webSocket.onclose = event => {

            // The code 1000 (Normal Closure) is special, and results in no error or payload.
            const error = event.code === 1000 ? null : new EventError(event);

            // Notify the subscriber.
            this.callback(error);

            // Notify the subscriptions.
            const callbacks = Array.from(this.subscriptions.values());

            this.subscriptions.clear();

            for (const callback of callbacks) {
                callback(error, null);
            }
        }

        this.subscribe = this.subscribe.bind(this);
        this.shutdown = this.shutdown.bind(this);
        this.onMessage = this.webSocket.onmessage = this.onMessage.bind(this);
    }

    subscribe(query, variables, operationName, callback) {
        const id = (this.nextId++).toString();

        this.subscriptions.set(id, callback);

        if (Constants.logSubs) {
            console.log('New subscription:', id, this.subscriptions);
        }

        this.webSocket.send(JSON.stringify({
            type: GQL.START,
            id,
            payload: {query, variables, operationName}
        }));

        // Return the unsubscriber.
        return () => {
            this.subscriptions.delete(id);

            if (Constants.logSubs) {
                console.log('Removed subscription:', id, this.subscriptions);
            }

            switch (this.webSocket.readyState) {
                case 0: // CONNECTING
                case 1: // OPEN
                    this.webSocket.send(JSON.stringify({
                        type: GQL.STOP,
                        id
                    }));
                    break;
                case 2: // CLOSING
                case 3: // CLOSED
                    return;
                default:
                    console.error('unknown readyState');
                    break;
            }
        }
    }

    shutdown() {
        switch (this.webSocket.readyState) {
            case 0: // CONNECTING
            case 1: // OPEN
                this.webSocket.send(JSON.stringify({type: GQL.CONNECTION_TERMINATE}));
                this.webSocket.close();
                break;
            case 2: // CLOSING
            case 3: // CLOSED
                return;
            default:
                console.error('unknown readyState');
                break;
        }
    }

    onMessage(event) {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case GQL.CONNECTION_ACK: {

                // This is the successful response to GQL.CONNECTION_INIT
                if (this.callback) {
                    this.callback(null, this.subscribe.bind(this));
                }

                break;
            }
            case GQL.CONNECTION_ERROR: {

                // This may occur:
                // 1. In response to GQL.CONNECTION_INIT
                // 2. In case of parsing errors in the client which will not disconnect.
                if (this.callback) {
                    this.callback(new GraphQLError(data.payload), this);
                }

                break;
            }
            case GQL.CONNECTION_KEEP_ALIVE: {

                // This may occur:
                // 1. After GQL.CONNECTION_ACK,
                // 2. Periodically to keep the connection alive.

                break;
            }
            case GQL.DATA: {

                // This message is sent after GQL.START to transfer the result of the GraphQL subscription.
                const callback = this.subscriptions.get(data.id);
                if (callback) {
                    const error = data.payload.errors ? new GraphQLError(data.payload.errors) : null;
                    callback(error, data.payload.data);
                }

                break;
            }
            case GQL.ERROR: {

                // This method is sent when a subscription fails. This is usually dues to validation errors
                // as resolver errors are returned in GQL.DATA messages.

                const callback = this.subscriptions.get(data.id);
                if (callback) {
                    callback(new GraphQLError(data.payload), null);
                }

                break;
            }
            case GQL.COMPLETE: {

                // This is sent when the operation is done and no more dta will be sent.
                const callback = this.subscriptions.get(data.id);
                if (callback) {
                    this.subscriptions.delete(data.id);

                    // Return a null error and payload to indicate the subscription is closed.
                    callback(null, null);
                }

                break;
            }
            default: {
                throw new Error('unexpected default case');
            }
        }
    }
}

const GQL = {
    CONNECTION_INIT: 'connection_init',
    CONNECTION_ACK: 'connection_ack',
    CONNECTION_ERROR: 'connection_error',
    CONNECTION_KEEP_ALIVE: 'ka',
    START: 'start',
    STOP: 'stop',
    CONNECTION_TERMINATE: 'connection_terminate',
    DATA: 'data',
    ERROR: 'error',
    COMPLETE: 'complete'
}

export class EventError extends Error {
    constructor(event, ...params) {
        super('EventError');

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventError);
        }

        this.event = event;
    }
}

export class GraphQLError extends Error {
    constructor(details, ...params) {
        super((details && details) || 'GraphQLError');

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GraphQLError);
        }

        this.details = details;
    }
}

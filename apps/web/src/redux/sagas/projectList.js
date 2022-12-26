import {put, takeLatest} from "redux-saga/effects";
import gql from "graphql-tag";
import {
    actionTypes,
    receiveprojectListQueryResult,
    subscribeToProjectList,
    subscribeToProjectListCallback,
} from "../actions/projectList";
import {
    subscribe,
    subscribeAction,
    unsubscribeAction
} from "../actions/subscriber";
import {showError} from "../../errors";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchSubscribeToProjectListActions() {
    yield takeLatest(actionTypes.subscribeToProjectList, handleSubscribeToProjectList);
}

// noinspection JSUnusedGlobalSymbols
export function* watchSubscribeToProjectListCallbackActions() {
    yield takeLatest(actionTypes.subscribeToProjectListCallback, handleSubscribeToProjectListCallback);
}

// noinspection JSUnusedGlobalSymbols
export function* watchUnsubscribeFromProjectListActions() {
    yield takeLatest(actionTypes.unsubscribeFromProjectList, handleUnsubscribeFromProjectList);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleSubscribeToProjectList(action) {
    try {
        const query = gql`
            subscription {
                project(order_by: {created_at: asc}) {
                    project_id
                    title
                    lang
                    created_at
                    updated_at
                }
            }
        `;

        const variables = {};

        yield put(subscribe(action, query, variables, subscribeToProjectListCallback));
        yield put(subscribeAction(action));
    } catch (e) {
        console.error(e);
    }
}

function* handleSubscribeToProjectListCallback(action) {
    try {
        const {error, data} = action;

        if (!error && !data) {
            return; // Normal exit.
        }

        if (error) {
            showError('Websocket Callback Error', error);
            return;
        }

        yield put(receiveprojectListQueryResult(data));
    } catch (e) {
        console.error(e);
    }
}

function* handleUnsubscribeFromProjectList() {
    yield put(unsubscribeAction(subscribeToProjectList()));
}

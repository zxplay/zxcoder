import {takeLatest, select} from "redux-saga/effects";
import gql from "graphql-tag";
import {fetch} from "../../graphql_fetch";
import {actionTypes} from "../actions/zxbasic";
import {store} from "../store";
import {loadTape} from "../actions/jsspeccy";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRunBasicActions() {
    yield takeLatest(actionTypes.runBasic, handleRunBasicActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRunBasicActions(_) {
    const basic = yield select((state) => state.zxbasic.basicCode);

    // Call the GraphQL compile action.
    const query = gql`
        mutation ($basic: String!) {
            compile(basic: $basic) {
                base64_encoded
            }
        }
    `;

    const variables = {
        'basic': basic
    };

    const response = yield fetch(query, variables, false);
    const base64 = response.data.compile.base64_encoded;
    const tap = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    yield store.dispatch(loadTape(tap));
}

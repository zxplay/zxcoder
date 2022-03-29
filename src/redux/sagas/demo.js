import {takeLatest, select, put} from "redux-saga/effects";
import {actionTypes} from "../actions/demo";
import {store} from "../store";
import {loadTape, pause} from "../actions/jsspeccy";
import pasmo from "pasmo";
import zmakebas from "zmakebas";
import gql from "graphql-tag";
import {gqlFetch} from "../../graphql_fetch";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForSetSelectedTabIndexActions() {
    yield takeLatest(actionTypes.setSelectedTabIndex, handleSetSelectedTabIndexActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunAssemblyActions() {
    yield takeLatest(actionTypes.runAssembly, handleRunAssemblyActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunSinclairBasicActions() {
    yield takeLatest(actionTypes.runSinclairBasic, handleRunSinclairBasicActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunZXBasicActions() {
    yield takeLatest(actionTypes.runZXBasic, handleRunZXBasicActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunCActions() {
    yield takeLatest(actionTypes.runC, handleRunCActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleSetSelectedTabIndexActions(_) {
    yield put(pause())
}

function* handleRunAssemblyActions(_) {
    try {
        const code = yield select((state) => state.demo.asmCode);
        const tap = yield pasmo(code);
        store.dispatch(loadTape(tap));
    } catch (e) {
        console.error(e);
    }
}

function* handleRunSinclairBasicActions(_) {
    try {
        const code = yield select((state) => state.demo.sinclairBasicCode);
        const tap = yield zmakebas(code);
        store.dispatch(loadTape(tap));
    } catch (e) {
        console.error(e);
    }
}

function* handleRunZXBasicActions(_) {
    try {
        const code = yield select((state) => state.demo.zxBasicCode);

        // TODO: Rename this GraphQL action to 'compileBasic'.
        // Call the GraphQL compile action.
        const query = gql`
            mutation ($basic: String!) {
                compile(basic: $basic) {
                    base64_encoded
                }
            }
        `;

        // TODO: Rename this GraphQL variable to 'code'.
        const variables = {
            'basic': code
        };

        const userId = yield select((state) => state.identity.userId);
        const response = yield gqlFetch(userId, query, variables);
        const base64 = response.data.compile.base64_encoded;
        const tap = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        store.dispatch(loadTape(tap));
    } catch (e) {
        console.error(e);
    }
}

function* handleRunCActions(_) {
    try {
        const code = yield select((state) => state.demo.cCode);

        // Call the GraphQL compile action.
        const query = gql`
            mutation ($code: String!) {
                compileC(code: $code) {
                    base64_encoded
                }
            }
        `;

        const variables = {
            'code': code
        };

        const userId = yield select((state) => state.identity.userId);
        const response = yield gqlFetch(userId, query, variables);
        const base64 = response.data.compileC.base64_encoded;
        const tap = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        store.dispatch(loadTape(tap));
    } catch (e) {
        console.error(e);
    }
}

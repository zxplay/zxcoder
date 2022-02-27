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

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleSetSelectedTabIndexActions(_) {
    yield put(pause())
}

function* handleRunZXBasicActions(_) {
    const basic = yield select((state) => state.demo.zxBasicCode);

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

    const userId = yield select((state) => state.identity.userId);
    const response = yield gqlFetch(userId, query, variables, false);
    const base64 = response.data.compile.base64_encoded;
    const tap = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    store.dispatch(loadTape(tap));
}

function* handleRunSinclairBasicActions(_) {
    const basic = yield select((state) => state.demo.sinclairBasicCode);
    const tap = yield zmakebas(basic);
    store.dispatch(loadTape(tap));
}

function* handleRunAssemblyActions(_) {
    const asm = yield select((state) => state.demo.asmCode);
    const tap = yield pasmo(asm);
    store.dispatch(loadTape(tap));
}

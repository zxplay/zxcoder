import {takeLatest, put, select} from "redux-saga/effects";
import {actionTypes, setReady} from "../actions/project";
import gql from "graphql-tag";
import {gqlFetch} from "../../graphql_fetch";
import {store} from "../store";
import {loadTape, pause} from "../actions/jsspeccy";
import zmakebas from "zmakebas";
import pasmo from "pasmo";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForSetSelectedTabIndexActions() {
    yield takeLatest(actionTypes.setSelectedTabIndex, handleSetSelectedTabIndexActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForCreateNewProjectActions() {
    yield takeLatest(actionTypes.createNewProject, handleCreateNewProjectActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunCodeActions() {
    yield takeLatest(actionTypes.runCode, handleRunCodeActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleSetSelectedTabIndexActions(_) {
    yield put(pause())
}

function* handleCreateNewProjectActions(action) {
    const query = gql`
        mutation ($title: String) {
            insert_project_one(object: {title: $title}) {
                project_id
            }
        }
    `;

    const variables = {
        'title': action.title
    };

    const userId = yield select((state) => state.identity.userId);
    const response = yield gqlFetch(userId, query, variables, false);
    console.assert(response?.data?.insert_project_one?.project_id, response);

    yield put(setReady(true));
}

function* handleRunCodeActions(_) {
    const type = yield select((state) => state.project.type);
    const code = yield select((state) => state.project.code);
    if (type === 'zxbasic') {
        const userId = yield select((state) => state.identity.userId);
        yield runZXBasic(code, userId);
    } else if (type === 'basic') {
        const tap = yield zmakebas(code);
        store.dispatch(loadTape(tap));
    } else {
        const tap = yield pasmo(code);
        store.dispatch(loadTape(tap));
    }
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

async function runZXBasic(code, userId) {
    const query = gql`
        mutation ($basic: String!) {
            compile(basic: $basic) {
                base64_encoded
            }
        }
    `;

    const variables = {
        'basic': code
    };

    const response = await gqlFetch(userId, query, variables, false);
    const base64 = response.data.compile.base64_encoded;
    const tap = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    store.dispatch(loadTape(tap));
}

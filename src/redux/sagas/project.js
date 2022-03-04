import {takeLatest, put, select} from "redux-saga/effects";
import {push} from "connected-react-router";
import gql from "graphql-tag";
import zmakebas from "zmakebas";
import pasmo from "pasmo";
import {gqlFetch} from "../../graphql_fetch";
import {store} from "../store";
import {actionTypes, reset, receiveLoadedProject} from "../actions/project";
import {loadTape, pause, reset as resetMachine} from "../actions/jsspeccy";

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
export function* watchForLoadProjectActions() {
    yield takeLatest(actionTypes.loadProject, handleLoadProjectActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunCodeActions() {
    yield takeLatest(actionTypes.runCode, handleRunCodeActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForSaveCodeChangesActions() {
    yield takeLatest(actionTypes.saveCodeChanges, handleSaveCodeChangesActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForDeleteProjectActions() {
    yield takeLatest(actionTypes.deleteProject, handleDeleteProjectActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleSetSelectedTabIndexActions(_) {
    yield put(pause())
}

function* handleCreateNewProjectActions(action) {
    const type = yield select((state) => state.project.type);

    const query = gql`
        mutation ($title: String!, $lang: String!) {
            insert_project_one(object: {title: $title, lang: $lang}) {
                project_id
            }
        }
    `;

    const variables = {
        'title': action.title,
        'lang': type
    };

    const userId = yield select((state) => state.identity.userId);
    const response = yield gqlFetch(userId, query, variables, false);
    console.assert(response?.data?.insert_project_one?.project_id, response);

    const id = response?.data?.insert_project_one?.project_id;
    yield put(receiveLoadedProject(id, action.title, type, ''));
}

function* handleLoadProjectActions(action) {
    const query = gql`
        query ($project_id: uuid!) {
            project_by_pk(project_id: $project_id) {
                title
                lang
                code
            }
        }
    `;

    const variables = {
        'project_id': action.id
    };

    const userId = yield select((state) => state.identity.userId);
    const response = yield gqlFetch(userId, query, variables, false);
    console.assert(response?.data?.project_by_pk, response);

    const proj = response.data.project_by_pk;
    yield put(receiveLoadedProject(action.id, proj.title, proj.lang, proj.code));
    yield put(push('/'));
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

function* handleSaveCodeChangesActions(_) {
    const id = yield select((state) => state.project.id);
    const code = yield select((state) => state.project.code);

    const query = gql`
        mutation ($project_id: uuid!, $code: String!) {
            update_project_by_pk(pk_columns: {project_id: $project_id}, _set: {code: $code}) {
                project_id
            }
        }
    `;

    const variables = {
        'project_id': id,
        'code': code
    };

    const userId = yield select((state) => state.identity.userId);
    const response = yield gqlFetch(userId, query, variables, false);
    console.assert(response?.data?.update_project_by_pk?.project_id, response);
}

function* handleDeleteProjectActions(_) {
    const id = yield select((state) => state.project.id);

    const query = gql`
        mutation ($project_id: uuid!) {
            delete_project_by_pk(project_id: $project_id) {
                project_id
            }
        }
    `;

    const variables = {
        'project_id': id
    };

    const userId = yield select((state) => state.identity.userId);
    const response = yield gqlFetch(userId, query, variables, false);
    console.assert(response?.data?.delete_project_by_pk?.project_id, response);
    yield put(reset());
    yield put(resetMachine());

    yield put(push('/projects'));
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
    console.assert(response?.data?.compile, response);

    const base64 = response.data.compile.base64_encoded;
    const tap = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    store.dispatch(loadTape(tap));
}

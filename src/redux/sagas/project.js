import {takeLatest, put} from "redux-saga/effects";
import {actionTypes, setReady} from "../actions/project";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRunAssemblyActions() {
    yield takeLatest(actionTypes.createNewProject, handleCreateNewProjectActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleCreateNewProjectActions(action) {
    // TODO: Use a GraphQL API mutation to create new project with given name.
    yield put(setReady(true));
}

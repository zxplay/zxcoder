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
    yield put(setReady(true));
}

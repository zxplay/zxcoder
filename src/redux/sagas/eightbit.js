import {takeLatest, select, call, put} from "redux-saga/effects";
import gql from "graphql-tag";
import {gqlFetch} from "../../graphql_fetch";
import {store} from "../store";
import {
    actionTypes,
    browserTapDownload,
    getProjectTap,
    runTap
} from "../actions/eightbit";
import {loadTape} from "../actions/jsspeccy";
import getZmakebasTap from "zmakebas";
import getPasmoTap from "pasmo";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRunProjectCodeActions() {
    yield takeLatest(actionTypes.runProjectCode, handleRunProjectCodeActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForDownloadProjectTapActions() {
    yield takeLatest(actionTypes.downloadProjectTap, handleDownloadProjectTapActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForGetProjectTapActions() {
    yield takeLatest(actionTypes.getProjectTap, handleGetProjectTapActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForBrowserTapDownloadActions() {
    yield takeLatest(actionTypes.browserTapDownload, handleBrowserTapDownloadActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForRunTapActions() {
    yield takeLatest(actionTypes.runTap, handleRunTapActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRunProjectCodeActions(_) {
    yield put(getProjectTap(runTap));
}

function* handleDownloadProjectTapActions(_) {
    yield put(getProjectTap(browserTapDownload));
}

function* handleGetProjectTapActions(action) {
    const userId = yield select((state) => state.identity.userId);
    const lang = yield select((state) => state.project.lang);
    const code = yield select((state) => state.project.code);
    try {

        // Get .tap file for download.
        let tap;
        switch (lang) {
            case 'asm':
                tap = yield call(getPasmoTap, code);
                break;
            case 'basic':
                tap = yield call(getZmakebasTap, code);
                break;
            case 'c':
                tap = yield call(getZ88dkTap, code, userId);
                break;
            case 'sdcc':
                tap = yield call(getSdccTap, code);
                break;
            case 'zmac':
                tap = yield call(getZmacTap, code);
                break;
            case 'zxbasic':
                tap = yield call(getZXBasicTap, code, userId);
                break;
            default:
                // noinspection ExceptionCaughtLocallyJS
                throw `unexpected case: ${lang}`;
        }

        if (!tap) {
            console.warn('no tap');
            return;
        }

        yield put(action.followTapAction(tap));
    } catch (e) {
        console.error(e);
    }
}

function* handleBrowserTapDownloadActions(action) {
    const title = yield select((state) => state.project.title);
    try {

        // Cause the download of the tap file using browser download.
        const blob = new Blob([action.tap], {type: 'application/octet-stream'});
        const objURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${title}.tap`;
        link.href = objURL;
        link.click();
    } catch (e) {
        console.error(e);
    }
}

function* handleRunTapActions(action) {
    store.dispatch(loadTape(action.tap));
}

// -----------------------------------------------------------------------------
// Supporting functions
// -----------------------------------------------------------------------------

async function getZXBasicTap(code, userId) {
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

    const response = await gqlFetch(userId, query, variables);
    console.assert(response?.data?.compile, response);

    // noinspection JSUnresolvedVariable
    const base64 = response.data.compile.base64_encoded;

    // noinspection JSDeprecatedSymbols
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

async function getZ88dkTap(code, userId) {
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

    const response = await gqlFetch(userId, query, variables);

    // noinspection JSUnresolvedVariable
    console.assert(response?.data?.compileC, response);

    // noinspection JSUnresolvedVariable
    const base64 = response.data.compileC.base64_encoded;

    // noinspection JSDeprecatedSymbols
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

async function getZmacTap(code) {
    // TODO
}

async function getSdccTap(code) {
    // TODO
}

/*
const worker = new Worker("./dist/8bitworker.js");

worker.onmessage = (e) => {
    this.receiveWorkerMessage(e.data);
};

*/

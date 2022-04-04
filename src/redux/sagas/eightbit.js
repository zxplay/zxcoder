import {takeLatest, select, call} from "redux-saga/effects";
import gql from "graphql-tag";
import {gqlFetch} from "../../graphql_fetch";
import {store} from "../store";
import {actionTypes} from "../actions/eightbit";
import getZmakebasTap from "zmakebas";
import getPasmoTap from "pasmo";
import {loadTape} from "../actions/jsspeccy";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForRunProjectCodeActions() {
    yield takeLatest(actionTypes.runProjectCode, handleRunProjectCodeActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForDownloadProjectTapeActions() {
    yield takeLatest(actionTypes.downloadProjectTape, handleDownloadProjectTapeActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRunProjectCodeActions(_) {
    try {
        const userId = yield select((state) => state.identity.userId);
        const lang = yield select((state) => state.project.lang);
        const code = yield select((state) => state.project.code);

        // Get tap to load into emulator.
        const tap = yield call(getTap, userId, lang, code);

        if (!tap) {
            return;
        }

        store.dispatch(loadTape(tap));
    } catch (e) {
        console.error(e);
    }
}

function* handleDownloadProjectTapeActions(_) {
    try {
        const userId = yield select((state) => state.identity.userId);
        const lang = yield select((state) => state.project.lang);
        const code = yield select((state) => state.project.code);

        // Get .tap file for download.
        const tap = yield call(getTap, userId, lang, code);

        if (!tap) {
            return;
        }

        // Cause the download of the tap file using browser download.
        const blob = new Blob([tap], {type: 'application/octet-stream'});
        const objURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'project.tap';
        link.href = objURL;
        link.click();
    } catch (e) {
        console.error(e);
    }
}

// -----------------------------------------------------------------------------
// Supporting functions
// -----------------------------------------------------------------------------

async function getTap(userId, lang, code) {
    switch (lang) {
        case 'asm':
            return await getPasmoTap(code);
        case 'basic':
            return await getZmakebasTap(code);
        case 'c':
            return await getZ88dkTap(code, userId);
        case 'sdcc':
            return await getSdccTap(code);
        case 'zmac':
            return await getZmacTap(code);
        case 'zxbasic':
            return await getZXBasicTap(code, userId);
        default:
            throw `unexpected case: ${lang}`;
    }
}

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

import {takeLatest, select, call, put, take} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import gql from "graphql-tag";
import {gqlFetch} from "../../graphql_fetch";
import {store} from "../store";
import {
    actionTypes,
    browserTapDownload,
    getProjectTap,
    getSdccTap,
    getZmacTap,
    handleWorkerMessage,
    runTap,
    setFollowTapAction
} from "../actions/eightbit";
import {loadTap} from "../actions/jsspeccy";
import getZmakebasTap from "zmakebas";
import getPasmoTap from "pasmo";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForWorkerMessageEvents() {
    const chan = yield call(getWorkerMessagesEventChannel);
    try {
        while (true) {
            const data = yield take(chan);
            yield put(handleWorkerMessage(data));
        }
    } finally {
        chan.close();
    }
}

// noinspection JSUnusedGlobalSymbols
export function* watchForHandleWorkerMessageActions() {
    yield takeLatest(actionTypes.handleWorkerMessage, handleWorkerMessageActions);
}

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
export function* watchForGetSdccTapActions() {
    yield takeLatest(actionTypes.getSdccTap, handleGetSdccTapActions);
}

// noinspection JSUnusedGlobalSymbols
export function* watchForGetZmacTapActions() {
    yield takeLatest(actionTypes.getZmacTap, handleGetZmacTapActions);
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

function* handleWorkerMessageActions(action) {
    const title = yield select((state) => state.project.title);
    const followTapAction = yield select((state) => state.eightbit.followTapAction);
    try {
        console.assert(action?.msg?.data, action);

        const data = action.msg.data;
        console.log('handleWorkerMessageActions', data);

        if (data.errors) {
            const errors = data.errors;
            console.assert(Array.isArray(errors), errors);
            for (let i = 0; i < errors.length; i++) {
                const error = errors[i];
                console.error(`${error.msg} (line: ${error.line})`, error);
            }
        }

        // TODO: Remove the following temporary code.
        // Cause the download of the bin file using browser download.
        const blob = new Blob([data.output], {type: 'application/octet-stream'});
        const objURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${title}.bin`;
        link.href = objURL;
        link.click();

        // TODO: Get tap file, possibly using Pasmo.
        // NOTE: Start address is 23755 (0x5ccb)
        const tap = undefined;

        // noinspection PointlessBooleanExpressionJS
        if (!tap) {
            console.warn('no tap');
            return;
        }

        yield put(followTapAction(tap));
        yield put(setFollowTapAction(undefined));
    } catch (e) {
        console.error(e);
    }
}

function* handleRunProjectCodeActions(_) {
    yield put(setFollowTapAction(runTap));
    yield put(getProjectTap());
}

function* handleDownloadProjectTapActions(_) {
    yield put(setFollowTapAction(browserTapDownload));
    yield put(getProjectTap());
}

function* handleGetProjectTapActions(_) {
    const userId = yield select((state) => state.identity.userId);
    const lang = yield select((state) => state.project.lang);
    const code = yield select((state) => state.project.code);
    const followTapAction = yield select((state) => state.eightbit.followTapAction);
    try {
        let tap;
        switch (lang) {
            case 'asm':
                tap = yield call(getPasmoTap, code);
                yield put(followTapAction(tap));
                yield put(setFollowTapAction(undefined));
                break;
            case 'basic':
                tap = yield call(getZmakebasTap, code);
                yield put(followTapAction(tap));
                yield put(setFollowTapAction(undefined));
                break;
            case 'c':
                tap = yield call(getZ88dkTap, code, userId);
                yield put(followTapAction(tap));
                yield put(setFollowTapAction(undefined));
                break;
            case 'sdcc':
                // NOTE: Call another action to get the tap using worker.
                yield put(getSdccTap());
                break;
            case 'zmac':
                // NOTE: Call another action to get the tap using worker.
                yield put(getZmacTap());
                break;
            case 'zxbasic':
                tap = yield call(getZXBasicTap, code, userId);
                yield put(followTapAction(tap));
                yield put(setFollowTapAction(undefined));
                break;
            default:
                // noinspection ExceptionCaughtLocallyJS
                throw `unexpected case: ${lang}`;
        }
    } catch (e) {
        console.error(e);
    }
}

function* handleGetSdccTapActions(_) {
    const code = yield select((state) => state.project.code);
    try {
        // Build a WorkerMessage and post it to the worker.
        const msg = {updates: [], buildsteps: []};

        // Add main source file.
        const mainFilename = 'source.c';
        msg.updates.push({path: mainFilename, data: code});

        msg.buildsteps.push({
            path: mainFilename,
            files: [mainFilename],
            tool: 'sdcc',
            mainfile: true
        });

        postMessage(msg);
    } catch (e) {
        console.error(e);
    }
}

function* handleGetZmacTapActions(_) {
    const code = yield select((state) => state.project.code);
    try {
        // Build a WorkerMessage and post it to the worker.
        const msg = {updates: [], buildsteps: []};

        // Add main source file.
        const mainFilename = 'source.asm';
        msg.updates.push({path: mainFilename, data: code});

        msg.buildsteps.push({
            path: mainFilename,
            files: [mainFilename],
            tool: 'zmac',
            mainfile: true
        });

        postMessage(msg);
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
    store.dispatch(loadTap(action.tap));
}

// -----------------------------------------------------------------------------
// Supporting code
// -----------------------------------------------------------------------------

// The 8bitworkshop worker compiles projects.
const worker = new Worker('/dist/8bitworker.js');

// Preload tools.
console.log('Preloading 8bitworker tools');
worker.postMessage({preload: 'sdcc'});
worker.postMessage({preload: 'sdasz80'});
worker.postMessage({preload: 'zmac'});

function postMessage(msg) {
    worker.postMessage(msg);
}

function getWorkerMessagesEventChannel() {
    return eventChannel(emit => {

        // Emits data from worker message events.
        worker.onmessage = (e) => {
            emit({data: e.data});
        };

        // Must return an unsubscribe function.
        return () => {
            worker.onmessage = undefined;
        };
    })
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

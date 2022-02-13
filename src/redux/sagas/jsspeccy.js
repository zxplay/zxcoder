import {take, takeLatest, put, call} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {handleClick} from "../actions/jsspeccy";
import {JSSpeccy} from "../../lib/emulator/JSSpeccy";
import {actionTypes} from "../actions/jsspeccy";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

export function* watchForRenderEmulatorActions() {
    yield takeLatest(actionTypes.renderEmulator, handleRenderEmulatorActions);
}

export function* watchForClickEvents() {
    const chan = yield call(getClickEventChannel);
    try {
        while (true) {
            const e = yield take(chan);
            yield put(handleClick(e));
        }
    } finally {
        chan.close();
    }
}

export function* watchForHandleClickActions() {
    yield takeLatest(actionTypes.handleClick, handleClickActions);
}

export function* watchForResetActions() {
    yield takeLatest(actionTypes.reset, handleResetActions);
}

export function* watchForPauseActions() {
    yield takeLatest(actionTypes.pause, handlePauseActions);
}

export function* watchForExitActions() {
    yield takeLatest(actionTypes.exit, handleExitActions);
}

export function* watchForOpenFileDialogActions() {
    yield takeLatest(actionTypes.showOpenFileDialog, handleOpenFileDialogActions);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleRenderEmulatorActions(action) {
    const zoom = action.zoom || 2;
    const target = action.target || document.getElementById('jsspeccy');

    const emuParams = {
        zoom,
        sandbox: false,
        autoLoadTapes: true,
    };

    let doFilter = false;

    const url = new URL(window.location.href);
    for (const [key, value] of url.searchParams) {
        if (key === 'm') {
            if (value === '48' || value === '128' || value === '5') {
                emuParams.machine = value;
            }
        } else if (key === 'u') {
            emuParams.openUrl = value;
        } else if (key === 'f') {
            if (value && value !== '0') {
                doFilter = true;
            }
        }
    }

    jsspeccy = JSSpeccy(target, emuParams);
    // jsspeccy.hideUI();

    if (doFilter) {
        // TODO: Investigate this option, and narrow the element selector.
        document.getElementsByTagName('canvas')[0].style.imageRendering = "auto";
    }
}

function* handleClickActions(action) {
    const target = action.e.target;
    if (target instanceof Element) {
        if (target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.classList.contains('CodeMirror-lines') ||
            target.classList.contains('CodeMirror-line') ||
            target.classList.contains('CodeMirror-sizer') ||
            target.classList.contains('CodeMirror')) {
            jsspeccy.pause();
        }
    }
}

function* handleResetActions(_) {
    jsspeccy.start();
    jsspeccy.reset();
}

function* handlePauseActions(_) {
    jsspeccy.pause();
}

function* handleExitActions(_) {
    jsspeccy.exit();
}

function* handleOpenFileDialogActions(_) {
    jsspeccy.openFileDialog();
}

// -----------------------------------------------------------------------------
// Supporting code
// -----------------------------------------------------------------------------

let jsspeccy = undefined;

function getClickEventChannel() {
    return eventChannel(emit => {
        const emitter = (e) => emit(e);
        window.addEventListener('click', emitter);
        return () => {
            // Must return an unsubscribe function.
            window.removeEventListener('click', emitter);
        }
    })
}

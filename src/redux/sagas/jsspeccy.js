import {take, put, call} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {handleClick} from "../actions/jsspeccy";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

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

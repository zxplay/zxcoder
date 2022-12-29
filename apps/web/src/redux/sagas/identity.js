import axios from "axios";
import {put, takeLatest} from "redux-saga/effects";
import {handleRequestException} from "../../errors";
import {actionTypes, setUserInfo} from "../identity/identity";
import Constants from "../../constants";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

// noinspection JSUnusedGlobalSymbols
export function* watchForGetUserInfoActions() {
    yield takeLatest(actionTypes.getUserInfo, handleGetUserInfo);
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function* handleGetUserInfo() {
    try {

        // NOTE: The following request uses an HTTP-only cookie server-side.
        const response = yield axios.get(`${Constants.authBase}/me`, {withCredentials: true});
        yield put(setUserInfo(response.data));

    } catch (e) {
        if (e.response && e.response.status === 401) {
            return;
        }

        handleRequestException(e);
    }
}

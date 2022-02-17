import {createStore, combineReducers, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";
import {createBrowserHistory} from "history";
import Constants from "../constants";

// Reducers
import jsspeccyReducer from "./reducers/jsspeccy";

// Sagas
import * as jsspeccySagas from "./sagas/jsspeccy";

const loggingMiddleware = (store) => {
    return (next) => {
        return (action) => {

            // noinspection JSUnresolvedVariable
            if (Constants.logActions) {
                const collapsed = false;
                const msg = `Action: ${action.type}`;
                if (collapsed) console.groupCollapsed(msg); else console.group(msg);
                console.log('Action:', action);
                console.log('Previous state:', store.getState());
            }

            const result = next(action);

            // noinspection JSUnresolvedVariable
            if (Constants.logActions) {
                console.log('New state:', store.getState());
                console.groupEnd();
            }

            return result;
        }
    }
};

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    jsspeccy: jsspeccyReducer,
});

export const store = createStore(
    rootReducer,
    applyMiddleware(
        loggingMiddleware,
        sagaMiddleware));

const sagas = [];

function collectSagas(file) {
    for (const name in file) {
        if (file.hasOwnProperty(name)) {
            sagas.push(file[name]());
        }
    }
}

collectSagas(jsspeccySagas);

function* rootSaga() {
    yield all(sagas);
}

sagaMiddleware.run(rootSaga);

import axios from "axios";
import {getAuthToken, isExpired, refreshToken} from "./auth";
import {showError} from "./errors";
import Constants from "./constants";
import {print} from "graphql";
import {dashboardLock, dashboardUnlock} from "./dashboard_lock";

export async function fetch(query, variables, lock) {
    if (lock) dashboardLock();
    const jwt = getAuthToken();
    if (isExpired(jwt)) {
        return refreshToken().then(jwt => fetchWithToken(jwt, query, variables, lock));
    } else {
        return fetchWithToken(jwt, query, variables, lock);
    }
}

function fetchWithToken(jwt, query, variables, lock) {
    return axios.post(Constants.graphQlEndpoint, {
        query: query instanceof Object ? print(query) : query,
        variables,
    }, {
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (lock) dashboardUnlock();

        console.assert(response && response.data, response);
        if (response.data.errors) {
            showError('GraphQL Query Errors', response.data.errors);
            return;
        }

        return response.data;
    }).catch(e => {
        if (lock) dashboardUnlock();
        showError('GraphQL Query Exception', e);
    }).finally(() => lock ? dashboardUnlock() : false);
}

/*
export async function fetchWithRetry(query, variables) {
    const retryLimit = 10;
    for (let attempt = 1; attempt < retryLimit; attempt++) {
        const result = await fetch(query, variables);
        if (result) return result;

        // Delay next attempt.
        console.warn(`query attempt ${attempt} of ${retryLimit} failed`);
        await delay(500);
    }

    throw 'Retry limit exceeded';
}

function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}
*/

import Config from "../config.json";

// NOTE: Some constants provided by webpack & defined in webpack.config.js files.
const stagingEnv = STAGING_ENV;
const authBase = AUTH_BASE;

const isDev = stagingEnv !== 'prod';
const devLogging = true;

export default {
    authBase,
    graphQlEndpoint: `https://${Config.hasuraBase}/v1/graphql`,
    graphQlSubscriptionEndpoint: `wss://${Config.hasuraBase}/v1/graphql`,
    isDev,
    logActions: isDev && devLogging,
    logSubs: isDev && devLogging,
    stagingEnv,
}

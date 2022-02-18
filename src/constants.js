// NOTE: Some constants provided by webpack & defined in webpack.config.js files.
const stagingEnv = STAGING_ENV;

const isDev = stagingEnv !== 'prod';
const devLogging = false;

export default {
    isDev,
    logActions: isDev && devLogging,
}

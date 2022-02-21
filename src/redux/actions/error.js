export const actionTypes = {
    reset: 'error/reset',
    error: 'error/error',
    notFound: 'error/notFound',
    accessDenied: 'error/accessDenied',
};

export const reset = () => ({
    type: actionTypes.reset
});

export const error = (title, description) => ({
    type: actionTypes.error,
    title, description
});

export const notFound = (route) => ({
    type: actionTypes.notFound,
    route
});

export const accessDenied = () => ({
    type: actionTypes.accessDenied
});

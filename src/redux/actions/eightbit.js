export const actionTypes = {
    handleWorkerMessage: 'eightbit/handleWorkerMessage',
    runProjectCode: 'eightbit/runProjectCode',
    downloadProjectTap: 'eightbit/downloadProjectTap',
    getProjectTap: 'eightbit/getProjectTap',
    getSdccTap: 'eightbit/getSdccTap',
    getZmacTap: 'eightbit/getZmacTap',
    setWorkerFollowAction: 'eightbit/setWorkerFollowAction',
    browserTapDownload: 'eightbit/browserTapDownload',
    runTap: 'eightbit/runTap',
};

export const handleWorkerMessage = (msg) => ({
    type: actionTypes.handleWorkerMessage,
    msg
});

export const runProjectCode = () => ({
    type: actionTypes.runProjectCode
});

export const downloadProjectTap = () => ({
    type: actionTypes.downloadProjectTap
});

export const getProjectTap = (followTapAction) => ({
    type: actionTypes.getProjectTap,
    followTapAction
});

export const getSdccTap = (followTapAction) => ({
    type: actionTypes.getSdccTap,
    followTapAction
});

export const getZmacTap = (followTapAction) => ({
    type: actionTypes.getZmacTap,
    followTapAction
});

export const setWorkerFollowAction = (followTapAction) => ({
    type: actionTypes.setWorkerFollowAction,
    followTapAction
});

export const browserTapDownload = (tap) => ({
    type: actionTypes.browserTapDownload,
    tap
});

export const runTap = (tap) => ({
    type: actionTypes.runTap,
    tap
});

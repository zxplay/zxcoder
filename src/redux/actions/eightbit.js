export const actionTypes = {
    runProjectCode: 'eightbit/runProjectCode',
    downloadProjectTap: 'eightbit/downloadProjectTap',
    getProjectTap: 'eightbit/getProjectTap',
    browserTapDownload: 'eightbit/browserTapDownload',
    runTap: 'eightbit/runTap',
};

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

export const browserTapDownload = (tap) => ({
    type: actionTypes.browserTapDownload,
    tap
});

export const runTap = (tap) => ({
    type: actionTypes.runTap,
    tap
});

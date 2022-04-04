export const actionTypes = {
    runProjectCode: 'eightbit/runProjectCode',
    downloadProjectTap: 'eightbit/downloadProjectTap',
    getProjectTap: 'eightbit/getProjectTap',
    browserTapDownload: 'eightbit/browserTapDownload',
};

export const runProjectCode = () => ({
    type: actionTypes.runProjectCode
});

export const downloadProjectTap = () => ({
    type: actionTypes.downloadProjectTap
});

export const getProjectTap = () => ({
    type: actionTypes.getProjectTap
});

export const browserTapDownload = (tap, name) => ({
    type: actionTypes.browserTapDownload,
    tap, name
});

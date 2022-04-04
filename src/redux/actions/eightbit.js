export const actionTypes = {
    runProjectCode: 'eightbit/runProjectCode',
    downloadProjectTape: 'eightbit/downloadProjectTape',
    getProjectTape: 'eightbit/getProjectTape',
    browserTapeDownload: 'eightbit/browserTapeDownload',
};

export const runProjectCode = () => ({
    type: actionTypes.runProjectCode
});

export const downloadProjectTape = () => ({
    type: actionTypes.downloadProjectTape
});

export const getProjectTape = () => ({
    type: actionTypes.getProjectTape
});

export const browserTapeDownload = (tap, name) => ({
    type: actionTypes.browserTapeDownload,
    tap, name
});

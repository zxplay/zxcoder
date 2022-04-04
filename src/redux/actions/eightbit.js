export const actionTypes = {
    runProjectCode: 'eightbit/runProjectCode',
    downloadProjectTape: 'eightbit/downloadProjectTape',
};

export const runProjectCode = () => ({
    type: actionTypes.runProjectCode
});

export const downloadProjectTape = () => ({
    type: actionTypes.downloadProjectTape
});

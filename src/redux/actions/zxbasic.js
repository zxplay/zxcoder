export const actionTypes = {
    setBasicCode: 'zxbasic/setBasicCode',
    runBasic: 'zxbasic/runBasic',
};

export const setBasicCode = (basic) => ({
    type: actionTypes.setBasicCode,
    basic
})

export const runBasic = () => ({
    type: actionTypes.runBasic
})

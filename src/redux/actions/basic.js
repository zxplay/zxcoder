export const actionTypes = {
    setBasicCode: 'basic/setBasicCode',
    runBasic: 'basic/runBasic',
};

export const setBasicCode = (basic) => ({
    type: actionTypes.setBasicCode,
    basic
})

export const runBasic = () => ({
    type: actionTypes.runBasic
})

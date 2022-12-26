export const actionTypes = {
    getUserInfo: 'identity/getUserInfo',
    setUserInfo: 'identity/setUserInfo',
};

export const getUserInfo = () => ({
    type: actionTypes.getUserInfo
});

export const setUserInfo = (userInfo) => ({
    type: actionTypes.setUserInfo,
    userInfo
});

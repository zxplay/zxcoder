export const actionTypes = {
    renderEmulator: 'jsspeccy/renderEmulator',
    handleClick: 'jsspeccy/handleClick',
    exit: 'jsspeccy/exit',
};

export const renderEmulator = (target, zoom) => ({
    type: actionTypes.renderEmulator,
    target, zoom
});

export const handleClick = (e) => ({
    type: actionTypes.handleClick,
    e
});

export const exit = () => ({
    type: actionTypes.exit
})

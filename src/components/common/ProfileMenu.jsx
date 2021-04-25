import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function ProfileMenu(props) {
    const {
        anchorEl, menuId, isMenuOpen,
        onMenuClose, onLogout,
        toggleCEMode, ceMode
    } = props;

    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={onMenuClose}
        >
            <MenuItem onClick={toggleCEMode}>{ceMode ? "PSM Mode" : "CE Mode"}</MenuItem>
            <MenuItem onClick={onLogout}>Log Out</MenuItem>
        </Menu>
    );
}

ProfileMenu.propTypes = {
    anchorEl: PropTypes.object.isRequired,
    menuId: PropTypes.string.isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    onMenuClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    toggleCEMode: PropTypes.func.isRequired,
    ceMode: PropTypes.bool.isRequired,
};

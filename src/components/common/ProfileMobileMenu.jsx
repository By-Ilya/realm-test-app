import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

import Avatar from './Avatar';

export default function ProfileMobileMenu(props) {
    const {
        mobileMoreAnchorEl, mobileMenuId,
        isMobileMenuOpen, onMobileMenuClose,
        onProfileMenuOpen, profile,
    } = props;

    const { name, email, pictureUrl } = profile;

    return (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={onMobileMenuClose}
        >
            <MenuItem onClick={onProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar
                        avatarImage={pictureUrl}
                        accountName={name}
                        accountEmail={email}
                    />
                </IconButton>
            </MenuItem>
        </Menu>
    );
}

ProfileMobileMenu.propTypes = {
    mobileMoreAnchorEl: PropTypes.object,
    mobileMenuId: PropTypes.string.isRequired,
    isMobileMenuOpen: PropTypes.bool.isRequired,
    onMobileMenuClose: PropTypes.func.isRequired,
    onProfileMenuOpen: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

ProfileMobileMenu.defaultProps = {
    mobileMoreAnchorEl: null,
};

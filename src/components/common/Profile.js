import React from 'react';
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    menuId: PropTypes.string.isRequired,
    mobileMenuId: PropTypes.string.isRequired,
    onProfileMenuOpen: PropTypes.func.isRequired,
    onMobileMenuOpen: PropTypes.func.isRequired
}

export default function Profile(props) {
    const {
        classes,
        menuId, mobileMenuId,
        onProfileMenuOpen,
        onMobileMenuOpen
    } = props;

    const {
        sectionDesktop,
        sectionMobile,
    } = classes;

    return (<>
        <div className={sectionDesktop}>
            <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={onProfileMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
        </div>

        <div className={sectionMobile}>
            <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={onMobileMenuOpen}
                color="inherit"
            >
                <MoreIcon />
            </IconButton>
        </div>
    </>)
}
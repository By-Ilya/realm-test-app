import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';

import Avatar from 'components/common/Avatar';

export default function Profile(props) {
    const {
        classes, profile,
        menuId, mobileMenuId,
        onProfileMenuOpen,
        onMobileMenuOpen,
    } = props;

    const {
        sectionDesktop,
        sectionMobile,
    } = classes;

    const { email, name, pictureUrl } = profile;

    return (
        <>
            <div className={sectionDesktop}>
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={onProfileMenuOpen}
                    color="inherit"
                >
                    <Avatar
                        avatarImage={pictureUrl}
                        accountName={name}
                        accountEmail={email}
                    />
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
        </>
    );
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    menuId: PropTypes.string.isRequired,
    mobileMenuId: PropTypes.string.isRequired,
    onProfileMenuOpen: PropTypes.func.isRequired,
    onMobileMenuOpen: PropTypes.func.isRequired,
};

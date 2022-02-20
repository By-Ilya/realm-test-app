import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import AutorenewIcon from '@material-ui/icons/Autorenew';

export default function SyncButton(props) {
    const {
        classes,
        onTriggerSync,
        isSyncActive,
    } = props;

    const { formContainer } = classes;

    const handleClickTriggerSync = () => {
        onTriggerSync();
    };

    return (
        <div className={formContainer}>
            <IconButton onClick={handleClickTriggerSync} aria-label="sync" variant="contained">
                { isSyncActive
                    ? <AutorenewIcon style={{ color: 'yellow' }} />
                    : <AutorenewIcon /> }
            </IconButton>
        </div>
    );
}

SyncButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onTriggerSync: PropTypes.func.isRequired,
    isSyncActive: PropTypes.bool,
};

SyncButton.defaultProps = {
    isSyncActive: false,
};

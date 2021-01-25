import React, {useState} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FormControl from "@material-ui/core/FormControl";

import AutorenewIcon from '@material-ui/icons/Autorenew';

SyncButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onTriggerSync: PropTypes.func.isRequired
}

export default function SyncButton(props) {
    const {
        classes,
        onTriggerSync
    } = props;

    const {formContainer} = classes;

    const handleClickTriggerSync = () => {
        onTriggerSync();
    }

    return (
        <div className={formContainer}>
            <IconButton onClick={handleClickTriggerSync} aria-label="sync" variant="contained">
                <AutorenewIcon />
            </IconButton>
        </div>
    )
}

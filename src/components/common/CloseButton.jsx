import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function CloseButton(props) {
    const { onClick } = props;
    return (
        <IconButton onClick={onClick}>
            <CloseIcon />
        </IconButton>
    );
}

CloseButton.propTypes = {
    onClick: PropTypes.func,
};

CloseButton.defaultProps = {
    onClick: () => {},
};

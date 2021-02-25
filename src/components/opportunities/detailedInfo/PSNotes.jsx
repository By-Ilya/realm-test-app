import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '100%',
    },
}));

export default function PSNotes(props) {
    const classes = useStyles();
    const {
        countRows,
        textValue,
    } = props;

    return (
        <TextField
            label={textValue ? '' : 'PS Notes'}
            multiline
            rows={countRows}
            defaultValue={textValue}
            variant="filled"
            className={classes.textField}
        />

    );
}

PSNotes.propTypes = {
    countRows: PropTypes.number,
    textValue: PropTypes.string,
};

PSNotes.defaultProps = {
    countRows: 10,
    textValue: '',
};

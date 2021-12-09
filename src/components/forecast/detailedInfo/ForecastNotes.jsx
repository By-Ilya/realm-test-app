import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    textField: {
        width: '30%',
    },
    saveButton: {
        marginTop: '10px',
    },
    saveButtonProgress: {
        position: 'absolute',
        marginRight: '3.2rem',
    },
}));

export default function ForecastNotes(props) {
    const classes = useStyles();
    const {
        countRows,
        textValue,
        onSave,
    } = props;

    const [currentText, setCurrentText] = useState(textValue);
    const [updateProcessing, setUpdateProcessing] = useState(false);

    useEffect(() => {
        setCurrentText(textValue);
    }, [textValue]);

    const onChangeText = (event) => {
        setCurrentText(event.target.value);
    };

    const onSaveForecastNotes = async () => {
        setUpdateProcessing(true);
        await onSave(currentText);
        setUpdateProcessing(false);
    };

    return (
        <div className={classes.textFieldContainer}>
            <TextField
                label="Notes"
                multiline
                rows={countRows}
                value={currentText}
                variant="filled"
                className={classes.textField}
                onChange={onChangeText}
            />
            <SaveButton
                updateProcessing={updateProcessing}
                onClick={onSaveForecastNotes}
            />
        </div>
    );
}

ForecastNotes.propTypes = {
    countRows: PropTypes.number,
    textValue: PropTypes.string,
    onSave: PropTypes.func,
};

ForecastNotes.defaultProps = {
    countRows: 10,
    textValue: '',
    onSave: () => {},
};

function SaveButton(props) {
    const classes = useStyles();
    const {
        updateProcessing,
        onClick,
    } = props;

    return (
        <div className={classes.rightButton}>
            <Button
                className={classes.saveButton}
                disabled={updateProcessing}
                variant="contained"
                color="primary"
                onClick={onClick}
            >
                Save
            </Button>
            {updateProcessing && (
                <CircularProgress
                    size={24}
                    className={classes.saveButtonProgress}
                />
            )}
        </div>
    );
}

SaveButton.propTypes = {
    updateProcessing: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

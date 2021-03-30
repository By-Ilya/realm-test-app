import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '100%',
    },
    rightButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: theme.spacing(2),
        paddingTop: 0,
    },
    saveButtonProgress: {
        position: 'absolute',
        marginRight: '3.2rem',
    },
}));

export default function PSNotes(props) {
    const classes = useStyles();
    const {
        countRows,
        textValue,
        onSave,
    } = props;

    const [currentText, setCurrentText] = useState(textValue);
    const [updateProcessing, setUpdateProcessing] = useState(false);

    useEffect(() => {
        console.log(textValue);
        setCurrentText(textValue);
    }, [textValue]);

    const onChangeText = (event) => {
        setCurrentText(event.target.value);
    };

    const onSavePsNotes = async () => {
        setUpdateProcessing(true);
        await onSave(currentText);
        setUpdateProcessing(false);
    };

    return (
        <>
            <ListItem key="ps_notes">
                <TextField
                    label="PS Notes"
                    multiline
                    rows={countRows}
                    value={currentText}
                    variant="filled"
                    className={classes.textField}
                    onChange={onChangeText}
                />
            </ListItem>
            <ListItem key="save_ps_notes">
                <SaveButton
                    updateProcessing={updateProcessing}
                    onClick={onSavePsNotes}
                />
            </ListItem>
        </>
    );
}

PSNotes.propTypes = {
    countRows: PropTypes.number,
    textValue: PropTypes.string,
    onSave: PropTypes.func,
};

PSNotes.defaultProps = {
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
                disabled={updateProcessing}
                variant="contained"
                color="primary"
                onClick={onClick}
            >
                Save notes
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

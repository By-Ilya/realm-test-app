import React, { useState } from 'react';
import uuid from 'react-uuid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    formContainer: {
        marginLeft: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

function isChecked(value, uncheckedValues) {
    return !uncheckedValues.includes(value);
}

function renderCheckboxValues(props) {
    const { allValues, uncheckedValues, onChange } = props;
    return allValues.map((value) => {
        const checked = isChecked(value, uncheckedValues);
        return (
            <FormControlLabel
                key={uuid()}
                control={(
                    <Checkbox
                        checked={checked}
                        onChange={onChange}
                        name={value}
                        color="primary"
                    />
                )}
                label={value}
            />
        );
    });
}

export default function ChooseButton(props) {
    const classes = useStyles();
    const {
        chooseButtonText,
        chooseDialogTitle,
        chooseValues,
        uncheckedValues,
        applyButtonText,
        setUncheckedValues,
    } = props;

    const [openDialog, setOpenDialog] = useState(false);
    const [
        localUnchecked,
        setLocalUnchecked,
    ] = useState(uncheckedValues);

    const onChange = (event) => {
        const columnName = event.target.name;
        if (localUnchecked.includes(columnName)) {
            setLocalUnchecked(localUnchecked.filter(
                (cName) => cName !== columnName,
            ));
        } else {
            setLocalUnchecked([
                ...localUnchecked,
                columnName,
            ]);
        }
    };

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleClickCloseDialog = () => {
        setOpenDialog(false);
    };

    const onSelectAll = () => {
        setLocalUnchecked([]);
    };
    const onUnselectAll = () => {
        setLocalUnchecked(chooseValues);
    };

    const handleClickApply = () => {
        setUncheckedValues(localUnchecked);
        setOpenDialog(false);
    };

    return (
        <div className={classes.formContainer}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpenDialog}
            >
                {chooseButtonText}
            </Button>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={openDialog}
                onClose={handleClickCloseDialog}
            >
                <DialogTitle>{chooseDialogTitle}</DialogTitle>

                <DialogContent>
                    <form className={classes.formContainer}>
                        {renderCheckboxValues({
                            allValues: chooseValues,
                            uncheckedValues: localUnchecked,
                            onChange,
                        })}
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClickCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onSelectAll} color="primary">
                        Select all
                    </Button>
                    <Button onClick={onUnselectAll} color="primary">
                        Unselect all
                    </Button>
                    <Button onClick={handleClickApply} color="primary">
                        {applyButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ChooseButton.propTypes = {
    chooseButtonText: PropTypes.string,
    chooseDialogTitle: PropTypes.string,
    chooseValues: PropTypes.array,
    uncheckedValues: PropTypes.array,
    applyButtonText: PropTypes.string,
    setUncheckedValues: PropTypes.func.isRequired,
};

ChooseButton.defaultProps = {
    chooseButtonText: 'Choose',
    chooseDialogTitle: 'Choose values',
    chooseValues: [],
    uncheckedValues: [],
    applyButtonText: 'Apply',
};

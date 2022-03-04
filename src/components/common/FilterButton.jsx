import React, { useState, useMemo } from 'react';
import uuid from 'react-uuid';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

export default function FilterButton(props) {
    const {
        classes,
        filterButtonText,
        filterDialogTitle,
        filtersObject,
        applyButtonText,
        onApplyFilters,
    } = props;

    const { formContainer } = classes;

    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleClickCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleClickApplyFilters = () => {
        onApplyFilters();
        setOpenDialog(false);
    };

    return (
        <div className={formContainer}>
            <Button onClick={handleClickOpenDialog} variant="contained">
                {filterButtonText}
            </Button>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={openDialog}
                onClose={handleClickCloseDialog}
            >
                <DialogTitle>{filterDialogTitle}</DialogTitle>

                <DialogContent>
                    <form className={formContainer}>
                        {filtersObject.map((obj, index) => (
                            <FilterOption
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${obj.label}_${index}`}
                                classes={{ formControl: classes.formControl }}
                                label={obj.label}
                                currentValue={obj.currentValue}
                                values={obj.values ?? []}
                                setValue={obj.setValue}
                                showEmptyValue={obj.showEmptyValue}
                            />
                        ))}
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClickCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClickApplyFilters} color="primary">
                        {applyButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function FilterOption(props) {
    const {
        classes,
        label, currentValue,
        values, setValue,
        showEmptyValue,
    } = props;

    const { formControl } = classes;

    const emptyValueElemKey = useMemo(() => uuid(), []);

    return (
        <FormControl className={formControl}>
            <InputLabel htmlFor="demo-dialog-native">{label}</InputLabel>
            <Select
                native
                value={currentValue}
                onChange={setValue}
                input={<Input id="demo-dialog-native" />}
            >
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                {showEmptyValue && <option key={emptyValueElemKey} value="" />}
                {/* eslint-disable-next-line react/no-array-index-key */}
                {values.map((v, index) => <option key={`${v}_${index}`} value={v}>{v}</option>)}
            </Select>
        </FormControl>
    );
}

FilterButton.propTypes = {
    classes: PropTypes.object.isRequired,
    filterButtonText: PropTypes.string.isRequired,
    filterDialogTitle: PropTypes.string.isRequired,
    filtersObject: PropTypes.array.isRequired,
    applyButtonText: PropTypes.string.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
};

FilterOption.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string,
    currentValue: PropTypes.string,
    values: PropTypes.array.isRequired,
    setValue: PropTypes.func,
    showEmptyValue: PropTypes.bool,
};

FilterOption.defaultProps = {
    label: '',
    currentValue: '',
    setValue: () => {},
    showEmptyValue: true,
};

import React from 'react';
import uuid from 'react-uuid';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const HEADER_SELECT_COLOR = 'white';
const useStyles = makeStyles(() => ({
    headerSelect: {
        fontSize: '15pt',
        fontWeight: '500',
        color: HEADER_SELECT_COLOR,
        '&:before': {
            borderColor: HEADER_SELECT_COLOR,
        },
        '&:after': {
            borderColor: HEADER_SELECT_COLOR,
        },
        '&:hover:not(.Mui-disabled):before': {
            borderColor: HEADER_SELECT_COLOR,
        },
    },
    headerArrowIcon: {
        fill: HEADER_SELECT_COLOR,
    },
}));

export default function HeaderSelect(props) {
    const selectClasses = useStyles();
    const {
        classes,
        currentValue,
        setValue,
        allValues,
    } = props;

    const onChangeValue = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className={classes.formContainer}>
            <FormControl required className={classes.formControl}>
                <Select
                    className={selectClasses.headerSelect}
                    value={currentValue}
                    onChange={onChangeValue}
                    inputProps={{
                        classes: {
                            icon: selectClasses.headerArrowIcon,
                        },
                    }}
                >
                    {allValues.map((value) => (
                        <MenuItem
                            key={uuid()}
                            value={value}
                        >
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

HeaderSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    currentValue: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    allValues: PropTypes.array.isRequired,
};

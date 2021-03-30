import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';

import {
    DEFAULT_CHOOSE_VALUES,
    DEFAULT_EM_CALL_CHOOSE_VALUES,
} from 'components/constants/opportunities';

const useStyles = makeStyles((theme) => ({
    tableCell: {
        width: 130,
        height: 30,
    },
    input: {
        width: 130,
        height: 30,
    },
}));

export default function CustomTableCell(props) {
    const classes = useStyles();
    const {
        row,
        name,
        isEditMode,
        onChange,
    } = props;
    const { editable } = row;

    return (
        <TableCell align="left" className={classes.tableCell}>
            {isEditMode && editable ? (
                <InputComponent
                    row={row}
                    name={name}
                    onChange={onChange}
                />
            ) : (
                row[name] || <i>No info</i>
            )}
        </TableCell>
    );
}

CustomTableCell.propTypes = {
    row: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

function InputComponent(props) {
    const classes = useStyles();
    const { row, name, onChange } = props;
    const { tableKey } = row;

    switch (tableKey) {
        case 'em':
            return (
                <Input
                    value={row[name]}
                    name={name}
                    onChange={(e) => onChange(e, row)}
                    className={classes.input}
                />
            );
        case 'esd':
            return (
                <Select
                    name={name}
                    value={row[name]}
                    onChange={(e) => onChange(e, row)}
                    input={<Input />}
                >
                    {DEFAULT_CHOOSE_VALUES.map((value) => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                </Select>
            );
        case 'emCall':
            return (
                <Select
                    name={name}
                    value={row[name] || 'No'}
                    onChange={(e) => onChange(e, row)}
                    input={<Input />}
                >
                    {DEFAULT_EM_CALL_CHOOSE_VALUES.map((value) => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                </Select>
            );
        default:
            return (
                <Input
                    value={row[name]}
                    name={name}
                    onChange={(e) => onChange(e, row)}
                    className={classes.input}
                />
            );
    }
}

InputComponent.propTypes = {
    row: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

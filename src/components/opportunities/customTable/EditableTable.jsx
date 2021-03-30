import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {
    TableHeader,
    ButtonsPanel,
    CustomTableCell,
} from 'components/opportunities/customTable/components';
import { mapFilterNameToValue } from 'components/helpers/mapFilters';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        width: '100%',
    },
}));

export default function EditableTable(props) {
    const classes = useStyles();
    const {
        tableName,
        columns,
        currentRows,
        onUpdate,
    } = props;

    const [rows, setRows] = useState(currentRows);
    const [rowEditMode, setRowEditMode] = useState(null);
    const [previousRow, setPreviousRow] = useState(null);
    const [updateProcess, setUpdateProcess] = useState(false);

    const restorePreviousRows = (rowId) => {
        if (!previousRow) {
            return;
        }
        const restoredRows = rows.map((row) => (row.tableKey === rowId
            ? previousRow
            : row));
        setPreviousRow(null);
        setRows(restoredRows);
    };

    useEffect(() => {
        if (rowEditMode && previousRow) {
            restorePreviousRows(previousRow.tableKey);
        }
        setRowEditMode(null);
        setRows(currentRows);
    }, [currentRows]);

    const handleOnClickEdit = (rowId) => {
        if (rowEditMode && previousRow) {
            restorePreviousRows(previousRow.tableKey);
        }
        setRowEditMode(rowId);
    };

    const handleOnClickRevert = (rowId) => {
        restorePreviousRows(rowId);
        setRowEditMode(null);
    };

    const handleOnClickDone = async (rowId) => {
        setUpdateProcess(true);
        const foundRow = rows.find((row) => row.tableKey === rowId);
        if (!foundRow) {
            restorePreviousRows(rowId);
            setUpdateProcess(false);
            return;
        }
        const { updateKey, value } = foundRow;
        const formattedValue = updateKey === 'esd_created'
            ? mapFilterNameToValue(value, false)
            : value;
        try {
            await onUpdate({ updateKey, value: formattedValue });
            setRowEditMode(null);
            setPreviousRow(null);
        } catch (e) {
            restorePreviousRows(rowId);
        }
        setUpdateProcess(false);
    };

    const onChange = (event, row) => {
        if (!previousRow) {
            setPreviousRow(row);
        }
        const { value, name } = event.target;

        const { tableKey } = row;
        const newRows = rows.map((r) => {
            if (r.tableKey === tableKey) {
                return { ...r, [name]: value };
            }
            return r;
        });
        setRows(newRows);
    };

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
                <caption>{tableName}</caption>
                <TableHeader
                    tableName={tableName}
                    columns={columns}
                />
                <TableBody>
                    {rows.map((row) => {
                        const { tableKey, editable } = row;
                        return (
                            <TableRow key={tableKey}>
                                <ButtonsPanel
                                    rowId={tableKey}
                                    isRowEditable={editable}
                                    isEditMode={rowEditMode === tableKey}
                                    updateProcess={updateProcess}
                                    onEdit={handleOnClickEdit}
                                    onDone={handleOnClickDone}
                                    onRevert={handleOnClickRevert}
                                />
                                <CustomTableCell
                                    row={row}
                                    name="name"
                                    isEditMode={false}
                                    onChange={() => {}}
                                />
                                <CustomTableCell
                                    row={row}
                                    name="value"
                                    isEditMode={tableKey === rowEditMode}
                                    onChange={onChange}
                                />
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

EditableTable.propTypes = {
    tableName: PropTypes.string.isRequired,
    columns: PropTypes.array,
    currentRows: PropTypes.array,
    onUpdate: PropTypes.func,
};

EditableTable.defaultProps = {
    columns: [],
    currentRows: [],
    onUpdate: () => {},
};

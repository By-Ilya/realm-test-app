import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { ProjectContext } from 'context/ProjectContext';
import generateTableIcons from 'components/common/helpers/TableIcons';
import { getThisMonth, getNextMonth } from 'helpers/date-util';
import { getCallFromThree } from 'helpers/forecast-util';
import Tooltip from '@material-ui/core/Tooltip';

export default function EditableCellTable(props) {
    const {
        projectId, tableName,
        currentColumns, currentData,
        onUpdate,
        checkboxValue,
        onCheckboxUpdate,
    } = props;

    const { isEditing, setIsEditing } = useContext(ProjectContext);

    const [columns, setColumns] = useState(currentColumns);
    const [data, setData] = useState(currentData);

    useEffect(() => {
        !isEditing && setColumns(currentColumns);
    }, [isEditing, projectId, currentColumns]);

    useEffect(() => {
        !isEditing && setData(currentData);
    }, [isEditing, projectId, currentData]);

    const onClickEditButton = () => setIsEditing(true);

    return (
        <MaterialTable
            title={(
                <TableTitle
                    checkboxValue={checkboxValue}
                    onCheckboxUpdate={onCheckboxUpdate}
                    tableName={tableName}
                />
            )}
            icons={generateTableIcons({ onClickEditButton })}
            columns={columns}
            data={data}
            options={{
                search: false,
                sorting: false,
                paging: false,
                // padding:"dense"
            }}
            cellEditable={{
                isCellEditable: (rowData, columnDef) => // our hacked material table
                    (rowData.tableData.id > 4) &&
                            (columnDef.tableData.columnOrder >= 1) && (columnDef.tableData.columnOrder <= 3),
                onCellEditStarted: (rowData, columnDef) => { // our hacked material table
                    // setIsEditing(true);
                },
                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                    // console.log(rowData)
                    // console.log(columnDef);
                    // console.log(getThisMonth(new Date()));
                    // console.log(getNextMonth(getThisMonth(new Date())));
                    // console.log(getNextMonth(getNextMonth(getThisMonth(new Date()))));
                    let month; let
                        updateKey;
                    switch (columnDef.tableData.columnOrder) {
                        case 1: month = getThisMonth(new Date()); break;
                        case 2: month = getNextMonth(new Date()); break;
                        case 3: month = getNextMonth(getNextMonth(new Date(), false)); break;
                        default: month = null; break;
                    }

                    switch (rowData.tableData.id) {
                        case 5: updateKey = 'risk'; break;
                        case 6: updateKey = 'upside'; break;
                        case 7: updateKey = 'upside_ml'; break;
                        default: updateKey = null; break;
                    }
                    // console.log({month, updateKey, value: parseFloat(newValue)})
                    if (!month || !updateKey) return Promise.reject();

                    let parsedVal = parseFloat(newValue);
                    if (Number.isNaN(parsedVal)) parsedVal = 0;

                    const dataUpdate = [...data];
                    const row = rowData.tableData.id;
                    const column = columnDef.field;
                    dataUpdate[row][column] = parsedVal;
                    if (dataUpdate[row].cq_field) dataUpdate[row].cq_call = getCallFromThree([dataUpdate[row][0], dataUpdate[row][1], dataUpdate[row][2]]);
                    setData([...dataUpdate]);
                    // console.log(data);

                    const promise = onUpdate({ month, updateKey, value: parsedVal });
                    // setIsEditing(false); // will generate a warning but that's ok I guess
                    return promise;
                },
            }}
            // editable={{
            //     isEditable: rowData => rowData.editable,
            //     onRowUpdate: async (newData, oldData) => {
            //         try {
            //             const {tableKey, updateKey} = newData;
            //             await onUpdate({updateKey, value: newData[tableKey]});
            //             const dataUpdate = [...data];
            //             const index = oldData.tableData.id;
            //             dataUpdate[index] = newData;
            //             setData([...dataUpdate]);
            //             setIsEditing(false);
            //         } catch (e) {
            //             console.error(e);
            //             setIsEditing(false);
            //         }
            //     },
            //     onRowUpdateCancelled: () => setIsEditing(false)
            // }}
        />
    );
}

function TableTitle(props) {
    const {checkboxValue, onCheckboxUpdate, tableName} = props;
    return (
        <Box display="flex" alignItems="center">
            <Typography
                variant="h6"
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {tableName}
            </Typography>
            <Tooltip title="Check me to mark your forecast as completed for this month">
                <Checkbox checked={checkboxValue} onChange={onCheckboxUpdate} />
            </Tooltip>
        </Box>
    );
}

EditableCellTable.propTypes = {
    projectId: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    checkboxValue: PropTypes.bool,
    onCheckboxUpdate: PropTypes.func,
};

EditableCellTable.defaultProps = {
    onUpdate: () => console.log('onUpdate'),
    checkboxValue: false,
    onCheckboxUpdate: () => console.log('onCheckboxUpdate'),
};

import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import generateTableIcons from "./helpers/TableIcons";
import {getThisMonth,getNextMonth} from "../../helpers/date-util";
import {RealmContext} from "../../context/RealmContext";
import {getCallFromThree} from "../../helpers/forecast-util";

EditableCellTable.propTypes = {
    projectId: PropTypes.string.isRequired,
    milestoneId: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired,
    onUpdate: PropTypes.func
}

export default function EditableCellTable(props) {
    const {
        projectId, tableName,
        currentColumns, currentData,
        onUpdate
    } = props;

    const {isEditing, setIsEditing} = useContext(RealmContext);

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
            title={tableName}
            icons={generateTableIcons({onClickEditButton})}
            columns={columns}
            data={data}
            options={{
                search:false,
                sorting:false,
                paging:false,
                //padding:"dense"
            }}
            cellEditable={{
                isCellEditable: (rowData, columnDef) => { //our hacked material table
                    return (rowData.tableData.id > 4) && 
                            (columnDef.tableData.columnOrder >= 1) && (columnDef.tableData.columnOrder <= 3);
                },
                onCellEditStarted: (rowData, columnDef) => { //our hacked material table
                    //setIsEditing(true);
                },
                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                    // console.log(rowData)
                    // console.log(columnDef);
                    // console.log(getThisMonth(new Date()));
                    // console.log(getNextMonth(getThisMonth(new Date())));
                    // console.log(getNextMonth(getNextMonth(getThisMonth(new Date()))));
                    var month, updateKey;
                    switch (columnDef.tableData.columnOrder) {
                        case 1: month = getThisMonth(new Date()); break;
                        case 2: month = getNextMonth(new Date()); break;
                        case 3: month = getNextMonth(getNextMonth(new Date(), false)); break;
                    }

                    switch (rowData.tableData.id) {
                        case 5: updateKey = "risk"; break;
                        case 6: updateKey = "upside"; break;
                    }
                    //console.log({month, updateKey, value: parseFloat(newValue)})

                    const dataUpdate = [...data];
                    const row = rowData.tableData.id;
                    const column = columnDef.field;
                    dataUpdate[row][column] = parseFloat(newValue);
                    dataUpdate[row]["cq_call"] = getCallFromThree([dataUpdate[row][0], dataUpdate[row][1], dataUpdate[row][2]]);
                    setData([...dataUpdate]);
                    //console.log(data);

                    var promise = onUpdate({month, updateKey, value: parseFloat(newValue)});

                    //setIsEditing(false); //will generate a warning but that's ok I guess

                    return promise;
                }
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
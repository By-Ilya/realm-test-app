import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import {TABLE_ICONS} from "./helpers/TableIcons";

SimpleTable.propTypes = {
    projectId: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired
}

export default function SimpleTable(props) {
    const {
        projectId, tableName,
        currentColumns, currentData,
        onUpdate
    } = props;

    const [currentProjectId, setCurrentProjectId] = useState(projectId);
    const [columns, setColumns] = useState(currentColumns);
    const [data, setData] = useState(currentData);

    useEffect(() => {
        if (currentProjectId !== projectId) {
            setColumns(currentColumns);
            setCurrentProjectId(projectId);
        }
    }, [projectId, currentColumns])

    useEffect(() => {
        if (currentProjectId !== projectId) {
            setData(currentData);
            setCurrentProjectId(projectId)
        }
    }, [projectId, currentData]);

    return (
        <MaterialTable
            title={tableName}
            icons={TABLE_ICONS}
            columns={columns}
            data={data}
            editable={{
                isEditable: rowData => rowData.editable,
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        const {updateKey, updateTableKey} = newData;
                        onUpdate(
                            newData.updateFuncType,
                            {
                                key: updateKey,
                                value: newData[updateTableKey]
                            }
                        ).then(() => {
                            const dataUpdate = [...data];
                            const index = oldData.tableData.id;
                            dataUpdate[index] = newData;
                            setData([...dataUpdate]);
                            resolve();
                        }).catch(err => {
                            console.error(err);
                            reject();
                        });
                    }),
            }}
        />
    );
}
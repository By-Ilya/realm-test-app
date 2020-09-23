import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import {TABLE_ICONS} from "./helpers/TableIcons";

SimpleTable.propTypes = {
    projectId: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    fetchProjects: PropTypes.func
}

export default function SimpleTable(props) {
    const {
        projectId, tableName,
        currentColumns, currentData,
        onUpdate, fetchProjects
    } = props;

    const [columns, setColumns] = useState(currentColumns);
    const [data, setData] = useState(currentData);
    const [currentProjectId, setCurrentProjectId] = useState(projectId);

    useEffect(() => {
        if (currentProjectId !== projectId) {
            setColumns(currentColumns);
            setCurrentProjectId(projectId);
        }
    }, [projectId, currentColumns]);

    useEffect(() => {
        if (currentProjectId !== projectId) {
            setData(currentData);
            setCurrentProjectId(projectId);
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
                onRowUpdate: async (newData, oldData) => {
                    try {
                        const {tableKey, updateKey} = newData;
                        await onUpdate({updateKey, value: newData[tableKey]});
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setData([...dataUpdate]);
                        fetchProjects({needToClean: false});
                    } catch (e) {
                        console.error(e);
                    }
                }
            }}
        />
    );
}
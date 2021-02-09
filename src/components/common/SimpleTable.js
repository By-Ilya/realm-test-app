import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import {ProjectContext} from "context/ProjectContext";

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
    } = props;

    const {isEditing} = useContext(ProjectContext);

    const [columns, setColumns] = useState(currentColumns);
    const [data, setData] = useState(currentData);

    useEffect(() => {
        !isEditing && setColumns(currentColumns);
    }, [isEditing, projectId, currentColumns]);

    useEffect(() => {
        !isEditing && setData(currentData);
    }, [isEditing, projectId, currentData]);

    return (
        <MaterialTable
            title={tableName}
            columns={columns}
            data={data}
            options={{
                search: false,
                sorting: false,
                paging: false,
                padding: "dense"
            }}
        />
    );
}
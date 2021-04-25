import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import generateTableIcons from 'components/common/helpers/TableIcons';
import { ProjectContext } from 'context/ProjectContext';

const BSON = require('bson');

export default function DocumentsTable(props) {
    const {
        projectId, tableName,
        currentColumns, currentData,
        onUpdate,
        onAdd,
        onDelete,
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
            title={tableName}
            icons={generateTableIcons({ onClickEditButton })}
            columns={columns}
            data={data}
            options={{
                search: false,
                sorting: false,
                paging: false,
                padding: 'dense',
            }}
            editable={{
                isEditable: (rowData) => rowData.editable,
                isDeletable: (rowData) => rowData.editable,
                onRowUpdate: async (newData, oldData) => {
                    try {
                        const isVirtual = !newData._id;
                        if (isVirtual) newData._id = new BSON.ObjectID().toString();
                        await onUpdate({ doc: newData, isVirtual });
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setData([...dataUpdate]);
                        setIsEditing(false);
                    } catch (e) {
                        console.error(e);
                        setIsEditing(false);
                    }
                },
                onRowUpdateCancelled: () => setIsEditing(false),
                onRowAdd: async (newData) => {
                    try {
                        newData._id = new BSON.ObjectID().toString();
                        await onAdd({ doc: newData });
                        newData.editable = true;
                        setData([...data, newData]);
                    } catch (e) {
                        console.error(e);
                    }
                },
                onRowDelete: async (oldData) => {
                    if (oldData.name === 'Report') return;
                    try {
                        await onDelete({ doc: oldData });
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setData([...dataDelete]);
                    } catch (e) {
                        console.error(e);
                    }
                },
            }}
        />
    );
}

DocumentsTable.propTypes = {
    projectId: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
};

DocumentsTable.defaultProps = {
    onUpdate: () => console.log('onUpdate'),
    onAdd: () => console.log('onAdd'),
    onDelete: () => console.log('onDelete'),
};

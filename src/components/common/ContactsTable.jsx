import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import generateTableIcons from 'components/common/helpers/TableIcons';
import { ProjectContext } from 'context/ProjectContext';

const BSON = require('bson');

export default function ContactsTable(props) {
    const {
        project,
        projectId, tableName,
        currentColumns, currentData,
        onUpdate, onAdd, onDelete
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
                isDeletable: (rowData) => rowData.editable && rowData._id,
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
                        newData.type = "Customer";
                        await onAdd({ doc: newData });
                        newData.editable = true;
                        setData([...data, newData]);
                    } catch (e) {
                        console.error(e);
                    }
                },
                onRowDelete: async (oldData) => {
                    try {
                        await onDelete({ doc: oldData });
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        if (oldData.type === 'Customer (Primary)' && project.primary_customer_contact) {
                            dataDelete.unshift({
                                type: 'Customer (Primary)',
                                name: project.primary_customer_contact.name,
                                email: project.primary_customer_contact.email,
                                editable: true
                            })
                        }
                        setData([...dataDelete]);
                    } catch (e) {
                        console.error(e);
                    }
                },
            }}
        />
    );
}

ContactsTable.propTypes = {
    projectId: PropTypes.string.isRequired,
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
};

ContactsTable.defaultProps = {
    onUpdate: () => console.log('onUpdate'),
};

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

import {TABLE_ICONS} from "./helpers/TableIcons";

SimpleTable.propTypes = {
    tableName: PropTypes.string.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentData: PropTypes.array.isRequired
}

export default function SimpleTable(props) {
    const {
        tableName,
        currentColumns, currentData,
        onUpdate
    } = props;

    const [columns, setColumns] = useState(currentColumns);
    const [data, setData] = useState(currentData);

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
                        onUpdate({[newData.updateKey]: newData.value}).then(() => {
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
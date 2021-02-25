import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import {
    generateEmTableData,
} from 'components/opportunities/tableData';

export default function EMTable(props) {
    const { em } = props;

    const {
        emTableColumns,
        emTableRows,
    } = generateEmTableData(em);

    return (
        <MaterialTable
            title="EM Fields Values"
            columns={emTableColumns}
            data={emTableRows}
            options={{
                search: false,
                sorting: false,
                paging: false,
                padding: 'dense',
            }}
        />
    );
}

EMTable.propTypes = {
    em: PropTypes.object.isRequired,
};

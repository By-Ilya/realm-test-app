import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AuthContext } from 'context/AuthContext';
import { OpportunityContext } from 'context/OpportunityContext';
import EditableTable from 'components/opportunities/customTable/EditableTable';

import { generateEmTableData } from 'components/opportunities/tableData';

export default function EMTable(props) {
    const { opportunityId, em } = props;

    const { opportunityCollection } = useContext(AuthContext);
    const {
        updateLocalEmInfo,
        fetchFiltersDefaultValues,
    } = useContext(OpportunityContext);

    const {
        emTableColumns,
        emTableRows,
    } = generateEmTableData(em);

    const handleUpdateEmRow = async ({ updateKey, value }) => {
        const query = { _id: opportunityId };
        const update = {
            $set: { [`em.${updateKey}`]: value },
        };
        const options = { upsert: false };
        await opportunityCollection.updateOne(query, update, options);
        await updateLocalEmInfo(opportunityId, { updateKey, value });
        fetchFiltersDefaultValues();
    };

    return (
        <EditableTable
            tableName="EM Fields"
            columns={emTableColumns}
            currentRows={emTableRows}
            onUpdate={handleUpdateEmRow}
        />
    );
}

EMTable.propTypes = {
    opportunityId: PropTypes.string.isRequired,
    em: PropTypes.object.isRequired,
};

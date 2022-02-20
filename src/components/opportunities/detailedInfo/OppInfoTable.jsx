import React from 'react';
import PropTypes from 'prop-types';

import EditableTable from 'components/opportunities/customTable/EditableTable';

import { generateOppInfoTableData } from 'components/opportunities/tableData';

export default function OppInfoTable(props) {
    const { opportunity } = props;

    //const { opportunityCollection } = useContext(AuthContext);
    // const {
    //     updateLocalEmInfo,
    //     fetchFiltersDefaultValues,
    // } = useContext(OpportunityContext);

    const {
        oppInfoTableColumns,
        oppInfoTableRows,
    } = generateOppInfoTableData(opportunity);

    const handleUpdateOppInfoRow = async ({ updateKey, value }) => {
        // const query = { _id: opportunityId };
        // const update = {
        //     $set: { [`em.${updateKey}`]: value },
        // };
        // const options = { upsert: false };
        // await opportunityCollection.updateOne(query, update, options);
        // await updateLocalEmInfo(opportunityId, { updateKey, value });
        // fetchFiltersDefaultValues();
    };

    return (
        <EditableTable
            tableName="Opportunity Fields"
            columns={oppInfoTableColumns}
            currentRows={oppInfoTableRows}
            onUpdate={handleUpdateOppInfoRow}
        />
    );
}

OppInfoTable.propTypes = {
    opportunity: PropTypes.object.isRequired,
};

import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import SimpleTable from "../common/SimpleTable";
import {
    generateMilestoneTableData,
    generateScheduleTableData
} from "../common/helpers/generateTablesData";
import {RealmContext} from "../../context/RealmContext";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
};

export default function MilestonesInfo(props) {
    const {classes, project} = props;
    const {user} = useContext(RealmContext);

    console.log('user:', user);

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = generateMilestoneTableData(project);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = generateScheduleTableData(project);

    const handleUpdateRowsResolver = async ({funcType, value}) => {
        console.log(funcType, value);
        if (funcType === 'pmStage') {
            return await user.functions.changePmStage({
                projectId: project._id,
                pmStage: value
            });
        }

        return null;
    }

    return (<>
        {milestonesTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                projectId={project._id}
                tableName='Project milestone info'
                currentColumns={milestonesTableColumns}
                currentData={milestonesTableRows}
                onUpdate={handleUpdateRowsResolver}
            />
        </div>}
        {scheduleTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                projectId={project._id}
                tableName='Schedule'
                currentColumns={scheduleTableColumns}
                currentData={scheduleTableRows}
            />
        </div>}
    </>)
}
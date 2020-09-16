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
    project: PropTypes.object.isRequired,
    fetchProjects: PropTypes.func
};

export default function MilestonesInfo(props) {
    const {classes, project, fetchProjects} = props;
    const {dbCollection} = useContext(RealmContext);

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = generateMilestoneTableData(project);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = generateScheduleTableData(project);

    const handleUpdateRowsResolver = async ({funcType, value}) => {
        if (funcType === 'pmStage') {
            const query = {_id: project._id};
            const update = {'$set': {'details.pm_stage': value}};
            const options = {'upsert': false};

            return await dbCollection.updateOne(query, update, options);
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
                fetchProjects={fetchProjects}
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
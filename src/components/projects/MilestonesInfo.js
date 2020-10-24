import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import SimpleTable from "../common/SimpleTable";
import EditableCellTable from "../common/EditableCellTable";
import {
    generateMilestoneTableData,
    generateScheduleTableData,
    generateForecastTableData
} from "../common/helpers/generateTablesData";
import {RealmContext} from "../../context/RealmContext";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};

export default function MilestonesInfo(props) {
    const {classes, project} = props;
    const {dbCollection} = useContext(RealmContext);

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = generateMilestoneTableData(project);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = generateScheduleTableData(project);

    const {
        forecastTableColumns,
        forecastTableRows
    } = generateForecastTableData(project);

    const handleUpdateRow = async ({updateKey, value}) => {
        const query = {_id: project._id};
        const update = {'$set': {[updateKey]: value}};
        const options = {'upsert': false};
        await dbCollection.updateOne(query, update, options);
    }

    return (<>
        {milestonesTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                projectId={project._id}
                tableName='Project milestone info'
                currentColumns={milestonesTableColumns}
                currentData={milestonesTableRows}
                onUpdate={handleUpdateRow}
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
        {forecastTableRows.length !== 0 && <div className={classes.tableContainer}>
            <EditableCellTable
                projectId={project._id}
                milestoneId={project.currentMilestone._id}
                tableName='Forecast'
                currentColumns={forecastTableColumns}
                currentData={forecastTableRows}
            />
        </div>}
    </>)
}
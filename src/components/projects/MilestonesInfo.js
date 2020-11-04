import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import SimpleTable from "../common/SimpleTable";
import SimpleETable from "../common/SimpleETable";
import EditableCellTable from "../common/EditableCellTable";
import ContactsTable from "../common/ContactsTable";
import {
    generateMilestoneTableData,
    generateScheduleTableData,
    generateForecastTableData,
    generateContactsTableData,
} from "../common/helpers/generateTablesData";
import {RealmContext} from "../../context/RealmContext";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};

export default function MilestonesInfo(props) {
    const {classes, project} = props;
    const {dbCollection, fcstCollection} = useContext(RealmContext);

    const onClickPMStageButton = async (project) => {
        await dbCollection.updateOne({_id: project._id},{$set:{survey_sent:true, survey_sent_ts: new Date()}})
    }

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = generateMilestoneTableData(project, onClickPMStageButton);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = generateScheduleTableData(project);

    const {
        forecastTableColumns,
        forecastTableRows
    } = generateForecastTableData(project);

    const {
        contactsTableColumns,
        contactsTableRows
    } = generateContactsTableData(project);

    const handleUpdateRow = async ({updateKey, value}) => {
        const query = {_id: project._id};
        const update = {'$set': {[updateKey]: value}};
        const options = {'upsert': false};
        await dbCollection.updateOne(query, update, options);
    }

    const handleUpdateForecast = async ({month, updateKey, value}) => {
        const query = {milestoneId: project.currentMilestone._id, "month": month};
        const update = {'$set': {[updateKey]: value}};
        const options = {'upsert': true};
        await fcstCollection.updateOne(query, update, options);
    }

    return (<>
        {milestonesTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleETable
                projectId={project._id}
                tableName='Project milestone info'
                currentColumns={milestonesTableColumns}
                currentData={milestonesTableRows}
                onUpdate={handleUpdateRow}
            />
        </div>}
        {<div className={classes.tableContainer}>
            <ContactsTable
                projectId={project._id}
                tableName='Contact Information'
                currentColumns={contactsTableColumns}
                currentData={contactsTableRows}
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
                onUpdate={handleUpdateForecast}
            />
        </div>}
    </>)
}
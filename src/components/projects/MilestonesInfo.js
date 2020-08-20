import React, {useState, useEffect} from 'react';
import {useMutation} from "@apollo/client";
import PropTypes from 'prop-types';

import SimpleTable from "../common/SimpleTable";
import {toEnUsDate} from "../../helpers/dateFormatter";
import {UPDATE_PROJECT} from "../../graphql/graphql-operations";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
};

export default function MilestonesInfo(props) {
    const {classes, project} = props;

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = createMilestoneTableData(project);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = createScheduleTableData(project);

    const {pm_stage, pm_project_status, product_end_date} = project.details;
    const [localProjectDetails, setLocalProjectDetails] = useState({
        pm_stage, pm_project_status, product_end_date
    });
    const [updateProject] = useMutation(
        UPDATE_PROJECT,
        {
            variables: {
                query: {_id: project._id},
                set: {details: localProjectDetails}
            }
        }
    );
    useEffect(() => {
        updateProject();
    },[localProjectDetails]);

    const handleUpdateDetails = async (newDetailsObject) => {
        setLocalProjectDetails({...localProjectDetails, ...newDetailsObject});
    };

    return (<>
        {milestonesTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                tableName='Milestone info'
                currentColumns={milestonesTableColumns}
                currentData={milestonesTableRows}
                onUpdate={handleUpdateDetails}
            />
        </div>}
        {scheduleTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                tableName='Schedule'
                currentColumns={scheduleTableColumns}
                currentData={scheduleTableRows}
            />
        </div>}
    </>)
}

function createMilestoneTableData(project) {
    if (!project) return {
        milestonesTableColumns: [],
        milestonesTableRows: []
    };

    const {
        owner, region,
        project_manager,
        account, name,
        opportunity, details,
        currentMilestone
    } = project;

    const milestonesTableColumns = [
        {title: 'Projects / Milestones Fields', field: 'name', editable: 'never'},
        {title: 'Value', field: 'value', editable: 'onUpdate'}
    ];
    const milestonesTableRows = [
        {name: 'Project Owner', value: owner, editable: false},
        {name: 'Region', value: region, editable: false},
        {name: 'Project Manager', value: project_manager, editable: false},
        {name: 'PM Stage', value: details.pm_stage, editable: true, updateKey: 'pm_stage'},
        {name: 'Account', value: account, editable: false},
        {name: 'Opportunity', value: opportunity.name, editable: false},
        {name: 'PS Project Name', value: name, editable: false},
        {name: 'Milestone Name', value: currentMilestone.name, editable: false},
        {name: 'Country', value: currentMilestone.country, editable: false},
        {name: 'Milestone amount', value: currentMilestone.base.milestone_amount, editable: false},
        {name: 'Gap Hours', value: currentMilestone.base.gap_hours, editable: false}
    ]

    return {milestonesTableColumns, milestonesTableRows}
}

function createScheduleTableData(project) {
    if (!project) return {
        scheduleTableColumns: [],
        scheduleTableRows: []
    };

    const {currentMilestone} = project;

    const scheduleTableColumns = [
        {title: 'Date', field: 'date', editable: 'never'},
        {title: 'Scheduled', field: 'scheduled', editable: 'never'},
        {title: 'Hours', field: 'hours', editable: 'never'}
    ];
    const scheduleTableRows = currentMilestone.schedule.map(s => {
        return {
            date: toEnUsDate(s.week),
            scheduled: s.revenue ? `$ ${s.revenue}` : '-',
            hours: s.hours ? s.hours : '-',
            editable: false
        };
    });

    return {scheduleTableColumns, scheduleTableRows}
}
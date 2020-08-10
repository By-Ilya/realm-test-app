import React, {useContext} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import {RealmContext} from "../../context/RealmContext";
import SimpleTable from "../common/SimpleTable";
import {toEnUsDate} from "../../helpers/dateFormatter";

const useStyles = makeStyles({
    tableContainer: {
        marginTop: '20px'
    },
    table: {
        minWidth: 500,
    },
});

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired
};

export default function MilestonesInfo(props) {
    const tableClasses = useStyles();
    const {classes} = props;
    const {projectWithCurrentMilestone} = useContext(RealmContext);

    const milestoneTableHeader = ['Projects / Milestones Fields', 'Value'];
    const milestoneTableData = createMilestoneTableData(projectWithCurrentMilestone);

    const scheduleTableHeader = ['Date', 'Scheduled', 'Hours'];
    const scheduleTableData = createScheduleTableData(projectWithCurrentMilestone);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Milestones overview
                    </Typography>
                    <Divider />
                    {milestoneTableData.length !== 0 && <div className={tableClasses.tableContainer}>
                        <SimpleTable
                            classes={{table: classes.table}}
                            header={milestoneTableHeader}
                            rows={milestoneTableData}
                        />
                    </div>}
                    {scheduleTableData.length !== 0 && <div className={tableClasses.tableContainer}>
                        <SimpleTable
                            classes={{table: classes.table}}
                            header={scheduleTableHeader}
                            rows={scheduleTableData}
                        />
                    </div>}

                    {milestoneTableData.length === 0 && <div className={tableClasses.tableContainer}>
                        <Typography variant="body1">
                            Click on project milestone to see an overview...
                        </Typography>
                    </div>}
                </Paper>
            </Grid>
        </Grid>
    )
}

function createMilestoneTableData(project) {
    if (!project) return [];

    const {
        owner, region,
        project_manager,
        account, name,
        opportunity, details,
        currentMilestone
    } = project;

    return [
        ['Project Owner', owner],
        ['Region', region],
        ['Project Manager', project_manager],
        ['PM Stage', details.pm_stage],
        ['Account', account],
        ['Opportunity', opportunity.name],
        ['PS Project Name', name],
        ['Milestone Name', currentMilestone.name],
        ['Country', currentMilestone.country],
        ['Milestone amount', currentMilestone.base.milestone_amount],
        ['Gap Hours', currentMilestone.base.gap_hours]
    ];
}

function createScheduleTableData(project) {
    if (!project) return [];

    const {currentMilestone} = project;

    return currentMilestone.schedule.map(s => {
        return [toEnUsDate(s.week), s.revenue ? `$ ${s.revenue}` : '-', s.hours ? s.hours : '-'];
    });
}
import React, {useContext} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import {RealmContext} from "../../context/RealmContext";
import SimpleTable from "../common/SimpleTable";

const useStyles = makeStyles({
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

    const createTableData = () => {
        if (!projectWithCurrentMilestone) return [];

        const {
            owner, region,
            project_manager,
            account, name,
            opportunity, details,
            currentMilestone
        } = projectWithCurrentMilestone;

        console.log(projectWithCurrentMilestone);

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

    const tableHeader = ['Projects / Milestones Fields', 'Value'];
    const tableData = createTableData();

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Milestones overview
                    </Typography>
                    <Divider />
                    <br />
                    {tableData.length !== 0 && <SimpleTable
                        classes={tableClasses}
                        header={tableHeader}
                        rows={tableData}
                    />}
                </Paper>
            </Grid>
        </Grid>
    )
}
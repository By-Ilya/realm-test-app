import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import {RealmContext} from "../../context/RealmContext";
import MilestonesInfo from "./MilestonesInfo";

const useStyles = makeStyles({
    tableContainer: {
        marginTop: '20px'
    }
});

MilestonesInfoPaper.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchProjects: PropTypes.func
};

export default function MilestonesInfoPaper(props) {
    const containerClasses = useStyles();
    const {classes, fetchProjects} = props;
    const {projectWithCurrentMilestone} = useContext(RealmContext);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Milestones overview
                    </Typography>
                    <Divider />

                    {!projectWithCurrentMilestone && <div className={containerClasses.tableContainer}>
                        <Typography variant="body1">
                            Click on project milestone to see an overview...
                        </Typography>
                    </div>}

                    {projectWithCurrentMilestone && <MilestonesInfo
                        classes={containerClasses}
                        project={projectWithCurrentMilestone}
                        fetchProjects={fetchProjects}
                    />}
                </Paper>
            </Grid>
        </Grid>
    )
}
import React from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired
};

export default function MilestonesInfo(props) {
    const {classes} = props;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Milestones
                    </Typography>
                    <Divider />
                </Paper>
            </Grid>
        </Grid>
    )
}
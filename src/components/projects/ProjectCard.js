import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import {RealmContext} from "../../context/RealmContext";
import {toDateOnly} from "../../helpers/dateFormatter";

const useStyles = makeStyles({
    root: {
        width: '55vh',
        marginBottom: 5
    },
    info: {
        display: 'inline-block',
        width: '100%'
    },
    leftInfo: {
        float: 'left'
    },
    rightInfo: {
        float: 'right'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

ProjectCard.propTypes = {
    psproject: PropTypes.object.isRequired
};

export default function ProjectCard(props) {
    const classes = useStyles();

    const {psproject} = props;
    const {user, setProjectWithCurrentMilestone, dbCollection} = useContext(RealmContext);

    const handleOnClickMilestone = async (milestone) => {
        var schedule = await user.functions.getMilestoneScheduleOnwards(milestone._id);
        var forecast = await user.functions.getMilestoneForecast(milestone._id);
        ///HACK GRAPHQL BUG
        var proj = await dbCollection.findOne({"milestones._id" : milestone._id});
        var ms_real = proj.milestones.filter(ms => {
          return ms._id === milestone._id
        })[0]
        //console.log(ms_real)
        ///
        setProjectWithCurrentMilestone({
            // projectId: psproject._id,
            // milestoneId: milestone._id
            project: psproject,
            milestone: {...ms_real, schedule},
            forecast: forecast
        });
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.info}>
                    <div className={classes.leftInfo}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {psproject.account}
                        </Typography>
                    </div>
                    <div className={classes.rightInfo}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {psproject.region}
                        </Typography>
                    </div>
                </div>

                <Typography variant="h5" component="h2">
                    {psproject.name}
                </Typography>

                <div className={classes.info}>
                    <div className={classes.leftInfo}>
                        <Typography className={classes.pos} color="textSecondary" gutterBottom>
                            Owner: {psproject.owner}
                        </Typography>
                    </div>
                    <div className={classes.rightInfo}>
                        <Typography className={classes.pos} color="textSecondary" gutterBottom>
                            PM: {psproject.project_manager}
                        </Typography>
                    </div>
                </div>

                <Typography variant="body2" component="p">
                    <b>Stage:</b> {psproject.details.pm_stage}
                </Typography>
                <Typography variant="body2" component="p">
                    <b>Status:</b> {psproject.details.pm_project_status}
                </Typography>
                <Typography variant="body2" component="p">
                    <b>Expires:</b> {toDateOnly(psproject.details.product_end_date)}
                </Typography>
                <Divider />

                <MilestonesList
                    milestones={psproject.milestones}
                    onClickMilestone={handleOnClickMilestone}
                />
            </CardContent>
        </Card>
    );
}

function MilestonesList(props) {
    const {milestones, onClickMilestone} = props;

    return (
        <List subheader={<li />}>
            <ListSubheader>Milestones</ListSubheader>
            {milestones && milestones.map(milestone => {
                return (
                    <ListItem button onClick={() => onClickMilestone(milestone)} key={milestone._id}>
                        <ListItemText primary={milestone.name} />
                    </ListItem>
                )
            })}
        </List>
    )
}
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
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from "@material-ui/core/Box";

import {RealmContext} from "../../context/RealmContext";
import {toDateOnly} from "../../helpers/dateFormatter";
import {setUtcZeroTime} from "../../helpers/date-util";

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

        setProjectWithCurrentMilestone({
            project: psproject,
            milestone: {...milestone, schedule},
            forecast: forecast
        });
    }

    const generateNextAssignmentDateString = (future_assignments_dates) => {
        const empty_string = '-';

        if (!future_assignments_dates || (future_assignments_dates.length < 1))
            return empty_string;

        let todayUtc = new Date();
        setUtcZeroTime(todayUtc);

        //since the array is sorted by (e), we can quickly check if there's nothing in future
        let max_e = new Date(future_assignments_dates[future_assignments_dates.length - 1].e);

        if (max_e.getTime() <= todayUtc.getTime())
            return empty_string;

        //we need to check all ranges that have (e) > today and find the min (s)
        let tomorrowUtc = new Date(todayUtc)
        tomorrowUtc.setDate(tomorrowUtc.getDate() + 1);

        let min_s = max_e; 
        future_assignments_dates.forEach( ass => {
            let end = new Date(ass.e)
            let start = new Date(ass.s)
            if (end.getTime() > todayUtc.getTime()) {
                if (min_s.getTime() > start.getTime() )
                    min_s = start;
            }
        })

        if (min_s.getTime() > tomorrowUtc.getTime())
            return toDateOnly(min_s);
        else
            return toDateOnly(tomorrowUtc);
    }

    return (
        <Card className={classes.root}>
            <LinearProgress variant="buffer" 
                value={100*(1-psproject.summary.gap_hours/psproject.summary.planned_hours)} 
                valueBuffer={100*(1-psproject.summary.backlog_hours/psproject.summary.planned_hours)} />
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
                    <b>Next Assignment:</b> {generateNextAssignmentDateString(psproject.future_assignments_dates)}
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
                          <Box
                            textAlign="left"
                            style={{ paddingRight: 5 }}
                          >
                            {milestone.name} 
                          </Box>
                        <ListItemText secondaryTypographyProps={{ align: "right" }}
                        secondary={`${Math.round(100*milestone.summary.delivered_hours/milestone.summary.planned_hours)}%`} />
                    </ListItem>
                )
            })}
        </List>
    )
}
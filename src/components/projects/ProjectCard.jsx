import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import { AuthContext } from 'context/AuthContext';
import { ProjectContext } from 'context/ProjectContext';
import { toDateOnly } from 'helpers/dateFormatter';
import { setUtcZeroTime } from 'helpers/date-util';

const useStyles = makeStyles({
    root: {
        width: '55vh',
        marginBottom: 5,
    },
    info: {
        display: 'inline-block',
        width: '100%',
    },
    leftInfo: {
        float: 'left',
    },
    rightInfo: {
        float: 'right',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function ProjectCard(props) {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const {
        setProjectWithCurrentMilestone,
    } = useContext(ProjectContext);

    const { psproject } = props;
    const { summary } = psproject;

    const handleOnClickMilestone = async (milestone) => {
        const schedule = await user.functions.getMilestoneScheduleOnwards(milestone._id);
        const forecast = await user.functions.getMilestoneForecast(milestone._id);

        setProjectWithCurrentMilestone({
            project: psproject,
            milestone: { ...milestone, schedule },
            forecast,
        });
    };

    const generateNextAssignmentDateString = (futureAssignmentsDates) => {
        const emptyString = '-';

        if (!futureAssignmentsDates || (futureAssignmentsDates.length < 1)) return emptyString;

        const todayUtc = new Date();
        setUtcZeroTime(todayUtc);

        // since the array is sorted by (e), we can quickly check if there's nothing in future
        const lastDateIndex = futureAssignmentsDates.length - 1;
        const maxE = new Date(futureAssignmentsDates[lastDateIndex].e);

        if (maxE.getTime() <= todayUtc.getTime()) return emptyString;

        // we need to check all ranges that have (e) > today and find the min (s)
        const tomorrowUtc = new Date(todayUtc);
        tomorrowUtc.setDate(tomorrowUtc.getDate() + 1);

        let minS = maxE;
        futureAssignmentsDates.forEach((ass) => {
            const end = new Date(ass.e);
            const start = new Date(ass.s);
            if (
                end.getTime() > todayUtc.getTime() &&
                minS.getTime() > start.getTime()
            ) {
                minS = start;
            }
        });

        return minS.getTime() > tomorrowUtc.getTime()
            ? toDateOnly(minS)
            : toDateOnly(tomorrowUtc);
    };

    const calculateProgress = (currentValue, purposeValue) => 100 * (1 - currentValue / purposeValue);

    return (
        <Card className={classes.root}>
            <LinearProgress
                variant="buffer"
                value={calculateProgress(summary.gap_hours, summary.planned_hours)}
                valueBuffer={calculateProgress(summary.backlog_hours, summary.planned_hours)}
            />
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
                    {psproject.custom_name ? psproject.custom_name : psproject.name}
                </Typography>

                <div className={classes.info}>
                    <div className={classes.leftInfo}>
                        <Typography className={classes.pos} color="textSecondary" gutterBottom>
                            Owner:
                            {' '}
                            {psproject.owner}
                        </Typography>
                    </div>
                    <div className={classes.rightInfo}>
                        <Typography className={classes.pos} color="textSecondary" gutterBottom>
                            PM:
                            {' '}
                            {psproject.project_manager}
                        </Typography>
                    </div>
                </div>

                <Typography variant="body2" component="p">
                    <b>Stage:</b>
                    {' '}
                    {psproject.details.pm_stage}
                </Typography>
                <Typography variant="body2" component="p">
                    <b>Next Assignment:</b>
                    {' '}
                    {generateNextAssignmentDateString(psproject.future_assignments_dates)}
                </Typography>
                <Typography variant="body2" component="p">
                    <b>Expires:</b>
                    {' '}
                    {toDateOnly(psproject.details.product_end_date)}
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
    const { milestones, onClickMilestone } = props;

    const calculateSecondary = (delivered, planned) => Math.round((100 * delivered) / planned);

    return (
        <List subheader={<li />}>
            <ListSubheader>Milestones</ListSubheader>
            {milestones && milestones.map((milestone) => (
                <ListItem button onClick={() => onClickMilestone(milestone)} key={milestone._id}>
                    <Box
                        textAlign="left"
                        style={{ paddingRight: 5 }}
                    >
                        {milestone.custom_name ? milestone.custom_name : milestone.name}
                    </Box>
                    <ListItemText
                        secondaryTypographyProps={{ align: 'right' }}
                        secondary={
                            `${calculateSecondary(
                                milestone.summary.delivered_hours,
                                milestone.summary.planned_hours,
                            )
                            }%`
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}

ProjectCard.propTypes = {
    psproject: PropTypes.object.isRequired,
};

MilestonesList.propTypes = {
    milestones: PropTypes.array,
    onClickMilestone: PropTypes.func.isRequired,
};

MilestonesList.defaultProps = {
    milestones: [],
};

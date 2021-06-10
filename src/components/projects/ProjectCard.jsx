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
    const { user, ceMode } = useContext(AuthContext);
    const {
        setProjectWithCurrentMilestone,
    } = useContext(ProjectContext);

    const { psproject } = props;
    const { summary } = psproject;

    const handleOnClickMilestone = async (milestone) => {
        const promise_s = user.functions.getMilestoneScheduleOnwards(milestone._id);
        const promise_f = user.functions.getMilestoneForecast(milestone._id);
        const promise_c = user.functions.getRelatedSupportCases({account_id: psproject.account_id});

        const data = await Promise.all([promise_s, promise_f, promise_c])

        const schedule = data[0];
        const forecast = data[1];
        const cases = data[2];

        setProjectWithCurrentMilestone({
            project: psproject,
            milestone: { ...milestone, schedule },
            forecast,
            cases
        });
    };

    const generateNextAssignmentDateString = (_futureAssignmentsDates, resource_email_filter) => {
        const emptyString = '-';

        if (!_futureAssignmentsDates) return emptyString;

        const futureAssignmentsDates = resource_email_filter ? _futureAssignmentsDates.filter(ass => {
          return ass.resource_email === resource_email_filter
        }) : _futureAssignmentsDates;

        if (futureAssignmentsDates.length < 1) return emptyString;

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

        return toDateOnly(minS);
    };

    const calculateProgress = (currentValue, purposeValue) => 100 * (1 - currentValue / purposeValue);

    return (
        <Card className={classes.root}>
            <LinearProgress
                variant="buffer"
                value={calculateProgress(summary.gap_hours, summary.planned_hours)}
                valueBuffer={calculateProgress((summary.backlog_hours_fixed >= 0) ? summary.backlog_hours_fixed: summary.backlog_hours, summary.planned_hours)}
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
                    <b>Next Assignment Week:</b>
                    {' '}
                    {generateNextAssignmentDateString(psproject.future_assignments_dates, ceMode ? user.profile.email : null)}
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

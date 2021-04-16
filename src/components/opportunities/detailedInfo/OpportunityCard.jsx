import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { toDateOnly } from 'helpers/dateFormatter';

const useStyles = makeStyles((theme) => ({
    card: {
        width: '100%',
    },
    info: {
        display: 'inline-block',
        width: '100%',
        justifyContent: 'flex-start',
    },
    leftInfo: {
        float: 'left',
        textAlign: 'left',
        width: '50%',
    },
    rightInfo: {
        float: 'right',
        textAlign: 'right',
        width: '50%',
    },
    title: {
        fontSize: 14,
    },
}));

export default function OpportunityCard(props) {
    const classes = useStyles();
    const { opportunity } = props;
    const {
        account,
        owner,
        name,
        type,
        stage,
        ps_region,
        close_date,
        amount,
        services_post_carve,
        em,
    } = opportunity;
    const { engagement_manager } = em;

    return (
        <Card className={classes.card}>
            <CardContent>
                <TopInfo
                    account={account.name}
                    owner={owner}
                />
                <Typography
                    variant="h5"
                    component="h2"
                >
                    {name}
                </Typography>
                <Details
                    owner={owner}
                    type={type}
                    stage={stage}
                    psRegion={ps_region}
                    closeDate={toDateOnly(close_date)}
                    amount={amount}
                    services={services_post_carve}
                    engagementManager={engagement_manager}
                />
            </CardContent>
        </Card>
    );
}

OpportunityCard.propTypes = {
    opportunity: PropTypes.object.isRequired,
};

function TopInfo(props) {
    const classes = useStyles();
    const { account, owner } = props;
    return (
        <div className={classes.info}>
            <div className={classes.leftInfo}>
                <CommonText text={account} />
            </div>

            <div className={classes.rightInfo}>
                <CommonText text={owner} />
            </div>
        </div>
    );
}

TopInfo.propTypes = {
    account: PropTypes.string,
    owner: PropTypes.string,
};

TopInfo.defaultProps = {
    account: 'Account',
    owner: 'Owner',
};

function Details(props) {
    const classes = useStyles();
    const {
        owner,
        type,
        stage,
        closeDate,
        amount,
        engagementManager,
        psRegion,
        services,
    } = props;
    return (
        <Grid container className={classes.innerContainer} spacing={2}>
            <Grid item={2} className={classes.leftInfo}>
                <CommonText text={`Owner: ${owner}`} />
                <CommonText text={`Type: ${type || ''}`} />
                <CommonText text={`Stage: ${stage}`} />
                <CommonText text={`Closes: ${closeDate}`} />
                <CommonText text={`Amount: ${amount}`} />
            </Grid>

            <Grid item={2} className={classes.rightInfo}>
                <CommonText text={`EM: ${engagementManager}`} />
                <CommonText text={`PS region: ${psRegion}`} />
                <CommonText text={`Services: ${services}`} />
            </Grid>
        </Grid>
    );
}

Details.propTypes = {
    owner: PropTypes.string,
    type: PropTypes.string,
    stage: PropTypes.string,
    closeDate: PropTypes.string,
    amount: PropTypes.number,
    engagementManager: PropTypes.string,
    psRegion: PropTypes.string,
    services: PropTypes.number,
};

Details.defaultProps = {
    owner: 'Owner',
    type: 'type',
    stage: 'Stage',
    closeDate: 'MM-DD-YYYY',
    amount: 0,
    engagementManager: 'Engagement manager',
    psRegion: 'PS region',
    services: 0,
};

function CommonText(props) {
    const classes = useStyles();
    const { text } = props;
    return (
        <Typography
            className={classes.title}
            color="textSecondary"
        >
            {text}
        </Typography>
    );
}

CommonText.propTypes = {
    text: PropTypes.string,
};

CommonText.defaultProps = {
    text: '',
};

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ChooseButton from 'components/common/ChooseButton';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: '0.5rem',
    },
    leftContent: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rightContent: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

export default function OpportunitiesHeader(props) {
    const classes = useStyles();
    const {
        opportunityColumns,
        hiddenColumns,
        onHideColumns,
        totalCountOpportunities,
        countOpportunities,
        amountTotal,
        servicesTotal,
    } = props;

    return (
        <Grid container spacing={3} className={classes.root}>
            <Grid item xs={6} sm={3} className={classes.leftContent}>
                <Typography variant="body1">
                    {`${totalCountOpportunities} opportunities (showing ${countOpportunities})`}
                </Typography>
            </Grid>
            <Grid item xs={6} sm={2} className={classes.leftContent}>
                <Typography variant="body1">
                    {`Amount total: ${amountTotal}`}
                </Typography>
            </Grid>
            <Grid item xs={6} sm={2} className={classes.leftContent}>
                <Typography variant="body1">
                    {`Services total: ${servicesTotal}`}
                </Typography>
            </Grid>
            <Grid item xs={6} sm={5} className={classes.rightContent}>
                <ChooseButton
                    chooseButtonText="Columns"
                    chooseDialogTitle="Show columns"
                    chooseValues={
                        opportunityColumns
                            .map((oppColumn) => oppColumn.title)
                            .slice(1)
                    }
                    uncheckedValues={hiddenColumns}
                    applyButtonText="Apply"
                    setUncheckedValues={onHideColumns}
                />
            </Grid>
        </Grid>
    );
}

OpportunitiesHeader.propTypes = {
    opportunityColumns: PropTypes.array.isRequired,
    hiddenColumns: PropTypes.array.isRequired,
    onHideColumns: PropTypes.func.isRequired,
    totalCountOpportunities: PropTypes.number,
    countOpportunities: PropTypes.number,
    amountTotal: PropTypes.number,
    servicesTotal: PropTypes.number,
};

OpportunitiesHeader.defaultProps = {
    totalCountOpportunities: 0,
    countOpportunities: 0,
    amountTotal: 0,
    servicesTotal: 0,
};

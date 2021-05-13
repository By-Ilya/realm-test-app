import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import { OpportunityContext } from 'context/OpportunityContext';
import OpportunitiesHeader from 'components/opportunities/OpportunitiesHeader';
import {
    generateOpportunityTableData,
} from 'components/opportunities/tableData';
import OpportunityDetailedInfo from 'components/opportunities/OpportunitiyDetailedInfo';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 70,
        display: 'flex',
        flexDirection: 'row',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'normal',
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        maxHeight: '90vh',
        overflow: 'auto',
    },
    leftButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: theme.spacing(1),
    },
    buttonProgress: {
        position: 'absolute',
        marginLeft: '2.5rem',
    },
}));

export default function OpportunitiesContainer(props) {
    const classes = useStyles();
    const { fetchOpportunities } = props;
    const {
        opportunityColumns,
        opportunities,
        opportunitiesTotalCount,
        amountTotal,
        servicesTotal,
        servicesForecastSales,
        hiddenColumns,
        setHiddenColumns,
        loadProcessing,
        hasMoreOpportunities,
        moreOpportunitiesLoadProcessing,
        setLoadProcessing,
        defaultPageLimit,
        pagination,
        setPagination,
        isEditing,
        setIsEditing,
        activeOpportunity,
        setActiveOpportunity,
    } = useContext(OpportunityContext);

    const [tableData, setTableData] = useState(
        generateOpportunityTableData({
            opportunityColumns,
            hiddenColumns,
            opportunities,
        }),
    );

    const onHideColumns = (newHiddenColumns) => {
        setHiddenColumns(newHiddenColumns);
    };

    useEffect(() => {
        setTableData(
            generateOpportunityTableData({
                opportunityColumns,
                hiddenColumns,
                opportunities,
            }),
        );
    }, [opportunities, hiddenColumns]);

    const {
        opportunitiesTableColumns,
        opportunitiesTableRows,
    } = tableData;

    const fetchMoreOpportunities = async () => {
        const { increaseOn, limit } = pagination;
        setPagination({ limit: limit + increaseOn });
    };

    useEffect(() => {
        if (pagination.limit > defaultPageLimit) {
            setLoadProcessing(true, true);
            fetchOpportunities({ needToClean: false });
        }
    }, [pagination]);

    const handleClickOpportunity = (event, rowData) => {
        if (isEditing) {
            return;
        }
        const { id } = rowData;
        const foundOpportunities = opportunities.filter(
            (o) => o._id === id,
        );
        if (foundOpportunities && foundOpportunities.length) {
            setActiveOpportunity(foundOpportunities[0]);
        }
    };
    const handleCloseActiveOpportunity = () => {
        setIsEditing(false);
        setActiveOpportunity(null);
    };

    return (
        <Grid container className={classes.container}>
            <Grid item xs={activeOpportunity ? 9 : 12}>
                <Paper className={classes.paper}>
                    <OpportunitiesHeader
                        opportunityColumns={opportunityColumns}
                        hiddenColumns={hiddenColumns}
                        onHideColumns={onHideColumns}
                        totalCountOpportunities={opportunitiesTotalCount}
                        countOpportunities={opportunities.length}
                        amountTotal={amountTotal}
                        servicesTotal={servicesTotal}
                        servicesForecastSales={servicesForecastSales}
                    />
                    {loadProcessing && (
                        <CircularProgress />
                    )}
                    {!loadProcessing && (
                        <MaterialTable
                            title="Opportunities"
                            columns={opportunitiesTableColumns}
                            data={opportunitiesTableRows}
                            onRowClick={handleClickOpportunity}
                            options={{
                                search: false,
                                sorting: false,
                                paging: false,
                                padding: 'dense',
                            }}
                        />
                    )}

                    {!loadProcessing && opportunities && (
                        <div className={classes.leftButton}>
                            <Button
                                disabled={
                                    !hasMoreOpportunities || moreOpportunitiesLoadProcessing
                                }
                                variant="contained"
                                color="primary"
                                onClick={fetchMoreOpportunities}
                            >
                                Get more
                            </Button>
                            {moreOpportunitiesLoadProcessing && (
                                <CircularProgress
                                    size={24}
                                    className={classes.buttonProgress}
                                />
                            )}
                        </div>
                    )}
                </Paper>
            </Grid>

            {activeOpportunity && (
                <Grid item xs={3}>
                    <OpportunityDetailedInfo
                        opportunity={activeOpportunity}
                        onClose={handleCloseActiveOpportunity}
                    />
                </Grid>
            )}
        </Grid>
    );
}

OpportunitiesContainer.propTypes = {
    fetchOpportunities: PropTypes.func.isRequired,
};

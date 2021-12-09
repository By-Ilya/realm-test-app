import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import MaterialTable from 'material-table';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ForecastContext } from 'context/ForecastContext';
import {
    generateRawColumns,
    generateDetailRowsPSM,
    generateSumAndJudgementRowsPSM,
    generateDetailRowsDIR,
    generateSumAndJudgementRowsDIR,
    generateDetailRowsVP,
    generateSumAndJudgementRowsVP,
} from 'components/forecast/tableData';
import ForecastNotes from 'components/forecast/detailedInfo/ForecastNotes';

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
    headerStyle: {
        fontWeight: 'bold',
        width: 150,
        minWidth: 150,
    },
    divider: {
        margin: '20px',
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

function ForecastTableHeader(props) {
    const classes = useStyles();
    const { forecastDetailsColumns } = props;

    const firstRowHeader = [];
    const secondRowHeader = [];

    forecastDetailsColumns.forEach((column) => {
        const { title, subColumns } = column;
        if (subColumns && subColumns.length) {
            firstRowHeader.push((
                <TableCell
                    colSpan={subColumns.length}
                    align="center"
                    className={classes.headerStyle}
                >
                    {title}
                </TableCell>
            ));

            subColumns.forEach((subColumn) => {
                secondRowHeader.push((
                    <TableCell align="center" className={classes.headerStyle}>
                        {subColumn.title}
                    </TableCell>
                ));
            });

            return;
        }

        firstRowHeader.push((
            <TableCell rowSpan={2} className={classes.headerStyle}>
                {title}
            </TableCell>
        ));
    });

    return (
        <TableHead>
            <TableRow>
                {firstRowHeader}
            </TableRow>

            <TableRow>
                {secondRowHeader}
            </TableRow>
        </TableHead>
    );
}

ForecastTableHeader.propTypes = {
    forecastDetailsColumns: PropTypes.array.isRequired,
};

export default function ForecastContainer(props) {
    const classes = useStyles();
    const { fetchForecast } = props;
    const {
        filter,
        forecastDetailsColumns,
        sumAndJudgementColumns,
        forecastDetails,
        sumData,
        judgementData,
        notes,
        loadProcessing,
    } = useContext(ForecastContext);

    let generateDetailRowsFunc = () => {};
    let generateSumAndJudgementRowsFunc = () => {};

    switch (filter.level) {
        case 'PSM':
            generateDetailRowsFunc = generateDetailRowsPSM;
            generateSumAndJudgementRowsFunc = generateSumAndJudgementRowsPSM;
            break;
        case 'DIR':
            generateDetailRowsFunc = generateDetailRowsDIR;
            generateSumAndJudgementRowsFunc = generateSumAndJudgementRowsDIR;
            break;
        case 'VP':
            generateDetailRowsFunc = generateDetailRowsVP;
            generateSumAndJudgementRowsFunc = generateSumAndJudgementRowsVP;
            break;
        default:
            break;
    }

    const detailsRawColumns = generateRawColumns(forecastDetailsColumns);
    const sumAndJudgementRawColumns = generateRawColumns(sumAndJudgementColumns);

    const [tableData, setTableData] = useState({
        forecastDetailsTableColumns: detailsRawColumns,
        sumAndJudgementTableColumns: sumAndJudgementRawColumns,
        forecastDetailsTableRows: generateDetailRowsFunc(forecastDetails),
        sumAndJudgementTableRows: generateSumAndJudgementRowsFunc(sumData, judgementData),
    });

    useEffect(() => {
        setTableData({
            forecastDetailsTableColumns: detailsRawColumns,
            sumAndJudgementTableColumns: sumAndJudgementRawColumns,
            forecastDetailsTableRows: generateDetailRowsFunc(forecastDetails),
            sumAndJudgementTableRows: generateSumAndJudgementRowsFunc(sumData, judgementData),
        });
    }, [forecastDetails, sumData, judgementData]);

    return (
        <Grid container className={classes.container}>
            <Grid item xs="12">
                <Paper className={classes.paper}>
                    {loadProcessing && (
                        <CircularProgress />
                    )}
                    {!loadProcessing && (
                        <>
                            <MaterialTable
                                title="Details"
                                columns={tableData.forecastDetailsTableColumns}
                                data={tableData.forecastDetailsTableRows}
                                components={{
                                    Header: () => (
                                        <ForecastTableHeader
                                            forecastDetailsColumns={forecastDetailsColumns}
                                        />
                                    ),
                                }}
                                options={{
                                    search: false,
                                    sorting: false,
                                    paging: false,
                                    padding: 'dense',
                                }}
                            />
                            <Divider className={classes.divider} />
                            <MaterialTable
                                title="Sum & Judgement"
                                columns={tableData.sumAndJudgementTableColumns}
                                data={tableData.sumAndJudgementTableRows}
                                components={{
                                    Header: () => (
                                        <ForecastTableHeader
                                            forecastDetailsColumns={sumAndJudgementColumns}
                                        />
                                    ),
                                }}
                                options={{
                                    search: false,
                                    sorting: false,
                                    paging: false,
                                    padding: 'dense',
                                }}
                            />
                            <Divider className={classes.divider} />
                            <ForecastNotes
                                countRows={10}
                                textValue={notes}
                            />
                        </>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}

ForecastContainer.propTypes = {
    fetchForecast: PropTypes.func.isRequired,
};

import React, {
    useContext,
    useState,
    useEffect,
    useMemo,
} from 'react';
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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { ForecastContext, EMPTY_ACCOUNT_NAME } from 'context/ForecastContext';
import generateTableIcons from 'components/common/helpers/TableIcons';
import NoSortingIcon from 'components/common/sorting/NoSortingIcon';
import AscSortingIcon from 'components/common/sorting/AscSortingIcon';
import DescSortingIcon from 'components/common/sorting/DescSortingIcon';

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
    actionsHeaderStyle: {
        fontWeight: 'bold',
        width: 30,
        minWidth: 30,
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    divider: {
        margin: '20px',
    },
    leftButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    textField: {
        width: '30%',
    },
    saveButton: {
        marginTop: '10px',
    },
    saveButtonProgress: {
        position: 'absolute',
        top: '15px',
        left: '20px',
    },
}));

function ForecastTableHeader(props) {
    const classes = useStyles();
    const { forecastDetailsColumns, activateActionsColumn } = props;

    const { sort, sortTableRows } = useContext(ForecastContext);

    const [firstRowHeader, setFirstRowHeader] = useState([]);
    const [secondRowHeader, setSecondRowHeader] = useState([]);

    const clickableStyle = activateActionsColumn ? { cursor: 'pointer' } : {};

    const handleOnClickSortColumn = (fullColumnName) => {
        if (!activateActionsColumn) {
            return;
        }

        sortTableRows(fullColumnName);
    };

    const chooseSortIcon = (fullColumnName) => {
        if (sort.columnToSort === fullColumnName) {
            switch (sort.sortDirection) {
                case 'ASC':
                    return (<AscSortingIcon />);
                case 'DESC':
                    return (<DescSortingIcon />);
                case undefined:
                default:
                    return (<NoSortingIcon />);
            }
        }

        return (<NoSortingIcon />);
    };

    useEffect(() => {
        if (!forecastDetailsColumns || !forecastDetailsColumns.length) {
            return;
        }

        const localFirstRowHeader = [];
        const localSecondRowHeader = [];

        if (activateActionsColumn) {
            localFirstRowHeader.push((
                <TableCell
                    rowSpan={2}
                    align="left"
                    className={classes.actionsHeaderStyle}
                >
                    Group
                </TableCell>
            ));
        }

        forecastDetailsColumns.forEach((column) => {
            const { title, subColumns, field } = column;
            if (subColumns && subColumns.length) {
                localFirstRowHeader.push((
                    <TableCell
                        colSpan={subColumns.length}
                        align="center"
                        className={classes.headerStyle}
                    >
                        {title}
                    </TableCell>
                ));

                subColumns.forEach((subColumn) => {
                    localSecondRowHeader.push((
                        <TableCell
                            align="left"
                            className={classes.headerStyle}
                            style={clickableStyle}
                            onClick={() => handleOnClickSortColumn(`${field}${subColumn.field}`)}
                        >
                            <div className={classes.headerContent}>
                                {subColumn.title}
                                {activateActionsColumn && chooseSortIcon(`${field}${subColumn.field}`)}
                            </div>
                        </TableCell>
                    ));
                });

                return;
            }

            localFirstRowHeader.push((
                <TableCell
                    rowSpan={2}
                    className={classes.headerStyle}
                    style={clickableStyle}
                    onClick={() => handleOnClickSortColumn(field)}
                >
                    <div className={classes.headerContent}>
                        {title}
                        {activateActionsColumn && chooseSortIcon(field)}
                    </div>
                </TableCell>
            ));
        });

        setFirstRowHeader(localFirstRowHeader);
        setSecondRowHeader(localSecondRowHeader);
    }, [forecastDetailsColumns]);

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
    activateActionsColumn: PropTypes.bool,
};

ForecastTableHeader.defaultProps = {
    activateActionsColumn: false,
};

export default function ForecastContainer(props) {
    const classes = useStyles();
    const { fetchForecast } = props;

    const {
        filter,
        forecastDetailsColumns,
        sumAndJudgementColumns,
        tableData,
        notes,
        sort,
        loadProcessing,
        grouppedForecastDetails,
        groupTableRowsByAccount,
        ungroupTableRowsByAccount,
    } = useContext(ForecastContext);
    const { columns, rows } = tableData;

    const textFieldRef = React.createRef(null);

    const isActionsColumnAvailable = useMemo(() => (
        filter.level === 'PSM'
    ), [filter.level]);

    const grouppedAccountNames = useMemo(() => (
        Object.keys(grouppedForecastDetails) ?? []
    ), [grouppedForecastDetails]);

    const tableIcons = useMemo(() => (
        generateTableIcons(() => {})
    ), []);

    const handleOnGroupRows = (event, rowData) => {
        groupTableRowsByAccount(rowData.tableData.id);
    };

    const handleOnUngroupRows = (accountName) => {
        ungroupTableRowsByAccount(accountName);
    };

    const renderRowAction = (row) => {
        const nameField = row?.name?.data?.value ?? EMPTY_ACCOUNT_NAME;
        if (grouppedAccountNames.includes(nameField)) {
            return {
                icon: tableIcons.Group,
                tooltip: `Ungroup "${nameField}"`,
                onClick: () => handleOnUngroupRows(nameField),
            };
        }

        return {
            icon: tableIcons.GroupAdd,
            tooltip: 'Group by Account',
            onClick: handleOnGroupRows,
        };
    };

    const tableActions = useMemo(() => (
        isActionsColumnAvailable
            ? [renderRowAction]
            : []
    ), [isActionsColumnAvailable, grouppedAccountNames]);

    const detailsTableHeader = useMemo(() => () => (
        <ForecastTableHeader
            forecastDetailsColumns={forecastDetailsColumns}
            activateActionsColumn={isActionsColumnAvailable}
        />
    ), [columns.details, sort]);
    const sumAndJudgementTableHeader = useMemo(() => () => (
        <ForecastTableHeader forecastDetailsColumns={sumAndJudgementColumns} />
    ), [columns.sumAndJudgement]);

    const handleClickOnSaveButton = () => {
        console.log('new notes:', textFieldRef.current.value ?? ''); // TODO: log
    };

    return (
        <Grid container className={classes.container}>
            <Grid item xs="12">
                <Paper className={classes.paper}>
                    {loadProcessing
                        ? (<CircularProgress />)
                        : (
                            <>
                                <MaterialTable
                                    title="Details"
                                    columns={columns.details}
                                    data={rows.details}
                                    components={{ Header: detailsTableHeader }}
                                    options={{
                                        search: false,
                                        sorting: true,
                                        paging: false,
                                        padding: 'dense',
                                        grouping: false,
                                    }}
                                    actions={tableActions}
                                />
                                <Divider className={classes.divider} />
                                <MaterialTable
                                    title="Sum & Judgement"
                                    columns={columns.sumAndJudgement}
                                    data={rows.sumAndJudgement}
                                    components={{ Header: sumAndJudgementTableHeader }}
                                    options={{
                                        search: false,
                                        sorting: false,
                                        paging: false,
                                        padding: 'dense',
                                    }}
                                />
                                <Divider className={classes.divider} />
                                <ForecastNotes
                                    ref={textFieldRef}
                                    countRows={10}
                                    textValue={notes}
                                />
                                <SaveButton
                                    updateProcessing={false}
                                    onClick={handleClickOnSaveButton}
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

const ForecastNotes = React.forwardRef((props, ref) => {
    const classes = useStyles();

    const { countRows, textValue } = props;

    return (
        <div className={classes.textFieldContainer}>
            <TextField
                label="Notes"
                multiline
                inputRef={ref}
                rows={countRows}
                value={textValue}
                variant="filled"
                className={classes.textField}
            />
        </div>
    );
});

ForecastNotes.propTypes = {
    countRows: PropTypes.number,
    textValue: PropTypes.string,
};

ForecastNotes.defaultProps = {
    countRows: 10,
    textValue: '',
};

function SaveButton(props) {
    const classes = useStyles();
    const {
        updateProcessing,
        onClick,
    } = props;

    return (
        <div className={classes.leftButton}>
            <Button
                className={classes.saveButton}
                disabled={updateProcessing}
                variant="contained"
                color="primary"
                onClick={onClick}
            >
                Save
            </Button>
            {updateProcessing && (
                <CircularProgress
                    size={24}
                    className={classes.saveButtonProgress}
                />
            )}
        </div>
    );
}

SaveButton.propTypes = {
    updateProcessing: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

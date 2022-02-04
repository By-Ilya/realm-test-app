import React from 'react';

import { AuthContext } from 'context/AuthContext';
import {
    generateRawColumns,
    generateDetailRowsPSM,
    generateSumAndJudgementRowsPSM,
    generateDetailRowsDIR,
    generateSumAndJudgementRowsDIR,
    generateDetailRowsVP,
    generateSumAndJudgementRowsVP,
} from 'components/forecast/tableData';
import { ascSorting, descSorting } from 'helpers/sorting';

const ForecastContext = React.createContext('forecast');

const PSM_FORECAST_DETAILS_COLUMNS = [
    { title: 'Name', field: 'name' },
    { title: 'Opportunity Name', field: 'opportunityName' },
];

const DIR_FORECAST_DETAILS_COLUMNS = [
    { title: 'PSM', field: 'psm' },
    { title: 'Regions', field: 'regions' },
];

const VP_FORECAST_DETAILS_COLUMNS = [
    { title: 'Geo', field: 'geo' },
    { title: 'Director', field: 'director' },
];

const SUM_AND_JUDGEMENT_COLUMNS = [
    { title: '', field: 'name' },
];

const COMMON_FORECAST_DETAILS_COLUMNS = [
    { title: 'Quarterly Call', field: 'quarterlyCall' },
    {
        title: 'How is your quarterly call broken down?',
        subTitle: '',
        field: '',
        subColumns: [
            { title: 'Delivered Revenue Call', field: 'deliveredCall' },
            { title: 'Delivered Revenue from Expiring', field: 'deliveredFromExpiring' },
            { title: 'Delivered Revenue from Consulting', field: 'deliveredConsulting' },
            { title: 'Delivered Revenue from Training', field: 'deliveredTraining' },
            { title: 'Expiring Revenue', field: 'expiringCall' },
        ],
    },
    { title: 'QTD Delivered Revenue', field: 'qtdDelivered' },
    { title: 'QTD Expired Revenue', field: 'qtdExpired' },
    { title: 'Total QTD Revenue', field: 'totalQtdRevenue' },
    { title: 'Rest of Quarter Risk $', field: 'roqRisk' },
    { title: 'Rest of Quarter Upside $', field: 'roqUpside' },
    {
        title: 'Current month',
        subTitle: 'Current month',
        field: 'month0',
        subColumns: [
            { title: 'Most Likely $', field: 'Likely' },
            { title: 'Best Case $', field: 'Best' },
        ],
    },
    {
        title: 'Current month +1',
        subTitle: 'Current month',
        field: 'month1',
        subColumns: [
            { title: 'Most Likely $', field: 'Likely' },
            { title: 'Best Case $', field: 'Best' },
        ],
    },
    {
        title: 'Current month +2',
        subTitle: 'Current month',
        field: 'month1',
        subColumns: [
            { title: 'Most Likely $', field: 'Likely' },
            { title: 'Best Case $', field: 'Best' },
        ],
    },
];

const DEFAULT_FILTER = {
    level: '',
    geo: '',
    psmName: '',
};

const DEFAULT_SORT = {
    columnToSort: undefined,
    sortDirection: undefined,
};
const DEFAULT_SORT_COLUMN = 'name';

export const EMPTY_ACCOUNT_NAME = 'EmptyAccountName';

class ForecastContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            forecastDetailsColumns: [
                ...VP_FORECAST_DETAILS_COLUMNS,
                ...COMMON_FORECAST_DETAILS_COLUMNS,
            ],
            sumAndJudgementColumns: [
                ...SUM_AND_JUDGEMENT_COLUMNS,
                ...COMMON_FORECAST_DETAILS_COLUMNS,
            ],
            filter: DEFAULT_FILTER,
            allPsmList: [],
            levelsList: [],
            psmNamesList: [],
            geoNamesList: [],
            loadProcessing: false,
            forecastDetails: [],
            grouppedForecastDetails: {},
            sumData: {},
            judgementData: {},
            notes: '',
            sort: DEFAULT_SORT,
            tableData: {
                columns: { details: [], sumAndJudgement: [] },
                rows: { details: [], sumAndJudgement: [] },
            },
        };
        this.funcs = {
            fetchFiltersDefaultValues: this.fetchFiltersDefaultValues,
            setFilter: this.setFilter,
            fetchForecast: this.fetchForecast,
            cleanLocalForecast: this.cleanLocalForecast,
            findPsmGeoByPsmName: this.findPsmGeoByPsmName,
            updateNotes: this.updateNotes,
            groupTableRowsByAccount: this.groupTableRowsByAccount,
            ungroupTableRowsByAccount: this.ungroupTableRowsByAccount,
            sortTableRows: this.sortTableRows,
        };
    }

    fetchFiltersDefaultValues = async () => {
        const { authValue } = this.props;
        const { user } = authValue;
        if (user) {
            const { getForecastDropdownValues } = user.functions;
            const {
                levels,
                psmNames,
                geoNames,
            } = await getForecastDropdownValues();

            const newFilter = this.getDefaultFilterIfNecessary(psmNames);

            const afterChangingDefaultValuesCb = () => this.setFilter(newFilter);

            this.setState({
                allPsmList: psmNames ? psmNames.sort() : [],
                levelsList: levels ? levels.sort() : [],
                geoNamesList: geoNames ? geoNames.sort() : [],
            }, afterChangingDefaultValuesCb);
        }
    }

    getDefaultFilterIfNecessary = (psmNames) => {
        const { filter } = this.state;
        const isEmptyPsmNames = !psmNames || !psmNames.length;
        const isFilterFilled = filter.level && filter.geo && filter.psmName;

        if (isEmptyPsmNames || isFilterFilled) return filter;

        const defaultFilter = {
            ...filter,
            level: 'VP',
            geo: psmNames[0].geo,
            psmName: psmNames[0].name,
        };

        const { authValue } = this.props;
        const { email: userEmail } = authValue.getActiveUserFilter();
        const foundPsm = psmNames.find((psm) => psm.email === userEmail);

        if (foundPsm) {
            defaultFilter.level = foundPsm.level;
            defaultFilter.geo = foundPsm.geo;
            defaultFilter.psmName = foundPsm.name;
        }

        return defaultFilter;
    }

    updateForecatDetailsColumns = (level) => {
        const { forecastDetailsColumns } = this.state;

        switch (level) {
            case 'PSM':
                return [
                    ...PSM_FORECAST_DETAILS_COLUMNS,
                    ...COMMON_FORECAST_DETAILS_COLUMNS,
                ];
            case 'DIR':
                return [
                    ...DIR_FORECAST_DETAILS_COLUMNS,
                    ...COMMON_FORECAST_DETAILS_COLUMNS,
                ];
            case 'VP':
                return [
                    ...VP_FORECAST_DETAILS_COLUMNS,
                    ...COMMON_FORECAST_DETAILS_COLUMNS,
                ];
            default:
                return forecastDetailsColumns;
        }
    }

    setFilter = (newFilter) => {
        let { filter } = this.state;
        const newPsmNamesList = this.changeActivePsmNamesList(newFilter.geo);
        filter = { ...filter, ...newFilter };
        const foundActivePsmName = newPsmNamesList.find(
            (psmName) => psmName === filter.psmName,
        );
        if (!foundActivePsmName) {
            filter = { ...filter, psmName: newPsmNamesList[0] ?? '' };
        }

        const updatedDetailsColumns = this.updateForecatDetailsColumns(filter.level);
        const { sumAndJudgementColumns } = this.state;

        this.setState({
            filter,
            psmNamesList: newPsmNamesList,
            forecastDetailsColumns: updatedDetailsColumns,
            grouppedForecastDetails: {},
            sort: DEFAULT_SORT,
            tableData: {
                columns: {
                    details: generateRawColumns(updatedDetailsColumns),
                    sumAndJudgement: generateRawColumns(sumAndJudgementColumns),
                },
                rows: {
                    details: [],
                    sumAndJudgement: [],
                },
            },
        });
    }

    fetchForecast = async () => {
        const { filter } = this.state;
        this.setState({ loadProcessing: true });
        switch (filter.level) {
            case 'PSM':
                await this.fetchPsmForecastData(filter.psmName);
                break;
            case 'DIR':
                await this.fetchDirForecastData(filter.geo);
                break;
            case 'VP':
                await this.fetchVpForecastData();
                break;
            default:
                break;
        }
        this.setState({ loadProcessing: false });
    }

    cleanLocalForecast = () => {
        this.setState({
            forecastDetails: [],
            sumData: {},
            judgementData: {},
            notes: '',
            grouppedForecastDetails: {},
            sort: DEFAULT_SORT,
        });
    }

    fetchPsmForecastData = async (psmName) => {
        if (!psmName) return;

        const { authValue } = this.props;
        const { generatePSMForecastData } = authValue.user.functions;
        const psmFiltersData = { name: psmName, month: new Date() };
        const {
            details,
            sum,
            notes,
            judgement,
        } = await generatePSMForecastData(psmFiltersData);

        this.setState({
            forecastDetails: details,
            sumData: sum,
            judgementData: judgement,
            notes,
            sort: DEFAULT_SORT,
            tableData: this.updateTableRows(
                'PSM',
                details,
                sum,
                judgement,
            ),
        });
    }

    fetchDirForecastData = async (geo) => {
        if (!geo) return;

        const { authValue } = this.props;
        const { generateDIRForecastData } = authValue.user.functions;
        const dirFiltersData = { geo, month: new Date() };
        const {
            details,
            sum,
            notes,
            judgement,
        } = await generateDIRForecastData(dirFiltersData);

        this.setState({
            forecastDetails: details,
            sumData: sum,
            judgementData: judgement,
            notes,
            sort: DEFAULT_SORT,
            tableData: this.updateTableRows(
                'DIR',
                details,
                sum,
                judgement,
            ),
        });
    }

    fetchVpForecastData = async () => {
        const { authValue } = this.props;
        const { generateVPForecastData } = authValue.user.functions;
        const vpFiltersData = { month: new Date() };
        const {
            details,
            sum,
            notes,
            judgement,
        } = await generateVPForecastData(vpFiltersData);

        this.setState({
            forecastDetails: details,
            sumData: sum,
            judgementData: judgement,
            notes,
            sort: DEFAULT_SORT,
            tableData: this.updateTableRows(
                'VP',
                details,
                sum,
                judgement,
            ),
        });
    }

    updateTableRows = (level, details, sum, judgement) => {
        let generateDetailRowsFunc = () => {};
        let generateSumAndJudgementFunc = () => {};

        const { tableData, sort } = this.state;

        switch (level) {
            case 'PSM':
                generateDetailRowsFunc = generateDetailRowsPSM;
                generateSumAndJudgementFunc = generateSumAndJudgementRowsPSM;
                break;
            case 'DIR':
                generateDetailRowsFunc = generateDetailRowsDIR;
                generateSumAndJudgementFunc = generateSumAndJudgementRowsDIR;
                break;
            case 'VP':
                generateDetailRowsFunc = generateDetailRowsVP;
                generateSumAndJudgementFunc = generateSumAndJudgementRowsVP;
                break;
            default:
                break;
        }

        return {
            ...tableData,
            rows: {
                details: this.sortTableRowsAction(
                    generateDetailRowsFunc(details),
                    sort,
                    sort,
                ),
                sumAndJudgement: generateSumAndJudgementFunc(
                    sum,
                    judgement,
                ),
            },
        };
    }

    changeActivePsmNamesList = (geo) => {
        const { allPsmList } = this.state;
        return allPsmList
            .filter((psm) => psm.geo === geo)
            .map((psm) => psm.name);
    }

    findPsmGeoByPsmName = (psmName) => {
        if (!psmName) return '';

        const { allPsmList } = this.state;
        const foundPsm = allPsmList.find(
            (psm) => psm.name === psmName,
        );
        if (!foundPsm) return '';

        return foundPsm.geo;
    }

    updateNotes = (newNotes) => {
        this.setState({ notes: newNotes });
    }

    groupTableRowsByAccount = (rowId) => {
        if (
            rowId === undefined ||
            rowId === null ||
            typeof rowId !== 'number' ||
            Number.isNaN(rowId)
        ) {
            return;
        }

        const {
            forecastDetails,
            grouppedForecastDetails,
            tableData,
            sort,
        } = this.state;
        const rowToGroup = forecastDetails[rowId];

        if (!rowToGroup) {
            return;
        }

        const { account_name: accountName } = rowToGroup;
        const accountDetailsRows = [];
        const otherGrouppedRows = [];
        const otherRows = [];

        forecastDetails.forEach((row) => {
            if ((row?.account_name ?? null) === accountName) {
                accountDetailsRows.push(row);
                return;
            }

            if (row.isGroupped && row.name !== accountName) {
                otherGrouppedRows.push(row);
                return;
            }

            otherRows.push(row);
        });

        if (!accountDetailsRows.length) {
            return;
        }

        const accountAggregatedDetails = { ...accountDetailsRows[0] };
        accountDetailsRows.forEach((record, index) => {
            if (index === 0) {
                return;
            }

            Object.entries(record).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined ||
                    typeof value === 'string'
                ) {
                    return;
                }

                if (typeof value === 'object') {
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        accountAggregatedDetails[key][subKey] = subValue;
                    });
                    return;
                }
                accountAggregatedDetails[key] += value;
            });
        });

        const accountNameStr = accountName ?? EMPTY_ACCOUNT_NAME;

        accountAggregatedDetails.name = accountNameStr;
        accountAggregatedDetails.opportunity_name = '–';
        accountAggregatedDetails.isGroupped = true;

        const combinedForecastDetails = [
            accountAggregatedDetails,
            ...otherGrouppedRows,
            ...otherRows,
        ];

        const grouppedRowsTableDataDetails = this.sortTableRowsAction(
            generateDetailRowsPSM([accountAggregatedDetails, ...otherGrouppedRows]),
            sort,
            sort,
        );
        const otherRowsTableDataDetails = this.sortTableRowsAction(
            generateDetailRowsPSM(otherRows),
            sort,
            sort,
        );
        const newTableData = {
            ...tableData,
            rows: {
                ...tableData.rows,
                details: [
                    ...grouppedRowsTableDataDetails,
                    ...otherRowsTableDataDetails,
                ],
            },
        };

        this.setState({
            forecastDetails: combinedForecastDetails,
            grouppedForecastDetails: {
                ...grouppedForecastDetails,
                [accountNameStr]: accountDetailsRows,
            },
            tableData: newTableData,
        });
    };

    ungroupTableRowsByAccount = (accountName) => {
        if (!accountName) {
            return;
        }

        const {
            forecastDetails,
            grouppedForecastDetails,
            tableData,
            sort,
        } = this.state;

        const copyGrouppedForecastDetails = { ...grouppedForecastDetails };
        const ungrouppedRecords = copyGrouppedForecastDetails[accountName];
        if (!ungrouppedRecords) {
            return;
        }

        const otherGrouppedRows = [];
        const otherRows = [];

        forecastDetails.forEach((record) => {
            if (record.isGroupped && record.name === accountName) {
                return;
            }
            if (record.isGroupped && record.name !== accountName) {
                otherGrouppedRows.push(record);
                return;
            }
            otherRows.push(record);
        });

        const combinedForecastDetails = [
            ...otherGrouppedRows,
            ...ungrouppedRecords,
            ...otherRows,
        ];

        const grouppedRowsTableDataDetails = this.sortTableRowsAction(
            generateDetailRowsPSM(otherGrouppedRows),
            sort,
            sort,
        );
        const otherRowsTableDataDetails = this.sortTableRowsAction(
            generateDetailRowsPSM([...ungrouppedRecords, ...otherRows]),
            sort,
            sort,
        );
        const newTableData = {
            ...tableData,
            rows: {
                ...tableData.rows,
                details: [
                    ...grouppedRowsTableDataDetails,
                    ...otherRowsTableDataDetails,
                ],
            },
        };

        delete copyGrouppedForecastDetails[accountName];

        this.setState({
            forecastDetails: combinedForecastDetails,
            grouppedForecastDetails: copyGrouppedForecastDetails,
            tableData: newTableData,
        });
    }

    sortTableRows = (columnName) => {
        const { sort, forecastDetails, tableData } = this.state;
        const { columnToSort, sortDirection } = sort;

        const newSort = { ...sort };

        if (columnToSort === columnName) {
            switch (sortDirection) {
                case undefined:
                    newSort.sortDirection = 'ASC';
                    break;
                case 'ASC':
                    newSort.sortDirection = 'DESC';
                    break;
                case 'DESC':
                    newSort.sortDirection = undefined;
                    break;
                default:
                    break;
            }
        } else {
            newSort.columnToSort = columnName;
            newSort.sortDirection = 'ASC';
        }

        const grouppedRows = [];
        const otherRows = [];

        forecastDetails.forEach((record) => {
            if (record.isGroupped) {
                grouppedRows.push(record);
                return;
            }
            otherRows.push(record);
        });

        const grouppedDetailsTableData = this.sortTableRowsAction(
            generateDetailRowsPSM(grouppedRows),
            newSort,
            sort,
        );
        const otherDetailsTableData = this.sortTableRowsAction(
            generateDetailRowsPSM(otherRows),
            newSort,
            sort,
        );
        const newTableData = {
            ...tableData,
            rows: {
                ...tableData.rows,
                details: [
                    ...grouppedDetailsTableData,
                    ...otherDetailsTableData,
                ],
            },
        };

        this.setState({
            sort: newSort,
            tableData: newTableData,
        });
    }

    sortTableRowsAction = (details, sort, prevSortState) => {
        const { columnToSort, sortDirection } = sort;

        const newDetails = [...details];
        try {
            newDetails.sort((aObj, bObj) => {
                const { data: aData } = aObj[columnToSort];
                const { data: bData } = bObj[columnToSort];

                if (!aData || !bData) {
                    throw new Error('Unable to sort! No specified data');
                }

                if (sortDirection === 'ASC') {
                    return ascSorting(aData.value, bData.value);
                }
                if (sortDirection === 'DESC') {
                    return descSorting(aData.value, bData.value);
                }

                return ascSorting(
                    aObj[DEFAULT_SORT_COLUMN].data.value,
                    bObj[DEFAULT_SORT_COLUMN].data.value,
                );
            });

            return newDetails;
        } catch (err) {
            this.setState({ sort: prevSortState });
            return details;
        }
    }

    render() {
        return (
            // eslint-disable-next-line react/jsx-filename-extension
            <ForecastContext.Provider value={{ ...this.state, ...this.funcs }}>
                {this.props.children}
            </ForecastContext.Provider>
        );
    }
}

export default function Container(props) {
    return (
        <AuthContext.Consumer>
            {(value) => <ForecastContainer authValue={value} {...props} />}
        </AuthContext.Consumer>
    );
}

export { ForecastContext };

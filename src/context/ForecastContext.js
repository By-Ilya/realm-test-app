import React from 'react';

import { AuthContext } from 'context/AuthContext';

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
            sumData: {},
            judgementData: {},
            notes: '',
        };
        this.funcs = {
            fetchFiltersDefaultValues: this.fetchFiltersDefaultValues,
            setFilter: this.setFilter,
            fetchForecast: this.fetchForecast,
            cleanLocalForecast: this.cleanLocalForecast,
            findPsmGeoByPsmName: this.findPsmGeoByPsmName,
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
        this.setState({
            filter,
            psmNamesList: newPsmNamesList,
            forecastDetailsColumns: this.updateForecatDetailsColumns(filter.level),
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
        });
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

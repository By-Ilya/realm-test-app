import React from 'react';

import { AuthContext } from 'context/AuthContext';

const OpportunityContext = React.createContext('opportunities');

require('dotenv').config();

const HEADER_STYLE = {
    headerStyle: { fontWeight: 'bold' },
    cellStyle: { width: 150, minWidth: 150 },
};
const OPPORTUNITIES_COLUMNS = [
    {
        title: 'Opportunity ID',
        field: 'id',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'PS Region',
        field: 'psRegion',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Owner Region',
        field: 'ownerRegion',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Owner',
        field: 'owner',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Name',
        field: 'name',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Account',
        field: 'account',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Close Date',
        field: 'closeDate',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Stage',
        field: 'stage',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Forecast Category',
        field: 'forecastCategory',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Amount',
        field: 'amount',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Services',
        field: 'services',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'Engagement Manager',
        field: 'engagementManager',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'PS Status',
        field: 'psStatus',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'ESD Created',
        field: 'esdCreated',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'EM Call',
        field: 'emCall',
        editable: 'never',
        ...HEADER_STYLE,
    },
    {
        title: 'EM Call Amount',
        field: 'emCallAmount',
        editable: 'never',
        ...HEADER_STYLE,
    },
];

const DEFAULT_PAGE_LIMIT = parseInt(
    process.env.REACT_APP_OPPORTUNITIES_PAGE,
    10,
) || 50;
const DEFAULT_PAGINATION = {
    increaseOn: DEFAULT_PAGE_LIMIT,
    limit: DEFAULT_PAGE_LIMIT,
};

const DEFAULT_FILTER = {
    name: '',
    owner_region: '',
    ps_region: '',
    engagement_manager: '',
    active_user_filter: null,
};

const SORT_FIELDS = [
    'Owner Region',
    'PS Region',
    'Close date',
    'Amount',
    'Services',
];
const DEFAULT_SORT = {
    field: SORT_FIELDS[0],
    order: 'ASC',
};

class OpportunityContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            opportunityColumns: OPPORTUNITIES_COLUMNS,
            hiddenColumns: [],
            loadProcessing: false,
            moreOpportunitiesLoadProcessing: false,
            ownerRegionsList: [],
            psRegionsList: [],
            emManagersList: [],
            filter: DEFAULT_FILTER,
            sortFields: SORT_FIELDS,
            sort: DEFAULT_SORT,
            defaultPageLimit: DEFAULT_PAGE_LIMIT,
            pagination: DEFAULT_PAGINATION,
            opportunities: [],
            opportunitiesTotalCount: 0,
            amountTotal: 0,
            servicesTotal: 0,
            hasMoreOpportunities: true,
            activeOpportunity: null,
        };
        this.funcs = {
            setLoadProcessing: this.setLoadProcessing,
            setHiddenColumns: this.setHiddenColumns,
            fetchFiltersDefaultValues: this.fetchFiltersDefaultValues,
            setFilter: this.setFilter,
            setSorting: this.setSorting,
            setOpportunities: this.setOpportunities,
            setHasMoreOpportunities: this.setHasMoreOpportunities,
            fetchOpportunitiesTotalInfo: this.fetchOpportunitiesTotalInfo,
            cleanLocalOpportunities: this.cleanLocalOpportunities,
            getSortOrder: this.getSortOrder,
            setPagination: this.setPagination,
            setDefaultPagination: this.setDefaultPagination,
            setActiveOpportunity: this.setActiveOpportunity,
        };
    }

    setLoadProcessing = (loadProcessing, more = false) => {
        if (more) {
            this.setState({
                moreOpportunitiesLoadProcessing: loadProcessing,
            });
        } else {
            this.setState({ loadProcessing });
        }
    }

    setHiddenColumns = (hiddenColumns) => {
        this.setState({ hiddenColumns });
    }

    fetchFiltersDefaultValues = async () => {
        const { authValue } = this.props;
        const { user } = authValue;
        if (user) {
            const { getOpportunityFiltersDefaultValues } = user.functions;
            const {
                ownerRegions,
                psRegions,
                emManagers,
            } = await getOpportunityFiltersDefaultValues();
            this.setState({
                ownerRegionsList: ownerRegions ? ownerRegions.sort() : [],
                psRegionsList: psRegions ? psRegions.sort() : [],
                emManagersList: emManagers ? emManagers.sort() : [],
            });
        }
    }

    setFilter = (newFilter) => {
        let { filter } = this.state;
        filter = { ...filter, ...newFilter };
        this.setState({ filter });
    }

    setSorting = (newSort) => {
        this.setState({ sort: newSort });
    }

    setOpportunities = (opportunities) => {
        this.setState({ opportunities });
    }

    setHasMoreOpportunities = (hasMoreOpportunities) => {
        this.setState({ hasMoreOpportunities });
    }

    fetchOpportunitiesTotalInfo = async () => {
        const { authValue } = this.props;
        const { user } = authValue;
        const { filter } = this.state;

        const { findOpportunities } = user.functions;
        const fetchedData = await findOpportunities({
            filter,
            count_only: true,
        });
        if (fetchedData && fetchedData.length) {
            const { count, amountTotal, servicesTotal } = fetchedData[0];
            this.setState({
                opportunitiesTotalCount: count,
                amountTotal,
                servicesTotal,
            });
        }
    }

    cleanLocalOpportunities = async () => {
        this.setState({
            opportunities: [],
        });
    }

    sortNameToField = (name) => {
        switch (name) {
            case 'Owner Region': return 'owner_region';
            case 'PS Region': return 'ps_region';
            case 'Close date': return 'close_date';
            case 'Amount': return 'amount';
            case 'Services': return 'services_post_carve';
            default: return 'owner_region';
        }
    }

    getSortOrder = () => {
        const { sort } = this.state;
        const { field, order } = sort;

        return {
            field: this.sortNameToField(field),
            order: order === 'DESC' ? -1 : 1,
        };
    }

    setPagination = (newPagination) => {
        let { pagination } = this.state;
        pagination = { ...pagination, ...newPagination };
        this.setState({ pagination });
    }

    setDefaultPagination = () => {
        this.setState({ pagination: DEFAULT_PAGINATION });
    }

    setActiveOpportunity = (activeOpportunity) => {
        this.setState({ activeOpportunity });
    }

    render() {
        return (
            <OpportunityContext.Provider value={{ ...this.state, ...this.funcs }}>
                {this.props.children}
            </OpportunityContext.Provider>
        );
    }
}

export default function Container(props) {
    return (
        <AuthContext.Consumer>
            {(value) => <OpportunityContainer authValue={value} {...props} />}
        </AuthContext.Consumer>
    );
}

export { OpportunityContext };

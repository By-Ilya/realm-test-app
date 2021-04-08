import React from 'react';

import { AuthContext } from 'context/AuthContext';

const ProjectContext = React.createContext('projects');

require('dotenv').config();

const DEFAULT_PAGE_LIMIT = parseInt(
    process.env.REACT_APP_PROJECTS_PAGE,
    10,
) || 50;
const DEFAULT_PAGINATION = {
    increaseOn: DEFAULT_PAGE_LIMIT,
    limit: DEFAULT_PAGE_LIMIT,
};

const DEFAULT_FILTER = {
    region: '',
    owner: '',
    project_manager: '',
    name: '',
    active: true,
    active_user_filter: null,
    pm_stage: '',
    monthly_forecast_done: null,
};

const SORT_FIELDS = [
    'Name',
    'Region',
    'Owner',
    'Expiration',
    'Stage',
];
const DEFAULT_SORT = {
    field: SORT_FIELDS[SORT_FIELDS.length - 1],
    order: 'ASC',
};

const DEFAULT_STAGE_LIST = [
    '-None-',
    'Not Started',
    'Planning',
    'In Progress',
    'On Hold',
    'Cancelled',
    'Closed',
];

const WATCHER_TIMEOUT = 5000;

class ProjectContainer extends React.Component {
    constructor(props) {
        super(props);
        const { authValue } = this.props;
        const { projectFilter, projectSort } = authValue.localStorageKeys;
        const localFilter = JSON.parse(localStorage.getItem(projectFilter));
        const localSort = JSON.parse(localStorage.getItem(projectSort));
        this.state = {
            ...this.state,
            filter: localFilter || DEFAULT_FILTER,
            sortFields: SORT_FIELDS,
            sort: localSort || DEFAULT_SORT,
            pagination: DEFAULT_PAGINATION,
            defaultPageLimit: DEFAULT_PAGE_LIMIT,
            regionsList: [],
            ownersList: [],
            projectManagersList: [],
            stagesList: DEFAULT_STAGE_LIST,
            loadProcessing: false,
            moreProjectsLoadProcessing: false,
            projects: null,
            projectsTotalCount: 0,
            hasMoreProjects: true,
            projectWithCurrentMilestone: null,
            isEditing: false,
        };
        this.funcs = {
            fetchFiltersDefaultValues: this.fetchFiltersDefaultValues,
            setLoadProcessing: this.setLoadProcessing,
            setProjects: this.setProjects,
            setHasMoreProjects: this.setHasMoreProjects,
            fetchProjectsTotalCount: this.fetchProjectsTotalCount,
            getSortOrder: this.getSortOrder,
            cleanLocalProjects: this.cleanLocalProjects,
            setFilter: this.setFilter,
            setSorting: this.setSorting,
            setPagination: this.setPagination,
            setDefaultPagination: this.setDefaultPagination,
            setProjectWithCurrentMilestone: this.setProjectWithCurrentMilestone,
            setIsEditing: this.setIsEditing,
            requestSync: this.requestSync,
        };

        this.lastUpdateTime = null;
        this.watcherTimerId = null;
    }

    async componentDidMount() {
        await this.watchForUpdates();
    }

    componentWillUnmount() {
        clearTimeout(this.watcherTimerId);
    }

    fetchFiltersDefaultValues = async () => {
        const { authValue } = this.props;
        const { user } = authValue;
        if (user) {
            const { getProjectFiltersDefaultValues } = user.functions;
            const {
                regions,
                owners,
                projectManagers,
            } = await getProjectFiltersDefaultValues();
            this.setState({
                regionsList: regions ? regions.sort() : [],
                ownersList: owners ? owners.sort() : [],
                projectManagersList: projectManagers ? projectManagers.sort() : [],
            });
        }
    }

    setLoadProcessing = (loadProcessing, more = false) => {
        if (more) {
            this.setState({
                moreProjectsLoadProcessing: loadProcessing,
            });
        } else {
            this.setState({ loadProcessing });
        }
    }

    setProjects = (projects) => {
        this.setState({ projects });
    }

    setHasMoreProjects = (hasMoreProjects) => {
        this.setState({ hasMoreProjects });
    }

    fetchProjectsTotalCount = async () => {
        const { authValue } = this.props;
        const { user } = authValue;
        const { filter } = this.state;

        const { findProjects } = user.functions;
        const fetchedData = await findProjects({
            filter,
            count_only: true,
        });
        if (fetchedData && fetchedData.length) {
            const { name: projectsTotalCount } = fetchedData[0];
            this.setState({ projectsTotalCount });
        }
    }

    sortNameToField = (name) => {
        switch (name) {
            case 'Name': return 'name';
            case 'Region': return 'region';
            case 'Owner': return 'owner';
            case 'Expiration': return 'details.product_end_date';
            case 'Stage': return 'details.pm_stage_sortid';
            default: return 'details.pm_stage_sortid';
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

    cleanLocalProjects = async () => {
        this.setState({
            projects: [],
            projectWithCurrentMilestone: null,
            projectsTotalCount: 0,
        });
    }

    setFilter = (newFilter) => {
        let { filter } = this.state;
        filter = { ...filter, ...newFilter };
        this.setState({ filter });

        const { authValue } = this.props;
        const { projectFilter } = authValue.localStorageKeys;
        const { setLocalStorageValue } = authValue;
        setLocalStorageValue(projectFilter, JSON.stringify(filter));
    }

    setSorting = (newSort) => {
        this.setState({ sort: newSort });

        const { authValue } = this.props;
        const { projectSort } = authValue.localStorageKeys;
        const { setLocalStorageValue } = authValue;
        setLocalStorageValue(projectSort, JSON.stringify(newSort));
    }

    setPagination = (newPagination) => {
        let { pagination } = this.state;
        pagination = { ...pagination, ...newPagination };
        this.setState({ pagination });
    }

    setDefaultPagination = () => {
        this.setState({ pagination: DEFAULT_PAGINATION });
    }

    setProjectWithCurrentMilestone = (projectWithCurrentMilestone) => {
        this.setState({ projectWithCurrentMilestone });
    }

    setIsEditing = (isEditing) => {
        this.setState({ isEditing });
    }

    requestSync = async () => {
        const { user, app } = this.state;
        if (!user || !app.currentUser) return;
        await user.callFunction('requestSync', { origin: 'user' });
    }

    watchForUpdates = async () => {
        if (this.watcherTimerId) clearTimeout(this.watcherTimerId);
        try {
            await this.watcher();
        } catch (err) {
            console.log('Watcher exception:', err);
        }

        this.watcherTimerId = setTimeout(
            this.watchForUpdates,
            WATCHER_TIMEOUT,
        );
    }

    isUpdateRequired = (updateTime) => !this.lastUpdateTime || this.lastUpdateTime < updateTime

    onUpdateOperation = (updatedDocument) => {
        const { _id } = updatedDocument;
        let wasProjectUpdated = false;

        let { projects } = this.state;
        const { projectWithCurrentMilestone } = this.state;

        projects = projects.map((project) => {
            if (project._id === _id) {
                wasProjectUpdated = true;
                return updatedDocument;
            }
            return project;
        });

        if (wasProjectUpdated) {
            this.setProjects(projects);
            if (
                projectWithCurrentMilestone &&
                projectWithCurrentMilestone._id === _id
            ) {
                let ms = projectWithCurrentMilestone.milestone;
                const pr = updatedDocument;
                const { schedule } = ms;
                if (ms) {
                    pr.milestones.some((prMilestone) => {
                        if (ms._id === prMilestone._id) {
                            ms = prMilestone;
                            return true;
                        }
                        return false;
                    });
                }
                ms.schedule = schedule;

                this.setProjectWithCurrentMilestone({
                    ...projectWithCurrentMilestone,
                    project: pr,
                    milestone: ms,
                });
            }
        }
    }

    onInsertOperation = async (insertedDocument) => {
        const {
            projects,
            hasMoreProjects,
            pagination,
        } = this.state;

        await this.fetchProjectsTotalCount();
        if (hasMoreProjects) return;

        const { limit } = pagination;
        const isFullPage = !(projects.length % limit);
        if (isFullPage) {
            this.setHasMoreProjects(true);
            return;
        }

        projects.push(insertedDocument);
    }

    watcher = async () => {
        const { authValue } = this.props;
        const { dbCollection, user, app } = authValue;

        if (!dbCollection || !user || !app.currentUser) return;

        // eslint-disable-next-line no-restricted-syntax
        for await (const event of dbCollection.watch()) {
            const { clusterTime, operationType, fullDocument } = event;

            if (this.isUpdateRequired(clusterTime) && fullDocument) {
                this.lastUpdateTime = clusterTime;
                switch (operationType) {
                    case 'replace':
                    case 'update':
                        this.onUpdateOperation(fullDocument);
                        break;
                    case 'insert':
                        await this.onInsertOperation(fullDocument);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    render() {
        return (
            <ProjectContext.Provider value={{ ...this.state, ...this.funcs }}>
                {this.props.children}
            </ProjectContext.Provider>
        );
    }
}

export default function Container(props) {
    return (
        <AuthContext.Consumer>
            {(value) => <ProjectContainer authValue={value} {...props} />}
        </AuthContext.Consumer>
    );
}

export { ProjectContext };

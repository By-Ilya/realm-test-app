import React from 'react';

import { AuthContext } from 'context/AuthContext';

const ProjectContext = React.createContext('realm');

require('dotenv').config();

const DEFAULT_PAGE_LIMIT = parseInt(process.env.REACT_APP_PROJECTS_PAGE, 10) || 50;
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
const DEFAULT_SORT = {
    field: 'details.pm_stage_sortid',
    order: 'ASC',
};
const DEFAULT_PAGINATION = {
    increaseOn: DEFAULT_PAGE_LIMIT,
    limit: DEFAULT_PAGE_LIMIT,
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

function sortNameToField(name) {
    switch (name) {
        case 'name': return name;
        case 'region': return name;
        case 'owner': return name;
        case 'expiration': return 'details.product_end_date';
        case 'stage': return 'details.pm_stage_sortid';
        default: return 'details.pm_stage_sortid';
    }
}

class ContextContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            filter: DEFAULT_FILTER,
            sort: DEFAULT_SORT,
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
            setMoreProjectsLoadProcessing: this.setMoreProjectsLoadProcessing,
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
            getActiveUserFilter: this.getActiveUserFilter,
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
            const { getFiltersDefaultValues } = user.functions;
            const {
                regions,
                owners,
                projectManagers,
            } = await getFiltersDefaultValues();
            this.setState({
                regionsList: regions ? regions.sort() : [],
                ownersList: owners ? owners.sort() : [],
                projectManagersList: projectManagers ? projectManagers.sort() : [],
            });
            this.setFilter({
                active_user_filter: {
                    name: user.profile.name,
                    email: user.profile.email
                }
            });
        }
    }

    setLoadProcessing = (loadProcessing) => {
        this.setState({ loadProcessing });
    }

    setMoreProjectsLoadProcessing = (moreProjectsLoadProcessing) => {
        this.setState({ moreProjectsLoadProcessing });
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

    getSortOrder = () => {
        const { sort } = this.state;
        const { field, order } = sort;

        return { field, order: order === 'DESC' ? -1 : 1 };
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
    }

    setSorting = (newSort) => {
        newSort.field = sortNameToField(newSort.field);
        this.setState({ sort: newSort });
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

    getActiveUserFilter = () => {
        const { authValue } = this.props;
        const { profile } = authValue.user;
        return {
            email: profile.email,
            name: profile.name,
        };
    }

    requestSync = async () => {
        const { authValue } = this.props;
        const { user, app } = authValue;
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
                projectWithCurrentMilestone.project._id === _id
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
            {(value) => <ContextContainer authValue={value} {...props} />}
        </AuthContext.Consumer>
    );
}

export { ProjectContext };

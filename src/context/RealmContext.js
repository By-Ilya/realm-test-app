import React from 'react';
import * as Realm from "realm-web";

const RealmContext = React.createContext('realm');

require('dotenv').config();

const GOOGLE_CLIENT_ID = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}` || '';
const APP_NAME = `${process.env.REACT_APP_NAME}` || 'Realm Test App';
const COPYRIGHT_LINK = `${process.env.REACT_APP_COPYRIGHT_LINK}` || 'http://localhost:3000';
const REALM_APP_ID = `${process.env.REACT_APP_REALM_APP_ID}` || '';
const REALM_SERVICE_NAME = `${process.env.REACT_APP_SERVICE_NAME}` || 'mongodb-atlas';
const REALM_DATABASE_NAME = `${process.env.REACT_APP_DATABASE_NAME}` || '';
const REALM_COLLECTION_NAME = `${process.env.REACT_APP_COLLECTION_NAME}` || '';
const REALM_FCST_COLLECTION_NAME = `${process.env.REACT_APP_FCST_COLLECTION_NAME}` || '';
const GOOGLE_REDIRECT_URI = `${process.env.REACT_APP_GOOGLE_REDIRECT_URI}` || 'http://localhost:3000/google-callback';
const DEFAULT_PAGE_LIMIT = parseInt(process.env.REACT_APP_PROJECTS_PAGE) || 50;

const DEFAULT_FILTER = {
    region: '',
    owner: '',
    project_manager: '',
    name: '',
    active: true,
    active_user_filter: null,
    pm_stage: '',
    monthly_forecast_done: null
}
const DEFAULT_SORT = {
    field: 'details.pm_stage_sortid',
    order: 'ASC'
};
const DEFAULT_PAGINATION = {
    increaseOn: DEFAULT_PAGE_LIMIT,
    limit: DEFAULT_PAGE_LIMIT
};

const DEFAULT_STAGE_LIST = [
    "-None-",
    "Not Started",
    "Planning",
    "In Progress",
    "On Hold",
    "Cancelled",
    "Closed"
];

const WATCHER_TIMEOUT = 5000;

function sortNameToField(name) {
    switch(name) {
        case 'name': return name;
        case 'region': return name;
        case 'owner': return name;
        case 'expiration': return "details.product_end_date";
        case 'stage': return "details.pm_stage_sortid";
        default: return "details.pm_stage_sortid";
    }
}

export default class ContextContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            googleClientId: GOOGLE_CLIENT_ID,
            realmAppId: REALM_APP_ID,
            appName: APP_NAME,
            copyrightLink: COPYRIGHT_LINK,
            app: new Realm.App(REALM_APP_ID),
            user: null,
            dbCollection: null,
            fcstCollection: null,
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
            setUser: this.setUser,
            googleSignIn: this.googleSignIn,
            googleHandleRedirect: this.googleHandleRedirect,
            getUserAccessToken: this.getUserAccessToken,
            logOut: this.logOut,
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
            getActiveUserFilter: this.getActiveUserFilter
        };

        this.lastUpdateTime = null;
        this.watcherTimerId = null;
    };

    async componentDidMount() {
        await this.watchForUpdates();
    };

    componentWillUnmount() {
        clearTimeout(this.watcherTimerId);
    }

    setUser = (user) => {
        this.setState({user});
        if (this.state.app && user) {
            this.setFilter({
                active_user_filter: {
                    name: user.profile.name,
                    email: user.profile.email
                }
            });
            const dbCollection = user
                .mongoClient(REALM_SERVICE_NAME)
                .db(REALM_DATABASE_NAME)
                .collection(REALM_COLLECTION_NAME);
            this.setState({dbCollection});
            const fcstCollection = user
                .mongoClient(REALM_SERVICE_NAME)
                .db(REALM_DATABASE_NAME)
                .collection(REALM_FCST_COLLECTION_NAME);
            this.setState({fcstCollection});
        }
    };

    googleHandleRedirect = async () => {
        Realm.handleAuthRedirect();
    };

    googleSignIn = async () => {
        const credentials = Realm.Credentials.google(GOOGLE_REDIRECT_URI);
        try {
            const user = await this.state.app.logIn(credentials);
            this.setUser(user);
        } catch (err) {
            console.error(err);
        }
    };

    getUserAccessToken = async () => {
        await this.state.app.currentUser.refreshCustomData();
        return this.state.app.currentUser.accessToken;
    };

    fetchFiltersDefaultValues = async () => {
        if (this.state.user) {
            const {getFiltersDefaultValues} = this.state.user.functions;
            const fetchedData = await getFiltersDefaultValues();
            this.setState(
                {
                    regionsList: fetchedData.regions.sort() || [],
                    ownersList: fetchedData.owners.sort() || [],
                    projectManagersList: fetchedData.projectManagers.sort() || []
                }
            );
        }
    }

    setLoadProcessing = loadProcessing => {
        this.setState({loadProcessing});
    }

    setMoreProjectsLoadProcessing = moreProjectsLoadProcessing => {
        this.setState({moreProjectsLoadProcessing});
    }

    setProjects = projects => {
        this.setState({projects});
    }

    setHasMoreProjects = hasMoreProjects => {
        this.setState({hasMoreProjects});
    }

    getSortOrder = () => {
        const {field, order} = this.state.sort;
        return {field, order: order === 'DESC' ? -1 : 1};
    }

    fetchProjectsTotalCount = async () => {
        const {user, filter} = this.state;
        const {findProjects} = user.functions;
        const fetchedData = await findProjects({
            filter,
            sort: this.getSortOrder(),
            count_only: true
        });
        if (fetchedData && fetchedData.length) {
            const {name: projectsTotalCount} = fetchedData[0];
            this.setState({projectsTotalCount});
        }
    }

    getSortOrder = () => {
        const {sort} = this.state;
        const {field, order} = sort;

        return {field, order: order === 'DESC' ? -1 : 1};
    }

    cleanLocalProjects = async () => {
        this.setState({
            projects: [],
            projectWithCurrentMilestone: null,
            projectsTotalCount: 0
        });
    }

    logOut = async () => {
        await this.state.app.currentUser.logOut();
        this.setUser(this.state.app.currentUser);
    }

    setFilter = (newFilter) => {
        const filter = {...this.state.filter, ...newFilter};
        this.setState({filter});
    }

    setSorting = (newSort) => {
        newSort.field = sortNameToField(newSort.field);
        this.setState({sort: newSort});
    }

    setPagination = (newPagination) => {
        const pagination = {...this.state.pagination, ...newPagination};
        this.setState({pagination});
    }

    setDefaultPagination = () => {
        this.setState({pagination: DEFAULT_PAGINATION});
    }

    setProjectWithCurrentMilestone = (projectWithCurrentMilestone) => {
        this.setState({projectWithCurrentMilestone})
    }

    setIsEditing = (isEditing) => {
        this.setState({isEditing});
    }

    watchForUpdates = async () => {
        if (this.watcherTimerId) clearTimeout(this.watcherTimerId);
        await this.watcher();
        this.watcherTimerId = setTimeout(
            this.watchForUpdates,
            WATCHER_TIMEOUT
        );
    } 

    watcher = async () => {
        const {dbCollection, user, app} = this.state;
        if (!dbCollection || !user || !app.currentUser) return;

        let {
            projects, projectWithCurrentMilestone,
            hasMoreProjects, pagination
        } = this.state;

        // Action on update or replace event
        const onUpdateOperation = (updatedDocument) => {
            const {_id} = updatedDocument;
            let wasProjectUpdated = false;
            projects = projects.map(project => {
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
                    this.setProjectWithCurrentMilestone({
                        ...projectWithCurrentMilestone,
                        project: updatedDocument
                    });
                }
            }
        };

        // Action on insert event
        const onInsertOperation = async (insertedDocument) => {
            await this.fetchProjectsTotalCount();
            if (hasMoreProjects) return;
            const {limit} = pagination;
            const isFullPage = !Boolean(projects.length % limit);
            if (isFullPage) {
                this.setHasMoreProjects(true);
                return;
            }
            projects.push(insertedDocument);
        }

        for await (let event of this.state.dbCollection.watch()) {
            const {clusterTime, operationType, fullDocument} = event;

            if (
                (!this.lastUpdateTime || this.lastUpdateTime < clusterTime) &&
                fullDocument
            ) {
                this.lastUpdateTime = clusterTime;
                switch(operationType) {
                    case 'replace':
                    case 'update':
                        onUpdateOperation(fullDocument);
                        break;
                    case 'insert':
                        onInsertOperation(fullDocument);
                        break;
                    default:
                        break;
                };
            }
        }
    }

    getActiveUserFilter = () => {
        const {profile} = this.state.user;
        return {
            email: profile.email, 
            name: profile.name
        };
    }

    render() {
        return (
            <RealmContext.Provider value={{...this.state, ...this.funcs}}>
                {this.props.children}
            </RealmContext.Provider>
        )
    }
}

export { RealmContext };
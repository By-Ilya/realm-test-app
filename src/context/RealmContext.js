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
    pm_stage: ''
}
const DEFAULT_SORT = {
    field: 'details.pm_stage_sortid',
    order: 'ASC'
};
const DEFAULT_PAGINATION = {
    increaseOn: DEFAULT_PAGE_LIMIT,
    limit: DEFAULT_PAGE_LIMIT
}

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
            stagesList: ["-None-","Not Started","Planning","In Progress","On Hold","Cancelled","Closed"],
            loadProcessing: false,
            moreProjectsLoadProcessing: false,
            projects: null,
            projectsTotalCount: 0,
            hasMoreProjects: true,
            projectWithCurrentMilestone: null,
            isEditing: false
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
            setProjectsTotalCount: this.setProjectsTotalCount,
            cleanLocalProjects: this.cleanLocalProjects,
            setFilter: this.setFilter,
            setSorting: this.setSorting,
            setPagination: this.setPagination,
            setDefaultPagination: this.setDefaultPagination,
            setProjectWithCurrentMilestone: this.setProjectWithCurrentMilestone,
            setIsEditing: this.setIsEditing,
            watcher: this.watcher,
            getActiveUserFilter: this.getActiveUserFilter
        };

        this.lastUpdateTime = null;
    };

    setUser = (user) => {
        this.setState({user});
        if (this.state.app && user) {
            this.setFilter({active_user_filter: {name: user.profile.name, email: user.profile.email}});
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

    // TODO: deprecated functionality
    // anonymousSignIn = async () => {
    //     const credentials = Realm.Credentials.anonymous();
    //     try {
    //         const user = await this.state.app.logIn(credentials);
    //         this.setUser(user);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

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

    // TODO: deprecated functionality
    // onGoogleSuccessSignIn = (response) => {
    //     const credentials = Realm.Credentials.google(response.code);
    //     this.state.app.logIn(credentials).then(user => {
    //         console.log(`Logged in with id: ${user.id}`);
    //         this.setUser(user);
    //     }).catch(err => {
    //         console.error('onGoogleSuccessSignIn:', err);
    //     });
    // };

    // onGoogleSignInFailure = (response) => {
    //     console.error('onGoogleSignInFailure:', response);
    // }

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

    setProjectsTotalCount = async () => {
        const {findProjects} = this.state.user.functions;
        const fetchedData = await findProjects({filter: this.state.filter,count_only: true});
        if (fetchedData && fetchedData.length) {
            const {name: projectsTotalCount} = fetchedData[0];
            this.setState({projectsTotalCount});
        }
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

    watcher = async () => {
        if (!this.state.dbCollection) return;
        if (!this.state.user || !this.state.app.currentUser) return;

        for await (let event of this.state.dbCollection.watch()) {
            const {clusterTime, operationType, fullDocument} = event;

            if (
                (!this.lastUpdateTime || this.lastUpdateTime < clusterTime) &&
                fullDocument
            ) {
                this.lastUpdateTime = clusterTime;

                let {projects, projectWithCurrentMilestone, hasMoreProjects, pagination} = this.state;
                let newProjectWithMilestone = null;

                if (operationType === 'replace' || operationType === 'update') {
                    const {_id} = event.fullDocument;
                    projects = projects.map(
                        p => (p._id === _id) ? event.fullDocument : p
                    );
                    if (projectWithCurrentMilestone && projectWithCurrentMilestone.project._id === _id)
                        newProjectWithMilestone = {...projectWithCurrentMilestone,project: event.fullDocument}

                } else if (operationType === 'insert') {
                    if (hasMoreProjects) return;
                    const {limit} = pagination;
                    const isFullPage = !Boolean(projects.length % limit);
                    isFullPage
                        ? this.setState({hasMoreProjects: true})
                        : projects.push(event.fullDocument);
                }

                this.setState({projects});
                if (newProjectWithMilestone)
                    this.setProjectWithCurrentMilestone(newProjectWithMilestone);
            }
        }
    }

    getActiveUserFilter = () => {
        return {email: this.state.user.profile.email, name: this.state.user.profile.name};
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
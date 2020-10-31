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
const GOOGLE_REDIRECT_URI = `${process.env.REACT_APP_GOOGLE_REDIRECT_URI}` ||'http://localhost:3000/google-callback';

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
            filter: {region: '', owner: '', project_manager: '', name: '', active: true, active_user_filter: ''},
            sort: {field: 'name', order: 'ASC'},
            regionsList: [],
            ownersList: [],
            projectManagersList: [],
            loadProcessing: false,
            projects: null,
            projectWithCurrentMilestone: null,
            isEditing: false
        };
        this.funcs = {
            setUser: this.setUser,
            setClient: this.setClient,
            anonymousSignIn: this.anonymousSignIn,
            googleSignIn: this.googleSignIn,
            googleHandleRedirect: this.googleHandleRedirect,
            onGoogleSuccessSignIn: this.onGoogleSuccessSignIn,
            onGoogleSignInFailure: this.onGoogleSignInFailure,
            getUserAccessToken: this.getUserAccessToken,
            logOut: this.logOut,
            fetchFiltersDefaultValues: this.fetchFiltersDefaultValues,
            setLoadProcessing: this.setLoadProcessing,
            setProjects: this.setProjects,
            cleanLocalProjects: this.cleanLocalProjects,
            setFilter: this.setFilter,
            setSorting: this.setSorting,
            setProjectWithCurrentMilestone: this.setProjectWithCurrentMilestone,
            setIsEditing: this.setIsEditing,
            watcher: this.watcher,
            getActiveUserName: this.getActiveUserName
        };

        this.lastUpdateTime = null;
    };

    setUser = (user) => {
        this.setState({user});
        if (this.state.app && user) {
            this.setFilter({active_user_filter : user.profile.email})
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

    anonymousSignIn = async () => {
        const credentials = Realm.Credentials.anonymous();
        try {
            const user = await this.state.app.logIn(credentials);
            this.setUser(user);
        } catch (err) {
            console.error(err);
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

    onGoogleSuccessSignIn = (response) => {
        const credentials = Realm.Credentials.google(response.code);
        this.state.app.logIn(credentials).then(user => {
            console.log(`Logged in with id: ${user.id}`);
            this.setUser(user);
        }).catch(err => {
            console.error('onGoogleSuccessSignIn:', err);
        });
    };

    onGoogleSignInFailure = (response) => {
        console.error('onGoogleSignInFailure:', response);
    }

    getUserAccessToken = async () => {
        await this.state.app.currentUser.refreshCustomData();
        return this.state.app.currentUser.accessToken;
    };

    fetchFiltersDefaultValues = async () => {
        if (this.state.user) {
            const fetchedData = await this.state.user.functions.getFiltersDefaultValues();
            this.setState(
                {
                    regionsList: fetchedData.regions.sort() || [],
                    ownersList: fetchedData.owners.sort() || [],
                    projectManagersList: fetchedData.projectManagers.sort() || [],
                }
            );
        }
    }

    setLoadProcessing = loadProcessing => {
        this.setState({loadProcessing});
    }

    setProjects = projects => {
        this.setState({projects});
    }

    cleanLocalProjects = async () => {
        this.setState({projects: [], projectWithCurrentMilestone: null});
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
        this.setState({sort: newSort});
    }

    setProjectWithCurrentMilestone = (projectWithCurrentMilestone) => {
        this.setState({projectWithCurrentMilestone})
    }

    setIsEditing = (isEditing) => {
        this.setState({isEditing});
    }

    watcher = async () => {
        if (!this.state.dbCollection) return;
        if (!this.state.user || !this.state.app.currentUser.isLoggedIn) return;

        for await (let event of this.state.dbCollection.watch()) {
            const {clusterTime, operationType, fullDocument} = event;

            if (
                (!this.lastUpdateTime || this.lastUpdateTime < clusterTime) &&
                fullDocument
            ) {
                this.lastUpdateTime = clusterTime;
                let {projects} = this.state;

                if (operationType === 'replace' || operationType === 'update') {
                    const {_id} = event.fullDocument;
                    projects = projects.map(
                        p => (p._id === _id) ? event.fullDocument : p
                    );
                } else if (operationType === 'insert') {
                    projects.push(event.fullDocument);
                }

                this.setState({projects});
            }
        }
    }

    getActiveUserName = () => {
        return this.state.user.profile.email;
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
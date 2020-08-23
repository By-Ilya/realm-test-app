import React from 'react';
import * as Realm from "realm-web";

const RealmContext = React.createContext('realm');

require('dotenv').config();

const GOOGLE_CLIENT_ID = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}` || '';
const APP_NAME = `${process.env.REACT_APP_NAME}` || 'Realm Test App';
const COPYRIGHT_LINK = `${process.env.REACT_APP_COPYRIGHT_LINK}` || 'http://localhost:3000';
const REALM_APP_ID = `${process.env.REACT_APP_REALM_APP_ID}` || '';

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
            client: null,
            filter: {region: '', owner: '', project_manager: '', name: ''},
            sort: {field: 'name', order: 'ASC'},
            regionsList: [],
            ownersList: [],
            projectManagersList: [],
            loadProcessing: false,
            projects: null,
            projectWithCurrentMilestone: null
        };
        this.funcs = {
            setUser: this.setUser,
            setClient: this.setClient,
            anonymousSignIn: this.anonymousSignIn,
            onGoogleSuccessSignIn: this.onGoogleSuccessSignIn,
            onGoogleSignInFailure: this.onGoogleSignInFailure,
            getUserAccessToken: this.getUserAccessToken,
            logOut: this.logOut,
            fetchFiltersDefaultValues: this.fetchFiltersDefaultValues,
            setLoadProcessing: this.setLoadProcessing,
            setProjects: this.setProjects,
            setFilter: this.setFilter,
            setSorting: this.setSorting,
            setProjectWithCurrentMilestone: this.setProjectWithCurrentMilestone
        }
    };

    setUser = (user) => {
        this.setState({user});
    };

    setClient = (client) => {
        this.setState({client});
    }

    anonymousSignIn = async () => {
        const credentials = Realm.Credentials.anonymous();
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
            console.error(err);
        });
    };

    onGoogleSignInFailure = (response) => {
        console.error('Google OAuth:', response);
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
        console.log('setProjects:', projects);
        this.setState({projects});
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

    render() {
        return (
            <RealmContext.Provider value={{...this.state, ...this.funcs}}>
                {this.props.children}
            </RealmContext.Provider>
        )
    }
}

export { RealmContext };
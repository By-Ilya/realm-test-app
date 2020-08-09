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
            filter: {region: ''},
            regionsList: [],
            loadProcessing: false,
            projects: null,
            projectWithCurrentMilestone: null
        };
        this.funcs = {
            setUser: this.setUser,
            anonymousSignIn: this.anonymousSignIn,
            onGoogleSuccessSignIn: this.onGoogleSuccessSignIn,
            onGoogleSignInFailure: this.onGoogleSignInFailure,
            getUserAccessToken: this.getUserAccessToken,
            logOut: this.logOut,
            fetchRegionsList: this.fetchRegionsList,
            setLoadProcessing: this.setLoadProcessing,
            setProjects: this.setProjects,
            setFilter: this.setFilter,
            setProjectWithCurrentMilestone: this.setProjectWithCurrentMilestone
        }
    };

    setUser = (user) => {
        this.setState({user});
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

    onGoogleSuccessSignIn = (response) => {
        const credentials = Realm.Credentials.google(response.accessToken);
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

    fetchRegionsList = async () => {
        if (this.state.user) {
            const fetchedRegions = await this.state.user.functions.getRegionsList();
            this.setState({regionsList: fetchedRegions.regions || []});
        }
    }

    setLoadProcessing = loadProcessing => {
        this.setState({loadProcessing});
    }

    setProjects = projects => {
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
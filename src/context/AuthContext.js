import React from 'react';
import * as Realm from 'realm-web';

import { SIGN_IN_ERROR, PAGES } from 'helpers/constants/common';

const AuthContext = React.createContext('auth');

require('dotenv').config();

const GOOGLE_CLIENT_ID = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}` || '';
const APP_NAME = `${process.env.REACT_APP_NAME}` || 'Shadowforce';
const COPYRIGHT_LINK = `${process.env.REACT_APP_COPYRIGHT_LINK}` || 'http://localhost:3000';
const REALM_APP_ID = `${process.env.REACT_APP_REALM_APP_ID}` || '';
const REALM_SERVICE_NAME = `${process.env.REACT_APP_SERVICE_NAME}` || 'mongodb-atlas';
const REALM_DATABASE_NAME = `${process.env.REACT_APP_DATABASE_NAME}` || '';
const REALM_COLLECTION_NAME = `${process.env.REACT_APP_COLLECTION_NAME}` || '';
const REALM_OPPORTUNITY_COLLECTION_NAME = `${process.env.REACT_APP_OPPORTUNITY_COLLECTION_NAME}` || '';
const REALM_FCST_COLLECTION_NAME = `${process.env.REACT_APP_FCST_COLLECTION_NAME}` || '';
const GOOGLE_REDIRECT_URI = `${process.env.REACT_APP_GOOGLE_REDIRECT_URI}` || 'http://localhost:3000/google-callback';

const DEFAULT_LOCAL_STORAGE_KEYS = Object.freeze({
    activePage: 'activePage',
    projectFilter: 'projectFilter',
    projectSort: 'projectSort',
    opportunityFilter: 'opportunityFilter',
    opportunitySort: 'opportunitySort',
    opportunityHiddenColumns: 'opportunityHiddenColumns',
    ceMode: 'ceMode',
});

export default class ContextContainer extends React.Component {
    constructor(props) {
        super(props);
        const { activePage, ceMode } = DEFAULT_LOCAL_STORAGE_KEYS;
        const localActivePage = localStorage.getItem(activePage);
        const localCeMode = localStorage.getItem(ceMode);
        this.state = {
            ...this.state,
            googleClientId: GOOGLE_CLIENT_ID,
            realmAppId: REALM_APP_ID,
            appName: APP_NAME,
            copyrightLink: COPYRIGHT_LINK,
            app: new Realm.App(REALM_APP_ID),
            errorInfo: null,
            user: null,
            dbCollection: null,
            opportunityCollection: null,
            fcstCollection: null,
            activePage: localActivePage || PAGES.projects,
            ceMode: localCeMode ? localCeMode : false,
            localStorageKeys: DEFAULT_LOCAL_STORAGE_KEYS,
        };
        this.funcs = {
            setLocalStorageValue: this.setLocalStorageValue,
            setUser: this.setUser,
            googleSignIn: this.googleSignIn,
            googleHandleRedirect: this.googleHandleRedirect,
            getUserAccessToken: this.getUserAccessToken,
            setErrorInfo: this.setErrorInfo,
            setActivePage: this.setActivePage,
            getActiveUserFilter: this.getActiveUserFilter,
            logOut: this.logOut,
            toggleCEMode: this.toggleCEMode
        };
    }

    setLocalStorageValue = (key, value) => {
        const { localStorageKeys } = this.state;
        if (!Object.prototype.hasOwnProperty.call(localStorageKeys, key)) {
            return;
        }
        localStorage.setItem(key, value);
    }

    setUser = (user) => {
        this.setState({ user });
        const { app } = this.state;
        if (app && user) {
            const db = user
                .mongoClient(REALM_SERVICE_NAME)
                .db(REALM_DATABASE_NAME);
            const dbCollection = db.collection(REALM_COLLECTION_NAME);
            const opportunityCollection = db.collection(REALM_OPPORTUNITY_COLLECTION_NAME);
            const fcstCollection = db.collection(REALM_FCST_COLLECTION_NAME);
            this.setState({
                dbCollection,
                opportunityCollection,
                fcstCollection,
            });
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
            this.setErrorInfo(SIGN_IN_ERROR);
        }
    };

    getUserAccessToken = async () => {
        await this.state.app.currentUser.refreshCustomData();
        return this.state.app.currentUser.accessToken;
    };

    setErrorInfo = (errorInfo) => {
        this.setState({ errorInfo });
    }

    isSameOrUndefinedPage = (page) => {
        const { activePage } = this.state;
        return !Object.values(PAGES).includes(page) || page === activePage;
    }

    setActivePage = (newActivePage) => {
        if (this.isSameOrUndefinedPage(newActivePage)) {
            return;
        }
        this.setState({ activePage: newActivePage });

        const { localStorageKeys: { activePage } } = this.state;
        localStorage.setItem(activePage, newActivePage);
    }

    getActiveUserFilter = () => {
        const { user } = this.state;

        if (!user) return null;
        const { profile } = user;
        return {
            email: profile.email,
            name: profile.name,
        };
    }

    logOut = async () => {
        const { currentUser } = this.state.app;
        await currentUser.logOut();
        this.setUser(currentUser);
        this.removeLocalData();
    }

    toggleCEMode = () => {
        const { ceMode } = this.state;
        this.setState({ ceMode: !ceMode});
        this.setLocalStorageValue(DEFAULT_LOCAL_STORAGE_KEYS.ceMode, !ceMode);
    }

    removeLocalData() {
        const { localStorageKeys } = this.state;
        Object
            .keys(localStorageKeys)
            .forEach((key) => {
                localStorage.removeItem(key);
            });
    }

    render() {
        return (
            <AuthContext.Provider value={{ ...this.state, ...this.funcs }}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export { AuthContext };

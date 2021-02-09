import React from 'react';
import * as Realm from 'realm-web';

import SIGN_IN_ERROR from 'helpers/constants/errorMessages';

const AuthContext = React.createContext('auth');

require('dotenv').config();

const GOOGLE_CLIENT_ID = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}` || '';
const APP_NAME = `${process.env.REACT_APP_NAME}` || 'Shadowforce';
const COPYRIGHT_LINK = `${process.env.REACT_APP_COPYRIGHT_LINK}` || 'http://localhost:3000';
const REALM_APP_ID = `${process.env.REACT_APP_REALM_APP_ID}` || '';
const REALM_SERVICE_NAME = `${process.env.REACT_APP_SERVICE_NAME}` || 'mongodb-atlas';
const REALM_DATABASE_NAME = `${process.env.REACT_APP_DATABASE_NAME}` || '';
const REALM_COLLECTION_NAME = `${process.env.REACT_APP_COLLECTION_NAME}` || '';
const REALM_FCST_COLLECTION_NAME = `${process.env.REACT_APP_FCST_COLLECTION_NAME}` || '';
const GOOGLE_REDIRECT_URI = `${process.env.REACT_APP_GOOGLE_REDIRECT_URI}` || 'http://localhost:3000/google-callback';

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
            errorInfo: null,
            user: null,
            dbCollection: null,
            fcstCollection: null
        };
        this.funcs = {
            setUser: this.setUser,
            googleSignIn: this.googleSignIn,
            googleHandleRedirect: this.googleHandleRedirect,
            getUserAccessToken: this.getUserAccessToken,
            setErrorInfo: this.setErrorInfo,
            logOut: this.logOut,
        };
    }

    setUser = (user) => {
        this.setState({user});
        if (this.state.app && user) {
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
            this.setErrorInfo(SIGN_IN_ERROR);
        }
    };

    getUserAccessToken = async () => {
        await this.state.app.currentUser.refreshCustomData();
        return this.state.app.currentUser.accessToken;
    };

    setErrorInfo = (errorInfo) => {
        this.setState({errorInfo});
    }

    logOut = async () => {
        await this.state.app.currentUser.logOut();
        this.setUser(this.state.app.currentUser);
    }

    render() {
        return (
            <AuthContext.Provider value={{...this.state, ...this.funcs}}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export { AuthContext };
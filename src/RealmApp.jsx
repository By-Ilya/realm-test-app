import React, {useContext, useRef, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {RealmContext} from "./context/RealmContext";
import SignInPage from "./containers/SignInPage";
import RealmApolloProvider from "./RealmApolloProvider";

export default function RealmApp() {
    const {
        app, appName, copyrightLink,
        googleSignIn, googleHandleRedirect,
        user, setUser,
    } = useContext(RealmContext);

    const appRef = useRef(app);

    useEffect(() => {
        try {
            if (app.currentUser)
                app.currentUser.refreshProfile();
            setUser(app.currentUser);
        } catch(err) {
            if (err.statusCode === 401)
                console.log("The user session has been invalidated");
            else
                console.log("Unexpected error", err)
        }
    }, [appRef.current.currentUser]);

    return (
        <Router>
          <Switch>
            <Route
                exact path="/google-callback"
                render={() => {
                    googleHandleRedirect();
                    return <div> Google Callback </div> 
                }}
            />
            <Route path="/*" render={() => 
                user ?  <RealmApolloProvider /> : <SignInPage
                    appName={appName}
                    copyrightLink={copyrightLink}
                    googleSignIn={googleSignIn}
                />
                }/>
          </Switch>
        </Router>
    )
}
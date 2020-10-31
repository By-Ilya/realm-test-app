import React, {useContext, useRef, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {RealmContext} from "./context/RealmContext";
import SignInPage from "./containers/SignInPage";
import RealmApolloProvider from "./RealmApolloProvider";

export default function RealmApp() {
    const {
        app, appName, copyrightLink, googleClientId,
        anonymousSignIn, googleSignIn, googleHandleRedirect, user, setUser,
        onGoogleSuccessSignIn, onGoogleSignInFailure
    } = useContext(RealmContext);

    const appRef = useRef(app);

    useEffect(() => {
        setUser(app.currentUser);
    }, [appRef.current.currentUser]);

    return (
        <Router>
          <Switch>
            <Route exact path="/google-callback" render={() => <div>Google Callback {googleHandleRedirect()}</div> } />
            <Route path="/*" render={() => 
                user ?  <RealmApolloProvider /> : <SignInPage
                    onSuccess={onGoogleSuccessSignIn}
                    appName={appName}
                    copyrightLink={copyrightLink}
                    googleClientId={googleClientId}
                    onFailure={onGoogleSignInFailure}
                    anonymousSignIn={anonymousSignIn}
                    googleSignIn={googleSignIn}
                />
                }/>
          </Switch>
        </Router>
    )
}
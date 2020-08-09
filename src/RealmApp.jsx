import React, {useContext, useRef, useEffect} from "react";

import {RealmContext} from "./context/RealmContext";
import SignInPage from "./containers/SignInPage";
import RealmApolloProvider from "./RealmApolloProvider";

export default function RealmApp() {
    const {
        app, appName, copyrightLink, googleClientId,
        anonymousSignIn, user, setUser,
        onGoogleSuccessSignIn, onGoogleSignInFailure
    } = useContext(RealmContext);

    const appRef = useRef(app);

    useEffect(() => {
        setUser(app.currentUser)
    }, [appRef.current.currentUser]);

    return (
        <>
            {!user && <SignInPage
                onSuccess={onGoogleSuccessSignIn}
                appName={appName}
                copyrightLink={copyrightLink}
                googleClientId={googleClientId}
                onFailure={onGoogleSignInFailure}
                anonymousSignIn={anonymousSignIn}
            />}
            {user && <RealmApolloProvider />}
        </>
    )
}
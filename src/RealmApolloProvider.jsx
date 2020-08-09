import React, {useContext} from 'react';
import {
    ApolloProvider,
    ApolloClient,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";

import {RealmContext} from "./context/RealmContext";
import MainPage from "./containers/MainPage";

export default function RealmApolloProvider() {
    const {
        realmAppId, user,
        getUserAccessToken
    } = useContext(RealmContext);

    const client = createApolloClient(realmAppId, user, getUserAccessToken);

    return (
        <ApolloProvider client={client}>
            <MainPage />
        </ApolloProvider>
    )
}

function createApolloClient(realmAppId, user, getUserAccessToken) {
    const graphQlUrl = `https://realm.mongodb.com/api/client/v2.0/app/${realmAppId}/graphql`;

    return new ApolloClient({
        link: new HttpLink({
            uri: graphQlUrl,
            fetch: async (uri, options) => {
                const accessToken = await getUserAccessToken();
                options.headers.Authorization = `Bearer ${accessToken}`;
                return fetch(uri, options);
            },
        }),
        cache: new InMemoryCache()
    });
}
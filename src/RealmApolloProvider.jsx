import React, { useContext, useEffect, useState } from 'react';
import {
    ApolloProvider,
    ApolloClient,
    HttpLink,
    InMemoryCache,
} from '@apollo/client';

import { AuthContext } from 'context/AuthContext';
import MainPage from 'containers/MainPage';

function createApolloClient(realmAppId, getUserAccessToken) {
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
        cache: new InMemoryCache(),
    });
}

export default function RealmApolloProvider() {
    const {
        realmAppId,
        getUserAccessToken,
        user,
    } = useContext(AuthContext);

    const [client, setClient] = useState(createApolloClient(realmAppId, getUserAccessToken));
    useEffect(() => {
        setClient(
            createApolloClient(realmAppId, getUserAccessToken),
        );
    }, [user]);

    return (
        <ApolloProvider client={client}>
            <MainPage />
        </ApolloProvider>
    );
}

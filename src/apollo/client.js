import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const Client = new ApolloClient({
    link: new HttpLink({
        uri: '/.netlify/functions/bookmark',
        fetch,
    }),
    cache: new InMemoryCache()
});
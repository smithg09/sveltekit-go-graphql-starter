import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

// Build API base, allowing prod to set PUBLIC_API_URL. Trim trailing slash to avoid duplicates.
const apiBase = env.PUBLIC_API_URL?.replace(/\/$/, '');
const apiPath = '/query';
const apiUri = apiBase ? `${apiBase}${apiPath}` : `/api${apiPath}`;

// GraphQL endpoint - using SvelteKit server hooks proxy
const httpLink = new HttpLink({
	uri: apiUri,
	credentials: 'same-origin'
});

// Apollo Client instance
export const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					listPosts: {
						keyArgs: ['where', ['category', 'status']],
						merge(_, incoming) {
							return incoming;
						}
					},
					listCategories: {
						keyArgs: ['where', ['status']],
						merge(_, incoming) {
							return incoming;
						}
					}
				}
			}
		}
	}),
	devtools: {
		enabled: browser && import.meta.env.DEV
	},
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network'
		}
	}
});

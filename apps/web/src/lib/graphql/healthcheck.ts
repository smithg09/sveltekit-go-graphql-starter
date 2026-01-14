import { gql } from '@apollo/client/core';

export const HEATHCHECK_PING = gql`
	query Ping {
		ping
	}
`;

import Relay from 'react-relay';

export default class GrantGoogleMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                grantGoogle
            }
        `;
    }

    getVariables() {
        return {
            accessToken: this.props.accessToken
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on GrantGooglePayload {
                token
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on GrantGooglePayload {
                        token
                    }
                `
            ]
        }];
    }
}

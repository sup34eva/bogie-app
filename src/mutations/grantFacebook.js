import Relay from 'react-relay';

export default class GrantFacebookMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                grantFacebook
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
            fragment on GrantFacebookPayload {
                token
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on GrantFacebookPayload {
                        token
                    }
                `
            ]
        }];
    }
}

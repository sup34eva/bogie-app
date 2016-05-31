import Relay from 'react-relay';

export default class RegisterMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                grantPassword
            }
        `;
    }

    getVariables() {
        return {
            username: this.props.username,
            password: this.props.password,
            scope: 'query mutation',
            clientId: 'f7eaa832-c154-4436-866b-8331e93b0377',
            clientSecret: 'victoria'
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on GrantPasswordPayload {
                token
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on GrantPasswordPayload {
                        token
                    }
                `
            ]
        }];
    }
}

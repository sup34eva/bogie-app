import Relay from 'react-relay';

export default class GrantPasswordMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                grantPassword
            }
        `;
    }

    getVariables() {
        return {
            email: this.props.email,
            password: this.props.password,
            scope: 'query mutation'
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

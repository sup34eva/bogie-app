import Relay from 'react-relay';

export default class RegisterMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                register
            }
        `;
    }

    getVariables() {
        return {
            email: this.props.email,
            password: this.props.password
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on RegisterPayload {
                user
            }
        `;
    }

    getConfigs() {
        return [];
    }
}

import Relay from 'react-relay';

export default class EditPassword extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                editPassword
            }
        `;
    }

    getVariables() {
        return {
            currentPassword: this.props.currentPassword,
            newPassword : this.props.newPassword,
            token: this.props.token
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on EditPasswordPayload {
               user
            }
        `;
    }

    getConfigs() {
        return [];
    }
}

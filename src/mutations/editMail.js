import Relay from 'react-relay';

export default class EditMail extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                editMail
            }
        `;
    }

    getVariables() {
        return {
            email: this.props.email,
            token: this.props.token
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on EditEmailPayload {
                token
                user
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on EditEmailPayload {
                        token
                        user
                    }
                `
            ]
        }];
    }
}

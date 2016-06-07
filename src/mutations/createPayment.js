import Relay from 'react-relay';

export default class CreatePaymentMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                createPayment
            }
        `;
    }

    getVariables() {
        return {
            accessToken: this.props.accessToken,
            returnUrl: this.props.returnUrl,
            cancelUrl: this.props.cancelUrl,
            clientId: this.props.clientId,
            clientSecret: this.props.clientSecret
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on CreatePaymentPayload {
                payment
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on CreatePaymentPayload {
                        payment {
                            id
                            link
                        }
                    }
                `
            ]
        }];
    }
}

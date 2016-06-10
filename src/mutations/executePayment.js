import Relay from 'react-relay';

export default class ExecutePaymentMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`
            mutation {
                executePayment
            }
        `;
    }

    getVariables() {
        return {
            payment: this.props.payment,
            payer: this.props.payer,
            clientId: this.props.clientId,
            clientSecret: this.props.clientSecret
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on ExecutePaymentPayload {
                receipt
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [
                Relay.QL`
                    fragment on ExecutePaymentPayload {
                        receipt
                    }
                `
            ]
        }];
    }
}

import Relay from 'react-relay';

import CreatePaymentMutation from './mutations/createPayment';
import ExecutePaymentMutation from './mutations/executePayment';

export function popup(req, res) {
    Relay.Store.commitUpdate(new CreatePaymentMutation({
        accessToken: req.cookies.token,
        returnUrl: `${req.protocol}://${req.get('host')}/payment/complete`,
        cancelUrl: `${req.protocol}://${req.get('host')}/payment/cancel`,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    }), {
        onSuccess: ({createPayment: {payment}}) => {
            console.log('onSuccess', payment.id);
            res.redirect(payment.link);
        },
        onFailure: transaction => {
            const err = transaction.getError();
            console.error('onFailure', err.message, err.stack);
            res.status(500).end();
        }
    });
}

export function complete(req, res) {
    console.log(req.query);
}

export function cancel(req, res) {
    //
}

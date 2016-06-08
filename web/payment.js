import Relay from 'react-relay';

import CreatePayment from './mutations/createPayment';
import ExecutePayment from './mutations/executePayment';

export function popup(req, res) {
    Relay.Store.commitUpdate(new CreatePayment({
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
            // TODO: Close popup
        }
    });
}

export function complete(req, res) {
    Relay.Store.commitUpdate(new ExecutePayment({
        payment: req.query.paymentId,
        payer: req.query.PayerID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    }), {
        onSuccess: ({createPayment: {payment}}) => {
            console.log('onSuccess', payment.id);
            res.redirect(payment.link);
            // TODO: Close popup
        },
        onFailure: transaction => {
            const err = transaction.getError();
            console.error('onFailure', err.message, err.stack);
            res.status(500).end();
            // TODO: Close popup
        }
    });
}

export function cancel() {
    // TODO: Close popup
}

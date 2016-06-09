import Relay from 'react-relay';

import CreatePayment from './mutations/createPayment';
import ExecutePayment from './mutations/executePayment';

export function popup(req, res) {
    Relay.Store.commitUpdate(new CreatePayment({
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
            console.error(err.message);
            res.status(500).end(`
                <script>window.opener.onPayment('Creation error')</script>
            `);
        }
    });
}

export function complete(req, res) {
    Relay.Store.commitUpdate(new ExecutePayment({
        accessToken: req.cookies.token,
        payment: req.query.paymentId,
        payer: req.query.PayerID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    }), {
        onSuccess: ({createPayment: {payment}}) => {
            console.log('onSuccess', payment.id);
            res.status(500).end(`
                <script>window.opener.onPayment(null, '${payment.id}')</script>
            `);
        },
        onFailure: transaction => {
            const err = transaction.getError();
            console.error('onFailure', err.message, err.stack);
            res.status(500).end(`
                <script>window.opener.onPayment('Completion error')</script>
            `);
        }
    });
}

export function cancel(req, res) {
    res.status(500).end(`
        <script>window.opener.onPayment('Canceled')</script>
    `);
}

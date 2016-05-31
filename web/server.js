import 'babel-polyfill';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import './patchRequire';
import relay from './relay';

const app = express();

if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

app.use(cookieParser());

app.get('*', relay);

app.use(bodyParser.json());

app.use('/graphql', (req, res) => {
    const {query, variables} = req.body;
    if (query.startsWith('mutation')) {
        Object.keys(variables).forEach(key => {
            if (key.startsWith('input_')) {
                variables[key] = {
                    ...variables[key],
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET
                };
            }
        });
    }

    delete req.headers['content-length'];

    const preq = http.request({
        host: process.env.BACKEND_HOST,
        port: process.env.BACKEND_PORT,
        path: '/graphql',
        method: req.method,
        headers: req.headers
    }, pres => {
        pres.setEncoding('utf8');

        pres.on('data', chunk => {
            res.write(chunk);
        });

        pres.on('close', () => {
            res.status(pres.statusCode).end();
        });

        pres.on('end', () => {
            res.status(pres.statusCode).end();
        });
    }).on('error', err => {
        console.error(err.stack);
        res.status(500).end(err.message);
    });

    preq.end(JSON.stringify({
        query, variables
    }));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

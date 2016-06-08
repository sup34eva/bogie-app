import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactNativeApp from 'react-native-web/dist/apis/AppRegistry/ReactNativeApp';
import {
    StyleSheet
} from 'react-native';
import {
    createLocation
} from 'history';
import {
    match
} from 'react-router';

import IsomorphicRouter from 'isomorphic-relay-router';
import Relay from 'react-relay';

import Helmet from 'react-helmet';
import cookie from 'react-cookie';

import routes from './router';

const networkLayer = new Relay.DefaultNetworkLayer(`http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/graphql`);
Relay.injectNetworkLayer(networkLayer);

export default (req, res) => {
    cookie.plugToRequest(req, res);

    match({
        location: createLocation(req.url),
        routes
    }, async (error, redirectLocation, renderProps) => {
        try {
            if (error) {
                throw error;
            } else if (redirectLocation) {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
                const {data, props} = await IsomorphicRouter.prepareData(renderProps, networkLayer);
                const component = IsomorphicRouter.render({
                    ...props,
                    params: {
                        ...props.params,
                        data
                    },
                    data
                });

                StyleSheet.renderToString();
                const reactOutput = ReactDOMServer.renderToString(
                    <ReactNativeApp
                        rootComponent={component.type}
                        initialProps={component.props} />
                );

                const head = Helmet.rewind();
                res.status(200).send(`
                    <!DOCTYPE html>
                    <html ${head.htmlAttributes.toString()}>
                        <head>
                            ${head.title.toString()}
                            ${head.meta.toString()}
                            ${head.link.toString()}
                            ${head.style.toString()}
                        </head>
                        <body>
                            <main>${reactOutput}</main>
                            ${head.script.toString()}
                        </body>
                    </html>
                `);
            } else {
                res.status(404).send('Not Found');
            }
        } catch (err) {
            console.error(err.stack);
            res.status(500).send(err.message);
        }
    });
};

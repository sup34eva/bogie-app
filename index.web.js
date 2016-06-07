import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import IsomorphicRelay from 'isomorphic-relay';
import ReactNativeApp from 'react-native-web/dist/apis/AppRegistry/ReactNativeApp';
import {
    StyleSheet
} from 'react-native';
import {
    AppContainer
} from 'react-hot-loader';
import {
    browserHistory
} from 'react-router';
import {
    match,
    Router
} from 'react-router';

import router from './web/router';

function renderApp(routes) {
    match({
        routes,
        history: browserHistory
    }, async (error, redirectLocation, renderProps) => {
        const environment = new Relay.Environment();
        environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'));

        const data = JSON.parse(document.getElementById('preloadedData').textContent);
        IsomorphicRelay.injectPreparedData(environment, data);

        const rootTag = document.querySelector('main');
        const styleElement = document.getElementById(StyleSheet.elementId);
        const styleSheet = StyleSheet.renderToString();
        if (!styleElement) {
            rootTag.insertAdjacentHTML('beforebegin', `<style id="${StyleSheet.elementId}">${styleSheet}</style>`);
        }

        const props = await IsomorphicRouter.prepareInitialRender(environment, renderProps);
        ReactDOM.render(
            <ReactNativeApp
                rootComponent={AppContainer}
                initialProps={{
                    children: <Router {...props} />
                }}
                rootTag={rootTag} />
        , rootTag);
    });
}

renderApp(router);
if (module.hot) {
    module.hot.accept('./web/router', () => {
        renderApp(require('./web/router').default);
    });
}

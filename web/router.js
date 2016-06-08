import React from 'react';
import Relay from 'react-relay';
import cookie from 'react-cookie';
import {
    RelayRouter
} from 'react-router-relay';
import {
    Route,
    IndexRoute,
    createRoutes
} from 'react-router';

import App from './app';
import TrainList from './components/trainList';
import ConnectionPage from './components/connectionPage';
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import About from './components/about';

const rootQuery = {
    viewer: () => Relay.QL`
        query {
            viewer
        }
    `
};

function ensureLogin({location}, replace) {
    if (!cookie.load('token')) {
        replace('/login');
    }
}
function prepareToken(params) {
    return {
        ...params,
        token: cookie.load('token')
    };
}
const tokenQuery = {
    viewer: () => Relay.QL`
        query {
            viewer(token: $token)
        }
    `
};

export default createRoutes(
    <RelayRouter>
        <Route path="/" component={App}>
            <IndexRoute title="Trains List" onEnter={ensureLogin} component={TrainList} prepareParams={prepareToken} queries={tokenQuery} />
            <Route component={ConnectionPage}>
                <Route path="/login" title="Login" component={LoginForm} />
                <Route path="/register" title="Register" component={RegisterForm} queries={rootQuery} />
            </Route>
            <Route path="/about" title="About" component={About} />
            <Route path="/logout" onEnter={({location}, replace) => {
                cookie.remove('token');
                replace('/login');
            }} />
        </Route>
    </RelayRouter>
);

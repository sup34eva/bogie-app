import React from 'react';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Link,
    routerShape
} from 'react-router';

const cdnUrl = `${process.env.CDN_URL}${(process.env.HEROKU_SLUG_COMMIT ? `/${process.env.HEROKU_SLUG_COMMIT}` : '')}`;

const styles = StyleSheet.create({
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        boxShadow: '0 -1em 1em 1em rgba(0, 0, 0, 0.5)',
        backgroundColor: 'white'
    },
    barLink: {
        padding: '1.25em',
        fontSize: '1.2em',
        color: 'rgba(0, 0, 0, 0.4)',
        textDecorationLine: 'none'
    },
    linkActive: {
        position: 'relative',
        color: 'white',
        backgroundColor: '#25A795'
    },
    indicator: {
        position: 'absolute',
        zIndex: 10,
        bottom: '-0.49em',
        left: '50%',
        borderStyle: 'solid',
        borderWidth: '0.5em',
        borderColor: 'transparent',
        borderTopColor: '#25A795',
        borderBottomWidth: 0,
        transform: [{
            translateX: '-50%'
        }]
    }
});

const barLinks = [{
    name: 'Home',
    to: '/'
}, {
    name: 'Profile',
    to: '/profile',
    logged: true
}, {
    name: 'Logout',
    to: '/logout',
    logged: true
}, {
    name: 'Login',
    to: '/login',
    logged: false
}, {
    name: 'Register',
    to: '/register',
    logged: false
}, {
    name: 'About',
    to: '/about'
}];

function TopBar({activeRoute}) {
    const hasToken = Boolean(cookie.load('token'));
    const spanStyle = StyleSheet.resolve({
        style: styles.indicator
    });

    return (
        <View style={styles.topBar}>
            {barLinks.filter(({logged}) =>
                (logged === true && hasToken) || (logged === false && !hasToken) || logged === undefined
            ).map(({name, to}) => {
                const isActive = to === activeRoute.path;
                const linkStyle = StyleSheet.resolve({
                    style: [styles.barLink, isActive && styles.linkActive]
                });

                return (
                    <Link key={name} to={to} {...linkStyle}>
                        {name}
                        {isActive && <span {...spanStyle} />}
                    </Link>
                );
            })}
        </View>
    );
}

export default class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.node,
        routes: React.PropTypes.array,
        params: React.PropTypes.shape({
            data: React.PropTypes.any
        })
    };
    static contextTypes = {
        router: routerShape
    };

    render() {
        const scripts = [{
            src: `${cdnUrl}/bundle.js`
        }];
        if (this.props.params.data) {
            scripts.unshift({
                id: 'preloadedData',
                type: 'application/json',
                innerHTML: JSON.stringify(this.props.params.data)
            });
        }

        const activeRoute = this.props.routes
            .reduce(function flatMap(list, {path, title, indexRoute, childRoutes, hideNavigation}) {
                if (path && title) {
                    list.push({
                        path, title, hideNavigation
                    });
                }

                if (indexRoute) {
                    flatMap(list, {
                        path,
                        ...indexRoute
                    });
                }

                if (childRoutes) {
                    childRoutes.reduce(flatMap, list);
                }

                return list;
            }, [])
            .find(route => this.context.router.isActive({pathname: route.path}, true));

        const stylesheet = StyleSheet.renderToString();
        const divStyle = StyleSheet.resolve({
            style: styles.appContainer
        });

        return (
            <div {...divStyle}>
                <Helmet title={(activeRoute && activeRoute.title && `Bogie - ${activeRoute.title}`) || 'Bogie'} htmlAttributes={{
                    lang: 'en'
                }} meta={[{
                    charset: 'utf-8'
                }]} link={[{
                    href: 'https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic',
                    rel: 'stylesheet'
                }, {
                    href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css',
                    rel: 'stylesheet'
                }]} style={[{
                    cssText: `
                        html {
                            box-sizing: border-box;
                            font-size: 62.5%;
                        }

                        body {
                            color: #606c76;
                            font-family: "Roboto", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
                            font-size: 1.6em;
                            font-weight: 300;
                            letter-spacing: 0.01em;
                            line-height: 1.6;
                            background-color: rgba(0, 0, 0, 0.025);
                        }

                        *,
                        *:after,
                        *:before {
                            box-sizing: inherit;
                        }

                        .bar {
                            top: 15px;
                            height: 10px;
                            background-color: lightgrey;
                        }
                        .bar-1 {
                            margin: 0 20px;
                            background-color: rgba(0, 0, 0, 0.5);
                        }
                    `
                }, {
                    id: StyleSheet.elementId,
                    cssText: stylesheet
                }]} script={scripts} />
                {activeRoute && activeRoute.hideNavigation !== true && <TopBar activeRoute={activeRoute} />}
                {this.props.children}
            </div>
        );
    }
}

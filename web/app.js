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
    topBar: {
        padding: '1.25em',
        height: '3.25em',
        flexDirection: 'row',
        alignSelf: 'center'
    },
    p: {
        flex: 1
    }
});

/* active:{
    ':after':{
        content: '',
        position: 'absolute',
        top: '3.25em',
        marginLeft: '-2em',
        borderLeft: '1em solid transparent',
        borderRight: '1em solid transparent',
        borderTop: '1em solid white',
    }
}*/

function TopBar() {
    return (
        <View style={styles.topBar}>
            <Link to="/" style={styles.p}>Home</Link>
            {cookie.load('token') ? [
                <Link key="profile" to="/profile" style={styles.p}>Profile</Link>,
                <Link key="logout" to="/logout" style={styles.p}>Logout</Link>
            ] : [
                <Link key="login" to="/login" style={styles.p}>Login</Link>,
                <Link key="register" to="/register" style={styles.p}>Register</Link>
            ]}
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

        return (
            <div>
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
                        }

                        *,
                        *:after,
                        *:before {
                            box-sizing: inherit;
                        }

                        .bar {
                            top: 15px;
                            height: 10px;
                        }
                        .bar-1 {
                            margin: 0 20px;
                            background-color: rgba(0, 0, 0, 0.5);
                        }
                    `
                }, {
                    id: StyleSheet.elementId,
                    cssText: StyleSheet.renderToString()
                }]} script={scripts} />
                {activeRoute && activeRoute.hideNavigation !== true && <TopBar activeRoute={activeRoute} />}
                {this.props.children}
            </div>
        );
    }
}

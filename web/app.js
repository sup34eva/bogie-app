import React from 'react';
import Helmet from 'react-helmet';
import {
    StyleSheet
} from 'react-native';
import {
    routerShape
} from 'react-router';

const cdnUrl = `${process.env.CDN_URL}${(process.env.HEROKU_SLUG_COMMIT ? `/${process.env.HEROKU_SLUG_COMMIT}` : '')}`;

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
            .reduce(function flatMap(list, {path, title, indexRoute, childRoutes}) {
                if (path && title) {
                    list.push({
                        path, title
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
                    `
                }, {
                    id: StyleSheet.elementId,
                    cssText: StyleSheet.renderToString()
                }]} script={scripts} />
                {this.props.children}
            </div>
        );
    }
}

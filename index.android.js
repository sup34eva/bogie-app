import React from 'react';
import Relay from 'react-relay';
import {
    AsyncStorage,
    AppRegistry,
    DrawerLayoutAndroid,
    Navigator,
    StyleSheet,
    Text,
    StatusBar,
    ToolbarAndroid,
    View,
    BackAndroid,
    TouchableNativeFeedback
} from 'react-native';

import ConnectionPage from './src/components/connectionPage';
import HomePage from './src/components/home';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    menu: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 8,
        paddingBottom: 8
    },
    menuItem: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16
    },
    menuIcon: {
        backgroundColor: '#6d797e',
        height: 24,
        width: 24,
        marginRight: 72 - (16 + 24)
    },
    toolbar: {
        backgroundColor: '#ff5722',
        height: 48
    },
    content: {
        flex: 1
    }
});

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer('http://api.bogie.leops.me/graphql')
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.setToken = this.setToken.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.renderRoute = this.renderRoute.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.refs.navigator) {
                this.refs.navigator.pop();
                return true;
            }

            return false;
        });

        AsyncStorage.getItem('token')
            .then(this.setToken)
            .catch(err => {
                console.warn(err);
            });
    }

    getConnectionPage() {
        return {
            title: 'Connection',
            component: ConnectionPage,
            navigationBarHidden: true,
            passProps: {
                onConnect: token => {
                    AsyncStorage.setItem('token', token)
                        .then(() => this.setToken(token))
                        .catch(err => {
                            console.warn(err);
                        });
                }
            }
        };
    }

    setToken(token) {
        if (token === null) {
            return;
        }

        if (this.refs.navigator) {
            this.refs.navigator.replace({
                title: 'Search',
                component: HomePage,
                passProps: {
                    token
                }
            });
        }
    }

    renderMenu() {
        const elements = [{
            name: 'Recherche'
        }, {
            name: 'Logout',
            onPress: () => {
                AsyncStorage.removeItem('token')
                    .then(() => {
                        if (this.refs.navigator) {
                            this.refs.navigator.replace(this.getConnectionPage());
                        }
                    })
                    .catch(err => {
                        console.warn(err);
                    });
            }
        }];

        return (
            <View style={styles.menu}>
                {elements.map(({name, onPress}) =>
                    <TouchableNativeFeedback key={name} onPress={onPress}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon} />
                            <Text>{name}</Text>
                        </View>
                    </TouchableNativeFeedback>
                )}
            </View>
        );
    }

    renderRoute({title, component: Component, navigationBarHidden, passProps}, navigator) {
        if (navigationBarHidden) {
            return <Component {...passProps} styles={styles.content} navigator={navigator} />;
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#bf360c" barStyle="light-content" />
                <ToolbarAndroid title={title ? title : 'Bogie'} titleColor="#fff" style={styles.toolbar} />
                <DrawerLayoutAndroid drawerWidth={300} drawerPosition={DrawerLayoutAndroid.positions.Left} renderNavigationView={this.renderMenu}>
                    <Component {...passProps} styles={styles.content} navigator={navigator} />
                </DrawerLayoutAndroid>
            </View>
        );
    }

    render() {
        return (
            <Navigator ref="navigator" renderScene={this.renderRoute} initialRoute={this.getConnectionPage()} />
        );
    }
}

AppRegistry.registerComponent('bogie', () => App);

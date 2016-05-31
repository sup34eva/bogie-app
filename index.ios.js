import React from 'react';
import {
    AsyncStorage,
    AppRegistry,
    NavigatorIOS,
    StyleSheet
} from 'react-native';

import ConnectionPage from './src/components/connectionPage';
import TrainList from './src/components/trainList';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        paddingTop: 64
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.setToken = this.setToken.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('token')
            .then(this.setToken)
            .catch(err => {
                console.warn(err);
            });
    }

    setToken(token) {
        if (this.refs.navigator) {
            this.refs.navigator.replace({
                title: 'Trains List',
                component: TrainList,
                passProps: {
                    token
                }
            });
        }
    }

    render() {
        return (
            <NavigatorIOS ref="navigator" style={styles.container} itemWrapperStyle={styles.wrapper} initialRoute={{
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
            }} />
        );
    }
}

AppRegistry.registerComponent('bogie', () => App);

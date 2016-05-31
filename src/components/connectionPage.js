import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image,
    View,
    Text
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import LoginForm from './loginForm';
import RegisterForm from './registerForm';

const styles = StyleSheet.create({
    header: {
        flex: 1,
        height: null,
        width: null,
        flexDirection: 'column'
    },
    tabs: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 25
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    },
    tabIndicator: {
        position: 'absolute',
        width: 0,
        height: 0,
        bottom: 0,
        borderStyle: 'solid',
        borderWidth: 15,
        borderTopWidth: 0,
        borderColor: 'transparent',
        borderBottomColor: 'white'
    },
    tabView: {
        flex: 1
    }
});

class TabBar extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        goToPage: React.PropTypes.func,
        tabs: React.PropTypes.arrayOf(React.PropTypes.string),
        containerWidth: React.PropTypes.number,
        scrollValue: React.PropTypes.shape({
            interpolate: React.PropTypes.func
        })
    };

    setAnimationValue({value}) {
        console.warn('value', value);
    }

    render() {
        const tabWidth = this.props.containerWidth / this.props.tabs.length;
        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [
                (tabWidth * 0.5) - 15,
                (tabWidth * 1.5) - 15
            ]
        });

        return (
            <Image source={require('../assets/background.jpg')} style={styles.header}>
                <View style={[this.props.style, styles.tabs]}>
                    {this.props.tabs.map((tab, i) =>
                        <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
                            <Text style={styles.tabText}>{tab}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Animated.View style={[styles.tabIndicator, {left}]} />
            </Image>
        );
    }
}

export default class ConnectionPage extends React.Component {
    static propTypes = {
        onConnect: React.PropTypes.func.isRequired
    };

    render() {
        return (
            <ScrollableTabView style={styles.tabView} renderTabBar={() => <TabBar />}>
                <LoginForm tabLabel="Login" onConnect={this.props.onConnect} />
                <RegisterForm tabLabel="Register" onConnect={this.props.onConnect} />
            </ScrollableTabView>
        );
    }
}

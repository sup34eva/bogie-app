import React from 'react';
import Helmet from 'react-helmet';
import {
    TouchableHighlight,
    StyleSheet,
    View,
    Text
} from 'react-native';
import {
    styles
} from './button';

const googleStyles = StyleSheet.create({
    button: {
        backgroundColor: '#d14836',
        borderWidth: '.1rem',
        borderStyle: 'solid',
        borderColor: '#d14836'
    },
    buttonHover: {
        backgroundColor: '#a2392c',
        borderColor: '#a2392c'
    }
});

export default class GoogleLoginButton extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        children: React.PropTypes.node,
        callback: React.PropTypes.func.isRequired,
        clientId: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        document.getElementById('google-login').onload = () => {
            const gapi = require('google');
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: this.props.clientId,
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email'
                });
            });
        };
    }

    onClick() {
        require('google').auth2.getAuthInstance()
            .signIn()
            .then(this.props.callback);
    }

    render() {
        return (
            <TouchableHighlight style={[styles.button, googleStyles.button, this.props.style]} onPress={this.onClick} underlayColor="#a2392c">
                <Text style={styles.buttonText}>
                    <Helmet script={[{
                        id: 'google-login',
                        src: '//apis.google.com/js/platform.js'
                    }]} />
                    Login with Google
                </Text>
            </TouchableHighlight>
        );
    }
}

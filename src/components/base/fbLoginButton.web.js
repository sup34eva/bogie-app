import React from 'react';
import Helmet from 'react-helmet';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {
    styles
} from './button';

const fbStyles = StyleSheet.create({
    button: {
        backgroundColor: '#4c69ba',
        borderStyle: 'solid',
        borderWidth: '.1rem',
        borderColor: '#4c69ba',
        width: '100%'
    },
    buttonHover: {
        backgroundColor: '#435a8b',
        borderColor: '#435a8b'
    }
});

export default class FacebookLoginButton extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        children: React.PropTypes.node,
        callback: React.PropTypes.func.isRequired,
        appId: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        window.fbAsyncInit = () => {
            require('fb').init({
                appId: this.props.appId,
                xfbml: false,
                cookie: false,
                version: 'v2.3'
            });
        };
    }

    onClick() {
        require('fb').login(response => {
            if (response.authResponse) {
                this.props.callback({
                    accessToken: response.authResponse.accessToken
                });
            } else {
                this.props.callback({
                    status: response.status
                });
            }
        }, {
            scope: 'public_profile, email'
        });
    }

    render() {
        const styleProps = StyleSheet.resolve({
            style: [styles.button, fbStyles.button, this.props.style]
        });

        return (
            <button {...styleProps} onClick={this.onClick}>
                <Text style={styles.buttonText}>
                    <Helmet script={[{
                        id: 'facebook-jssdk',
                        src: '//connect.facebook.net/en_US/sdk.js'
                    }]} />
                    Login with Facebook
                </Text>
            </button>
        );
    }
}

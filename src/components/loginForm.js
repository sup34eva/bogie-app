import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Text
} from 'react-native';
import Relay from 'react-relay';

import Button from './base/button';
import Field from './base/field';
import ActivityIndicator from './base/activityIndicator';
import FacebookLogin from './base/fbLoginButton';
import GoogleLogin from './base/googleLoginButton';

import GrantGoogleMutation from '../mutations/grantGoogle';
import GrantFacebookMutation from '../mutations/grantFacebook';
import GrantPasswordMutation from '../mutations/grantPassword';

const styles = StyleSheet.create({
    form: {
        padding: 8
    },
    buttons: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column'
    },
    button: Platform.OS === 'web' ? {
        flex: 1,
        flexBasis: '0',
        marginLeft: '0.25rem',
        marginRight: '0.25rem'
    } : {
        marginTop: 2,
        marginBottom: 2
    },
    red: {
        color: 'red'
    }
});

export default class LoginForm extends React.Component {
    static propTypes = {
        onConnect: React.PropTypes.func,
        style: View.propTypes.style
    };
    static contextTypes = {
        router: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onFacebook = this.onFacebook.bind(this);
        this.onGoogle = this.onGoogle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            error: null,
            isLoading: false,
            email: '',
            password: ''
        };
    }

    onToken() {
        this.setState({
            isLoading: true
        });

        return {
            onSuccess: data => {
                const key = Object.keys(data).find(key => key.startsWith('grant'));
                const token = data[key].token;

                if (this.props.onConnect) {
                    this.props.onConnect(token);
                } else {
                    require('react-cookie').save('token', token);
                    this.context.router.push('/');
                }
            },
            onFailure: transaction => {
                const {
                    source: {
                        errors: [err]
                    }
                } = transaction.getError();
                this.setState({
                    error: err.message,
                    isLoading: false
                });
            }
        };
    }

    onFacebook({accessToken}) {
        Relay.Store.commitUpdate(new GrantFacebookMutation({
            accessToken
        }), this.onToken());
    }

    onGoogle({hg: {id_token}}) {
        Relay.Store.commitUpdate(new GrantGoogleMutation({
            accessToken: id_token
        }), this.onToken());
    }

    onSubmit() {
        Relay.Store.commitUpdate(new GrantPasswordMutation({
            email: this.state.email,
            password: this.state.password
        }), this.onToken());
    }

    render() {
        const emailLink = {
            value: this.state.email,
            requestChange: email => {
                this.setState({
                    email
                });
            }
        };
        const passwordLink = {
            value: this.state.password,
            requestChange: password => {
                this.setState({
                    password
                });
            }
        };

        return (
            <View style={[styles.form, this.props.style]}>
                <Field type="email" name="Email" valueLink={emailLink} />
                <Field type="password" name="Password" valueLink={passwordLink} />
                {Boolean(this.state.error) && <Text style={styles.red}>{this.state.error}</Text>}
                {this.state.isLoading ? <ActivityIndicator /> : (
                    <View style={styles.buttons}>
                        <Button style={styles.button} onPress={this.onSubmit}>
                            <Text style={Button.Text}>Log In</Text>
                        </Button>
                        <FacebookLogin style={styles.button} appId={process.env.FB_ID} callback={this.onFacebook} />
                        <GoogleLogin style={styles.button} clientId={process.env.GOOGLE_ID} callback={this.onGoogle} />
                    </View>
                )}
            </View>
        );
    }
}

import React from 'react';
import zxcvbn from 'zxcvbn';
import {
    ToastAndroid,
    StyleSheet,
    Platform,
    View,
    Text
} from 'react-native';
import Relay from 'react-relay';

import Button from './base/button';
import Field from './base/field';
import ActivityIndicator from './base/activityIndicator';

import RegisterMutation from '../mutations/register';
import LoginMutation from '../mutations/grantPassword';

const styles = StyleSheet.create({
    form: {
        padding: 8
    },

    list: {
        flexDirection: 'column'
    },
    red: {
        color: 'red'
    }
});

class RegisterForm extends React.Component {
    static propTypes = {
        onConnect: React.PropTypes.func,
        style: View.propTypes.style,
        relay: React.PropTypes.any.isRequired,
        viewer: React.PropTypes.any.isRequired
    };
    static contextTypes = {
        router: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.register = this.register.bind(this);
        this.state = {
            isLoading: false,

            email: '',
            password: '',
            passwordConfirmation: '',

            score: 0,
            warning: '',
            suggestions: []
        };
    }

    register() {
        const {email, password} = this.state;

        this.setState({
            isLoading: true
        });

        Relay.Store.commitUpdate(new RegisterMutation({
            email, password
        }), {
            onSuccess: () => {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Votre compte a ete cree', ToastAndroid.SHORT);
                }

                Relay.Store.commitUpdate(new LoginMutation({
                    email, password
                }), {
                    onSuccess: response => {
                        const key = Object.keys(response).find(key => key.startsWith('grant'));
                        const token = response[key].token;

                        if (this.props.onConnect) {
                            this.props.onConnect(token);
                        } else {
                            require('react-cookie').save('token', token);
                            this.context.router.push('/');
                        }
                    },
                    onFailure: transaction => {
                        const err = transaction.getError();
                        console.warn(err.message);

                        this.setState({
                            isLoading: false
                        });
                    }
                });
            },
            onFailure: transaction => {
                const err = transaction.getError();
                console.warn(err.message);

                this.setState({
                    isLoading: false
                });
            }
        });
    }

    render() {
        const emailLink = {
            value: this.state.email,
            requestChange: email => {
                this.setState({email});
                this.props.relay.setVariables({email});
            }
        };
        const passwordLink = {
            value: this.state.password,
            requestChange: password => {
                const {score, feedback: {warning, suggestions}} = zxcvbn(password, [
                    this.state.email
                ]);
                this.setState({
                    password,
                    score, warning, suggestions
                });
            }
        };
        const passwordConfLink = {
            value: this.state.passwordConfirmation,
            requestChange: passwordConfirmation => {
                this.setState({passwordConfirmation});
            }
        };

        const isDisabled = this.state.score === 0 ||
            this.state.password !== this.state.passwordConfirmation ||
            this.state.email.length === 0 ||
            this.props.viewer.user !== null ||
            this.props.relay.hasPartialData(this.props.viewer);

        return (
            <View style={[styles.form, this.props.style]}>
                <Field type="email" name="Email" valueLink={emailLink}>
                    {this.props.viewer.user !== undefined && this.props.viewer.user !== null && <Text style={styles.red}>This email is already used</Text>}
                </Field>
                <Field type="password" name="Password" valueLink={passwordLink}>
                    <View style={styles.list}>
                        {Boolean(this.state.warning) && <Text style={styles.red}>{this.state.warning}</Text>}
                        {this.state.suggestions.map(text => <Text key={text}>{text}</Text>)}
                    </View>
                </Field>
                <Field style={styles.input} type="password" name="Password Confirmation" valueLink={passwordConfLink} />
                {this.state.isLoading ? <ActivityIndicator /> : (
                    <Button onPress={this.register} disabled={isDisabled}>
                        <Text style={Button.Text}>Register</Text>
                    </Button>
                )}
            </View>
        );
    }
}

const RelayContainer = Relay.createContainer(RegisterForm, {
    initialVariables: {
        email: ''
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                user(email: $email) {
                    id
                }
            }
        `
    }
});

class FormHolder extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        onConnect: React.PropTypes.func
    };

    render() {
        return (
            <Relay.RootContainer Component={RelayContainer}
                renderLoading={() => <ActivityIndicator />}
                renderFailure={(error, retry) => (
                    <View style={this.props.style}>
                        <Text>{error.message}</Text>
                        <Button onPress={retry}>
                            <Text style={Button.Text}>Retry</Text>
                        </Button>
                    </View>
                )}
                renderFetched={data => <RelayContainer {...data} style={this.props.style} onConnect={this.props.onConnect} />}
                route={{
                    name: 'RegisterRoute',
                    params: {},
                    queries: {
                        viewer: () => Relay.QL`
                            query {
                                viewer
                            }
                        `
                    }
                }} />
        );
    }
}

export default (Platform.OS === 'web' ? RelayContainer : FormHolder);

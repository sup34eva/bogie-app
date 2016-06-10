import React from 'react';
import {
    View,
    Text
} from 'react-native';
import Relay from 'react-relay';
import Field from './base/field';
import Button from './base/button';
import ListView from './base/listView';
import cookie from 'react-cookie';


import EditMail from '../mutations/editMail';
import EditPassword from '../mutations/editPassword';

class Profile extends React.Component {
    static propTypes = {
        viewer: React.PropTypes.object,
        onConnect: React.PropTypes.func,
        style: View.propTypes.style
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            error: null,
            email: null,
            newPassword: '',
            passwordConfirmation: '',
            currentPassword: ''
        };
    }

    onSubmit() {
        if (this.state.currentPassword.length > 0 && (this.state.newPassword.length === 0 || this.state.passwordConfirmation.length === 0)) {
            this.setState({
                error: 'Type your new password'
            });
        } else if (this.state.currentPassword.length === 0 && this.state.newPassword.length > 0 && this.state.newPassword === this.state.passwordConfirmation) {
            this.setState({
                error: 'Type your current password'
            });
        } else if (this.state.currentPassword.length > 0 && this.state.newPassword.length > 0 && this.state.newPassword !== this.state.passwordConfirmation) {
            this.setState({
                error: 'The passwords do not match'
            });
        } else if (this.state.currentPassword.length > 0 && this.state.newPassword.length > 0 && this.state.newPassword === this.state.passwordConfirmation) {
            Relay.Store.commitUpdate(new EditPassword({
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                token: cookie.load('token')
            }), {
                onSuccess: data => {
                    cookie.save('token', data.editPassword.token);
                },
                onFailure: transaction => {
                    const {
                        source: {
                            errors: [err]
                        }
                    } = transaction.getError();
                    console.error(err);
                }
            });
        }
        if (this.state.email !== null) {
            Relay.Store.commitUpdate(new EditMail({
                currentPassword: this.state.email,
                token: cookie.load('token')
            }), {
                onSuccess: () => {
                    console.log('Okçamarche');
                },
                onFailure: transaction => {
                    const {
                        source: {
                            errors: [err]
                        }
                    } = transaction.getError();
                    console.error(err);
                }
            });
        }
    }

    render() {
        const emailLink = {
            value: this.state.email === null ? this.props.viewer.me.email : this.state.email,
            requestChange: email => {
                this.setState({
                    email
                });
            }
        };
        const passwordLink = {
            value: this.state.password,
            requestChange: password => {
                this.setState({password});
            }
        };
        const passwordConfLink = {
            value: this.state.passwordConfirmation,
            requestChange: passwordConfirmation => {
                this.setState({passwordConfirmation});
            }
        };
        const currentPassword = {
            value: this.state.currentPassword,
            requestChange: currentPassword => {
                this.setState({currentPassword});
            }
        };

        return (
            <View>
                <View>
                    <Field type="email" name="Email" valueLink={emailLink} />
                    <Field type="password" name="Current Password" valueLink={currentPassword} />
                    <Field type="password" name="Password" valueLink={passwordLink} />
                    <Field type="password" name="Password Confirmation" valueLink={passwordConfLink} />
                    {this.state.error && <Text>{this.state.error}</Text>}
                    <Button onPress={this.onSubmit}>
                        <Text>Submit</Text>
                    </Button>
                </View>
                <View>
                    <Text>Historique de la commande</Text>
                    <ListView dataSource={this.props.viewer.me.history.edges} renderRow={edge => <Text> key={edge.node.id} history={edge.node}</Text>}/>
                </View>
            </View>
        );
    }
}
export default Relay.createContainer(Profile, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                me {
                    email
                    history(last:5) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                }
            }
        `
    }
});

import React from 'react';
import {
    Platform,
    View,
    Text,
    Image
} from 'react-native';
import Relay from 'react-relay';
import Field from './base/field';
import Button from './base/button';
import ListView from './base/ListView';

import EditMail from '../mutations/editMail';
import EditPassword from '../mutations/editPassword';

class Profile extends React.Component {
    static propTypes = {
        onConnect: React.PropTypes.func,
        style: View.propTypes.style
    };

constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
        email: null,
        password: ''
    };
}

onSubmit() {
    Relay.Store.commitUpdate(new editPassword({
        currentPassword: this.state.currentPassword,
        passwordLink: this.state.passwordLink
    }), this.onToken());
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
        }

        return (
            <View>
                <View>
                    <Field type="email" name="Email" valueLink={emailLink} />
                    <Field type="password" name="Current Password" valueLink={currentPassword} />
                    <Field type="password" name="Password" valueLink={passwordLink} />
                    <Field type="password" name="Password Confirmation" valueLink={passwordConfLink} />
                    <Button onPress={this.onSubmit}>
                        <Text>Submit</Text>
                    </Button>
                </View>
                <View>
                    <Text>Historique de la commande</Text>
                    <ListView dataSource={this.props.viewer.history.edges} renderRow={edge => <History key={edge.node.id} history={edge.node} />}/>
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

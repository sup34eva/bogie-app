import React from 'react';
import Relay from 'react-relay';
import cookie from 'react-cookie';
import {
    View,
    Text,
    StyleSheet,
    Portal
} from 'react-native';
import {
    browserHistory
} from 'react-router';

import Card from './base/card';
import Button from './base/button';
import Field from './base/field';
import ListView from './base/listView';

const styles = StyleSheet.create({
    container: {
        padding: '2em',
        width: '75vw',
        marginTop: '3em',
        marginRight: 'auto',
        marginLeft: 'auto',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        borderRadius: 2
    },
    btn: {
        flex: 1,
        marginTop: '2em'
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20
    },
    modal: {
        padding: '3em',
        width: '75vw',
        backgroundColor: 'white',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        borderRadius: 4
    },
    text: {
        fontSize: '1.5em'
    }
});

class Modal extends React.Component {
    static propTypes = {
        tag: React.PropTypes.string,
        onPay: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }

    render() {
        const emailLink = {
            value: this.state.email,
            requestChange: email => {
                console.log(email);
                this.setState({
                    email
                });
            }
        };

        return (
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <Text style={styles.text}>Enter your mail for reserve</Text>
                    <Field type="email" name="Email" valueLink={emailLink} />
                    <Button style={styles.btn} onPress={() => {
                        browserHistory.push('/login');
                        Portal.closeModal(this.props.tag);
                    }}>
                        <Text style={Button.Text}>Log in</Text>
                    </Button>
                    <Button style={styles.btn} onPress={this.props.onPay} disabled={this.state.email === ''}>
                        <Text style={Button.Text}>Pay</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

class Travel extends React.Component {
    static propTypes = {
        viewer: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.reserve = this.reserve.bind(this);
        this.pay = this.pay.bind(this);
    }

    reserve() {
        if (cookie.load('token')) {
            this.pay();
        } else {
            const tag = Portal.allocateTag();
            Portal.showModal(tag, <Modal tag={tag} onPay={this.pay} key={tag}/>);
        }
    }

    pay() {
        const win = window.open('about:blank', 'modal');
        console.log(win);
    }

    render() {
        if (this.props.viewer.start.edges.length !== 0 && this.props.viewer.end.edges.length !== 0) {
            return (
                <Card style={styles.container}>
                    <ListView dataSource={this.props.viewer.start.edges.concat([{node: {name: '...'}}]).concat(this.props.viewer.end.edges)}
                        renderRow={edge => <Text key={edge.node.id}>{edge.node.name}</Text>}/>
                    <Button style={styles.btn} onPress={this.reserve}>
                        <Text style={Button.Text}>Reserve</Text>
                    </Button>
                </Card>
            );
        }

        return null;
    }
}
export default Relay.createContainer(Travel, {
    initialVariables: {
        departure: '',
        arrival: ''
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                start: route(from: $departure, to: $arrival, first: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
                end: route(from: $departure, to: $arrival, last: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        `
    }
});

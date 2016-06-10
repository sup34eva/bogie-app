import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Travel from './travel';
import Card from './base/card';
import Button from './base/button';
import Field from './base/field';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row'
    },
    field: {
        flex: 1,
        marginTop: '8'
    }
});

class Home extends React.Component {
    static propTypes = {
        viewer: React.PropTypes.object,
        relay: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            departure: '',
            arrival: '',
            date: moment().toISOString(),
            after: 0,
            before: 96
        };
    }

    onSubmit() {
        this.props.relay.setVariables({
            departure: this.state.departure,
            arrival: this.state.arrival,
            date: this.state.date,
            after: this.state.after,
            before: this.state.before
        });
    }

    render() {
        const departureLink = {
            value: this.state.departure,
            requestChange: departure => {
                this.setState({departure});
            }
        };
        const arrivalLink = {
            value: this.state.arrival,
            requestChange: arrival => {
                this.setState({arrival});
            }
        };
        const dateLink = {
            value: this.state.date,
            requestChange: date => {
                this.setState({date});
            }
        };
        const beforeLink = {
            value: this.state.before,
            requestChange: before => {
                this.setState({before});
            }
        };
        const afterLink = {
            value: this.state.after,
            requestChange: after => {
                this.setState({after});
            }
        };

        return (
            <View style={styles.container}>
                <Card style={styles.container}>
                    <View style={styles.row}>
                        <Field name="Departure" style={styles.field} valueLink={departureLink} />
                        <Field name="Arrival" style={styles.field} valueLink={arrivalLink} />
                    </View>
                    <View style={styles.row}>
                        <Field name="Date" style={styles.field} valueLink={dateLink} />
                        <Field name="Before" style={styles.field} valueLink={beforeLink} />
                        <Field name="After" style={styles.field} valueLink={afterLink} />
                    </View>
                    <View style={styles.row}>
                        <Button style={styles.field} onPress={this.onSubmit}>
                            <Text style={Button.Text}>Search</Text>
                        </Button>
                    </View>
                </Card>
                <Travel train={this.props.viewer.train} />
            </View>
        );
    }
}

export default Relay.createContainer(Home, {
    initialVariables: {
        departure: '',
        arrival: '',
        date: moment().toISOString(),
        after: 0,
        before: 96
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                train(from: $departure, to: $arrival, date: $date, after: $after, before: $before) {
                    id
                    ${Travel.getFragment('train')}
                }
            }
        `
    }
});

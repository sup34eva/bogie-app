import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import DatePicker from './base/datePicker';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    styles as fieldStyles
} from './base/field';
import Card from './base/card';
import Button from './base/button';
import Slider from './base/slider';
import AutoCompleteField from './base/autoComplete';

const styles = StyleSheet.create({
    date: {
        marginRight: 30
    },
    dateLabel: {
        marginBottom: '1.25rem'
    },
    container: {
        width: '75vw',
        marginTop: '3em',
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    h1: {
        color: 'white'
    },
    row: {
        flexDirection: 'row'
    },
    btn: {
        flex: 1,
        marginTop: '2em'
    }
});

class Home extends React.Component {
    static propTypes = {
        viewer: React.PropTypes.object,
        relay: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            submit: false,
            date: moment()
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        this.setState({
            submit: true
        });
    }

    render() {
        const dateLink = {
            value: this.state.date,
            requestChange: date => {
                this.setState({date});
            }
        };
        const departureLink = {
            value: this.props.relay.variables.departure,
            requestChange: departure => {
                this.props.relay.setVariables({departure});
            }
        };
        const arrivalLink = {
            value: this.props.relay.variables.arrival,
            requestChange: arrival => {
                this.props.relay.setVariables({arrival});
            }
        };

        return (
            <View>
                <Card style={styles.container}>
                    <View style={styles.row}>
                        <AutoCompleteField name="Departure" valueLink={departureLink} data={this.props.viewer.departures.edges} />
                        <AutoCompleteField name="Arrival" valueLink={arrivalLink} data={this.props.viewer.arrivals.edges} />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.date}>
                            <Text style={[fieldStyles.label, styles.dateLabel]}>Date</Text>
                            <DatePicker valueLink={dateLink}/>
                        </View>
                        <Slider/>
                    </View>
                    <View style={styles.row}>
                        <Button style={styles.btn} onPress={this.onSubmit}>
                            <Text style={Button.Text}>Search</Text>
                        </Button>
                    </View>
                </Card>
                {this.props.viewer.results.edges.length === 0 || this.state.submit === false ? null :
                    <Card style={styles.container}>
                        <Text style={fieldStyles.label}>Test</Text>
                    </Card>
                }
            </View>
        );
    }
}

export default Relay.createContainer(Home, {
    initialVariables: {
        departure: '',
        arrival: ''
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                departures: stations(filter: $departure, first: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
                arrivals: stations(filter: $arrival, first: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
                results: route(from: $departure, to: $arrival, first: 1){
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

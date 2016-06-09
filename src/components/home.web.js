import React from 'react';
import Slider from 'react-slider';
import Autosuggest from 'react-autosuggest';
import Relay from 'react-relay';
import moment from 'moment';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    styles as fieldStyles
} from './base/field';
import DatePicker from './base/datePicker';
import Button from './base/button';

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
    input: {
        flex: 1
    },
    h1: {
        color: 'white'
    },
    row: {
        flexDirection: 'row'
    },

    range: {
        flex: 2,
        height: 50
    },
    rangeHandle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'lightgrey',
        borderColor: 'darkgrey',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    date: {
        marginRight: 30
    },
    btn: {
        flex: 1,
        marginTop: '2em'
    },
    dateLabel: {
        marginBottom: '1.25rem'
    }
});
class AutoCompleteField extends React.Component {
    static propTypes = {
        data: React.PropTypes.array,
        name: React.PropTypes.string,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.string,
            requestChange: React.PropTypes.func
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            suggestions: this.getSuggestions('')
        };
    }

    getSuggestions(value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.data.filter(({node}) => {
            return node.name.toLowerCase().slice(0, inputLength) === inputValue;
        });
    }

    render() {
        const searchStyle = StyleSheet.resolve({
            style: fieldStyles.input
        });

        return (
            <View style={[fieldStyles.fieldset, styles.input]} component="label">
                <Text style={fieldStyles.label}>{this.props.name}</Text>
                <Autosuggest suggestions={this.state.suggestions}
                    onSuggestionsUpdateRequested={({value}) => {
                        this.setState({
                            suggestions: this.getSuggestions(value)
                        });
                    }}
                    getSuggestionValue={({node}) => node.name}
                    renderSuggestion={({node}) => <span>{node.name}</span>}
                    inputProps={{
                        ...searchStyle,
                        placeholder: this.props.name,
                        value: this.props.valueLink.value,
                        onChange: (evt, {newValue}) => {
                            this.props.valueLink.requestChange(newValue);
                        }
                    }} />
            </View>
        );
    }
}

class Home extends React.Component {
    static propTypes = {
        viewer: React.PropTypes.object,
        relay: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            range: [0, 96],
            submit: false
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        this.setState({
            submit: true
        });
    }

    render() {
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
        const dateLink = {
            value: this.state.date,
            requestChange: date => {
                this.setState({date});
            }
        };
        const rangeLink = {
            value: this.state.range,
            requestChange: range => {
                this.setState({range});
            }
        };

        const rangeStyle = StyleSheet.resolve({style: styles.range});
        const handleStyle = StyleSheet.resolve({style: styles.rangeHandle});
        const hoursFrom = this.state.range[0] * 15;
        const hoursTo = this.state.range[1] * 15;

        return (
            <View>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <AutoCompleteField name="Departure" valueLink={departureLink} data={this.props.viewer.departures.edges} />
                        <AutoCompleteField name="Arrival" valueLink={arrivalLink} data={this.props.viewer.arrivals.edges} />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.date}>
                            <Text style={[fieldStyles.label, styles.dateLabel]}>Date</Text>
                            <DatePicker valueLink={dateLink}/>
                        </View>
                        <View style={styles.range}>
                            <Text style={fieldStyles.label}>Hours {Math.floor(hoursFrom / 60)}:{hoursFrom % 60} - {Math.floor(hoursTo / 60)}:{hoursTo % 60}</Text>
                            <Slider onChange={rangeLink.requestChange} value={rangeLink.value} max={96} withBars
                                className={rangeStyle.className} barClassName="bar"
                                handleClassName={handleStyle.className} />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Button style={styles.btn} onPress={this.onSubmit}>
                            <Text style={Button.Text}>Search</Text>
                        </Button>
                    </View>
                </View>
                {this.props.viewer.results.edges.length === 0 || this.state.submit === false ? null :
                    <View style={styles.container}>
                        <Text style={fieldStyles.label}>Test</Text>
                    </View>
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

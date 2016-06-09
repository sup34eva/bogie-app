import React from 'react';
import Slider from 'react-slider';
import Autosuggest from 'react-autosuggest';
import Relay from 'react-relay';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Field, {
    styles as fieldStyles
} from './base/field';

const styles = StyleSheet.create({
    container: {
        padding: '2em',
        maxWidth: '75vw',
        marginTop: '3em',
        marginRight: 'auto',
        marginBottom: '3em',
        marginLeft: 'auto',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
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
        marginRight: 5
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
        viewer: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            departure: '',
            arrival: '',
            date: '',
            range: [0, 96]
        };
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
            <View style={styles.container}>
                <View style={styles.row}>
                    <AutoCompleteField name="Departure" valueLink={departureLink} data={this.props.viewer.stations.edges} />
                    <AutoCompleteField name="Arrival" valueLink={arrivalLink} data={this.props.viewer.stations.edges} />
                </View>
                <View style={styles.row}>
                    <Field style={[styles.input, styles.date]} name="Date" valueLink={dateLink}/>
                    <View style={styles.range}>
                        <Text>{Math.floor(hoursFrom / 60)}:{hoursFrom % 60} - {Math.floor(hoursTo / 60)}:{hoursTo % 60}</Text>
                        <Slider onChange={rangeLink.requestChange} value={rangeLink.value} max={96} withBars
                            className={rangeStyle.className} barClassName="bar"
                            handleClassName={handleStyle.className} />
                    </View>
                </View>
            </View>
        );
    }
}

export default Relay.createContainer(Home, {
    initialVariables: {
        name: ''
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                stations(first: 10) {
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

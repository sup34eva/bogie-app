import React from 'react';
import Relay from 'react-relay';
import Autosuggest from 'react-autosuggest';
import {
    styles as fieldStyles
} from './field';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    input: {
        flex: 1
    },
    reactAutosuggestContainer: {
        position: 'relative'
    },
    reactAutosuggestInput: {
        width: 240,
        height: 30,
        padding: 15,
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: '300',
        fontSize: 16,
        borderColor: '#aaa',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 4
    },
    reactAutosuggestSuggestionsContainer: {
        position: 'absolute',
        top: 51,
        width: 280,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        borderColor: '#aaa',
        borderStyle: 'solid',
        borderWidth: '1px',
        backgroundColor: '#fff',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: '300',
        fontSize: 16,
        zIndex: 2
    },
    reactAutosuggestSuggestion: {
        cursor: 'pointer',
        padding: 15
    },
    reactAutosuggestSuggestionFocused: {
        backgroundColor: '#ddd'
    }
});

class AutoCompleteField extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        viewer: React.PropTypes.object,
        relay: React.PropTypes.object,
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

        return inputLength === 0 ? [] : this.props.viewer.stations.edges.filter(({node}) => {
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
                <Autosuggest
                    theme={{
                        container: StyleSheet.resolve({style: styles.reactAutosuggestContainer}).className,
                        input: StyleSheet.resolve({style: styles.reactAutosuggestInput}).className,
                        suggestionsContainer: StyleSheet.resolve({style: styles.reactAutosuggestSuggestionsContainer}).className,
                        suggestion: StyleSheet.resolve({style: styles.reactAutosuggestSuggestion}).className,
                        suggestionFocused: StyleSheet.resolve({style: styles.reactAutosuggestSuggestionFocused}).className
                    }}
                    suggestions={this.state.suggestions}
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
                            this.props.relay.setVariables({
                                filter: newValue
                            });
                            this.props.valueLink.requestChange(newValue);
                        }
                    }} />
            </View>
        );
    }
}

export default Relay.createContainer(AutoCompleteField, {
    initialVariables: {
        filter: ''
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                stations(filter: $filter, first: 5) {
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

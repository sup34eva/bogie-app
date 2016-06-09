import React from 'react';
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
    }
});

export default class AutoCompleteField extends React.Component {
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

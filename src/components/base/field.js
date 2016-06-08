import React from 'react';
import {
    StyleSheet,
    TextInput,
    View
} from 'react-native';

const styles = StyleSheet.create({
    input: {
        height: 40
    }
});

export default class Field extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        style: View.propTypes.style,
        children: React.PropTypes.node,
        type: React.PropTypes.oneOf(['text', 'password', 'email']),
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.string,
            requestChange: React.PropTypes.func
        })
    }
    render() {
        const {value, requestChange} = this.props.valueLink;
        const inputProps = {
            ...this.props,
            keyboardType: this.props.type === 'email' ? 'email-address' : undefined,
            secureTextEntry: this.props.type === 'password',
            placeholder: this.props.name,
            style: styles.input,
            children: undefined,
            onChangeText: requestChange,
            value
        };

        return (
            <View style={this.props.style}>
                <TextInput {...inputProps} style={styles.input} />
                {this.props.children}
            </View>
        );
    }
}

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
        name: React.PropType.string,
        style: View.propType.style,
        children: React.PropType.node,
        type: React.PropType.oneOf(['text', 'password', 'email']),
        valueLink: React.PropType.shape({
            value: React.PropType.string,
            requestChange: React.PropType.func
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

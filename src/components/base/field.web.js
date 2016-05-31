import React from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text
} from 'react-native';

const styles = StyleSheet.create({
    fieldset: {
        position: 'relative',
        marginBottom: '1.5rem',
        borderWidth: 0,
        padding: 0
    },

    input: {
        backgroundColor: 'transparent',
        borderWidth: '.1rem',
        borderStyle: 'solid',
        borderColor: '#d1d1d1',
        borderRadius: '0.4rem',
        boxShadow: 'none',
        height: '3.8rem',
        paddingTop: '.6rem',
        paddingRight: '1rem',
        paddingBottom: '.6rem',
        paddingLeft: '1rem',
        width: '100%',
        marginBottom: '1.5rem'
    },
    inputFocus: {
        borderColor: '#25A795',
        outline: '0'
    },

    label: {
        color: '#2D2D2D',
        fontSize: '1.6rem',
        fontWeight: '700',
        marginBottom: '0.5rem'
    }
});

export default class Field extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        style: View.propTypes.style,
        inputStyle: View.propTypes.style,
        type: React.PropTypes.oneOf(['text', 'password']),
        children: React.PropTypes.node,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.string,
            requestChange: React.PropTypes.func
        })
    };

    render() {
        const {value, requestChange} = this.props.valueLink;

        const classes = [styles.fieldset];
        if (this.props.style) {
            classes.push(this.props.style);
        }

        return (
            <View component="label" style={classes}>
                <Text style={styles.label}>{this.props.name}</Text>
                <TextInput style={[this.props.inputStyle, styles.input]}
                    secureTextEntry={this.props.type === 'password'} placeholder={this.props.name}
                    value={value} onChangeText={requestChange} />
                {this.props.children}
            </View>
        );
    }
}

import React from 'react';
import {
    TouchableNativeFeedback,
    StyleSheet,
    View
} from 'react-native';

export const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,.12)',
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        margin: 6,
        borderRadius: 2,
        elevation: 2
    },
    text: {
        color: '#2196f3',
        position: 'relative',
        top: 2,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.018,
        lineHeight: 24
    }
});

export default class Button extends React.Component {
    static Text = styles.text;

    static propTypes = {
        style: View.propTypes.style,
        disabled: React.PropTypes.bool,
        onPress: React.PropTypes.func,
        children: React.PropTypes.node
    };

    render() {
        return (
            <TouchableNativeFeedback disabled={this.props.disabled} onPress={this.props.onPress} background={TouchableNativeFeedback.Ripple('rgba(153,153,153,.4)')}>
                <View style={[styles.button, this.props.style]}>
                    {this.props.children}
                </View>
            </TouchableNativeFeedback>
        );
    }
}

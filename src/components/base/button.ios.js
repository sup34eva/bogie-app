import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const styles = StyleSheet.create({
    button: {
        padding: 10
    },
    text: {
        color: '#007aff',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default class Button extends React.Component {
    static Text = styles.text;

    static propTypes = {
        onPress: React.PropTypes.func,
        style: View.propTypes.style,
        children: React.PropTypes.node
    };

    render() {
        return (
            <TouchableOpacity style={[styles.button, this.props.style]} onPress={this.props.onPress} activeOpacity={0.2}>
                <View>
                    {this.props.children}
                </View>
            </TouchableOpacity>
        );
    }
}

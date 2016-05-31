import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View
} from 'react-native';

const styles = StyleSheet.create({
    row: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 16,
        paddingLeft: 16
    }
});

export default class Train extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    };

    render() {
        return (
            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0.12)">
                <View style={[styles.row, this.props.style]}>
                    {this.props.children}
                </View>
            </TouchableHighlight>
        );
    }
}

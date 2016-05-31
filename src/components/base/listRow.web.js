import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

const styles = StyleSheet.create({
    row: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 16,
        paddingLeft: 16
    },
    oneLine: {
        height: 48
    },
    twoLine: {
        height: 72
    }
});

export default class ListRow extends React.Component {
    static oneLine = styles.oneLine;
    static twoLine = styles.twoLine;

    static propTypes = {
        style: View.propTypes.style,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element
        ])
    };

    render() {
        return (
            <View style={[styles.row, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

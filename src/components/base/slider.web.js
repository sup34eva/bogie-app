import React from 'react';
import Slide from 'react-slider';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    styles as fieldStyles
} from './field';

const styles = StyleSheet.create({
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
    }
});

export default class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            range: [0, 96]
        };
    }

    render() {
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
            <View style={styles.range}>
                <Text style={fieldStyles.label}>Hours {Math.floor(hoursFrom / 60)}:{hoursFrom % 60} - {Math.floor(hoursTo / 60)}:{hoursTo % 60}</Text>
                <Slide onChange={rangeLink.requestChange} value={rangeLink.value} max={96} withBars
                    className={rangeStyle.className} barClassName="bar"
                handleClassName={handleStyle.className} />
            </View>
        );
    }
}

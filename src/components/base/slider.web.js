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

export default function Slider({valueLink: {value, requestChange}}) {
    const rangeStyle = StyleSheet.resolve({style: styles.range});
    const handleStyle = StyleSheet.resolve({style: styles.rangeHandle});
    const hoursFrom = value[0] * 15;
    const hoursTo = value[1] * 15;

    return (
        <View style={styles.range}>
            <Text style={fieldStyles.label}>Hours {Math.floor(hoursFrom / 60)}:{hoursFrom % 60} - {Math.floor(hoursTo / 60)}:{hoursTo % 60}</Text>
            <Slide onChange={requestChange} value={value} max={96} withBars
                className={rangeStyle.className} barClassName="bar"
                handleClassName={handleStyle.className} />
        </View>
    );
}

Slider.propTypes = {
    valueLink: React.PropTypes.shape({
        value: React.PropTypes.arrayOf(React.PropTypes.number),
        requestChange: React.PropTypes.func
    })
};

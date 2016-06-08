import React from 'react';
import Slider from 'react-slider';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Field from './base/field';

const styles = StyleSheet.create({
    container: {
        padding: '8.25em',
        backgroundSize: 'cover'
    },
    input: {
        flex: 1
    },
    h1: {
        color: 'white'
    },
    row: {
        flexDirection: 'row'
    },

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
    },
    date: {
        marginRight: 5
    }
});

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departure: '',
            arrival: '',
            date: '',
            range: [0, 96]
        };
    }

    render() {
        const departureLink = {
            value: this.state.departure,
            requestChange: departure => {
                this.setState({departure});
            }
        };
        const arrivalLink = {
            value: this.state.arrival,
            requestChange: arrival => {
                this.setState({arrival});
            }
        };
        const dateLink = {
            value: this.state.date,
            requestChange: date => {
                this.setState({date});
            }
        };
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
            <View style={styles.container}>
                <View style={styles.row}>
                    <Field style={styles.input} name="Departure" valueLink={departureLink}/>
                    <Field style={styles.input} name="Arrival" valueLink={arrivalLink}/>
                </View>
                <View style={styles.row}>
                    <Field style={[styles.input, styles.date]} name="Date" valueLink={dateLink}/>
                    <View style={styles.range}>
                        <Text>{Math.floor(hoursFrom / 60)}:{hoursFrom % 60} - {Math.floor(hoursTo / 60)}:{hoursTo % 60}</Text>
                        <Slider onChange={rangeLink.requestChange} value={rangeLink.value} max={96} withBars
                            className={rangeStyle.className} barClassName="bar"
                            handleClassName={handleStyle.className} />
                    </View>
                </View>
            </View>
        );
    }
}

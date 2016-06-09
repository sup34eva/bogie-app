import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

const styles = StyleSheet.create({
    card: {
        padding: '2em',
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    }
});

export default function (props) {
    return (
        <View style={[styles.card, props.style]}>
            {props.children}
        </View>
    );
}

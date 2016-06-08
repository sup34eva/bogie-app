import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    topBar: {
        padding: '1.25em',
        height: '3.25em',
        flexDirection: 'row',
        alignSelf: 'center'
    },
    p: {
        flex: 1
    }
});

/* active:{
    ':after':{
        content: '',
        position: 'absolute',
        top: '3.25em',
        marginLeft: '-2em',
        borderLeft: '1em solid transparent',
        borderRight: '1em solid transparent',
        borderTop: '1em solid white',
    }
}*/

export default function () {
    return (
        <View style={styles.topBar}>
            <Text style={styles.p}>Home</Text>
            <Text style={styles.p}>Reserve</Text>
            <Text style={styles.p}>Login</Text>
            <Text style={styles.p}>Register</Text>
        </View>
    );
}

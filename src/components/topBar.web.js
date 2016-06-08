import React from 'react';
import cookie from 'react-cookie';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {
    Link
} from 'react-router';

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
            <Link to="/" style={styles.p}>Home</Link>
            {cookie.load('token') ? [
                <Link key="profile" to="/profile" style={styles.p}>Profile</Link>,
                <Link key="logout" to="/logout" style={styles.p}>Logout</Link>
            ] : [
                <Link key="login" to="/login" style={styles.p}>Login</Link>,
                <Link key="register" to="/register" style={styles.p}>Register</Link>
            ]}

        </View>
    );
}

import React from 'react';
import {
    ActivityIndicator
} from 'react-native';

export default class ActivityIndicatorWeb extends React.Component {
    static propTypes = {
        style: ActivityIndicator.propTypes.style
    };

    render() {
        return <ActivityIndicator style={this.props.style} animating />;
    }
}

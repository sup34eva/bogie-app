import React from 'react';
import {
    ActivityIndicatorIOS
} from 'react-native';

export default class ActivityIndicator extends React.Component {
    static propTypes = {
        style: ActivityIndicatorIOS.propTypes.style
    };

    render() {
        return <ActivityIndicatorIOS style={this.props.style} />;
    }
}

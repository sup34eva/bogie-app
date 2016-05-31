import React from 'react';
import {
    ProgressBarAndroid
} from 'react-native';

export default class ActivityIndicator extends React.Component {
    static propTypes = {
        style: ProgressBarAndroid.propTypes.style
    };

    render() {
        return <ProgressBarAndroid style={this.props.style} indeterminate />;
    }
}

import React from 'react';
import {
    requireNativeComponent,
    StyleSheet,
    View
} from 'react-native';

const styles = StyleSheet.create({
    button: {
        height: 48
    }
});

let NativeButton;
export default class LoginButton extends React.Component {
    constructor() {
        super();

        this._onSuccess = this._onSuccess.bind(this);
        this._onError = this._onError.bind(this);
    }

    _onSuccess(event) {
        if (!this.props.onSuccess) {
            return;
        }

        this.props.onSuccess(event.nativeEvent.token);
    }

    _onError(event) {
        if (!this.props.onError) {
            return;
        }

        this.props.onSuccess(event.nativeEvent.message);
    }

    render() {
        delete this.props.children;

        return (
            <NativeButton {...this.props}
                style={[styles.button, this.props.styles]}
                onSuccess={this._onSuccess}
                onError={this._onError} />
        );
    }
}

LoginButton.propTypes = {
    ...View.propTypes,
    style: View.propTypes.style,
    onSuccess: React.PropTypes.func,
    onError: React.PropTypes.func
};

NativeButton = requireNativeComponent(`GoogleLoginButton`, LoginButton, {
    nativeOnly: {
        onSuccess: true,
        onError: true
    }
});

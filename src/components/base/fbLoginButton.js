import React, {
    PropTypes
} from 'react';
import {
    requireNativeComponent,
    StyleSheet,
    View
} from 'react-native';

const styles = StyleSheet.create({
    button: {
        height: 30
    }
});

let NativeButton;
export default class LoginButton extends React.Component {
    constructor() {
        super();

        this._onSuccess = this._onSuccess.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onError = this._onError.bind(this);
    }

    _onSuccess(event) {
        if (!this.props.onSuccess) {
            return;
        }

        this.props.onSuccess(event.nativeEvent.token);
    }

    _onCancel() {
        if (!this.props.onCancel) {
            return;
        }

        this.props.onCancel();
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
                onCancel={this._onCancel}
                onError={this._onError} />
        );
    }
}

LoginButton.propTypes = {
    ...View.propTypes,
    style: View.propTypes.style,
    readPermissions: PropTypes.string,
    onSuccess: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onError: React.PropTypes.func
};

NativeButton = requireNativeComponent(`FBLoginButton`, LoginButton, {
    nativeOnly: {
        onSuccess: true,
        onCancel: true,
        onError: true
    }
});

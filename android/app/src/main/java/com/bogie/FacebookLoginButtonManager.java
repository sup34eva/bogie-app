package com.bogie;

import android.support.annotation.Nullable;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

/**
 * Created by leops on 10/05/2016.
 */
public class FacebookLoginButtonManager extends SimpleViewManager<LoginButton> {

    public static final String REACT_CLASS = "FBLoginButton";

    private CallbackManager cbManager;

    public FacebookLoginButtonManager(CallbackManager manager) {
        this.cbManager = manager;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public LoginButton createViewInstance(ThemedReactContext context) {
        final LoginButton btn = new LoginButton(context);

        btn.registerCallback(cbManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                WritableMap event = Arguments.createMap();
                event.putString("token", loginResult.getAccessToken().getToken());

                ReactContext reactContext = (ReactContext) btn.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    btn.getId(),
                    "onSuccess",
                    event
                );
            }

            @Override
            public void onCancel() {
                ReactContext reactContext = (ReactContext) btn.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    btn.getId(),
                    "onCancel",
                    Arguments.createMap()
                );
            }

            @Override
            public void onError(FacebookException error) {
                WritableMap event = Arguments.createMap();
                event.putString("message", error.getLocalizedMessage());

                ReactContext reactContext = (ReactContext) btn.getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                    btn.getId(),
                    "onError",
                    event
                );
            }
        });

        return btn;
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "onSuccess", MapBuilder.of("registrationName", "onSuccess"),
            "onCancel", MapBuilder.of("registrationName", "onCancel"),
            "onError", MapBuilder.of("registrationName", "onError")
        );
    }

    @ReactProp(name = "readPermissions")
    public void setReadPermissions(LoginButton view, @Nullable String perms) {
        view.setReadPermissions(perms);
    }
}

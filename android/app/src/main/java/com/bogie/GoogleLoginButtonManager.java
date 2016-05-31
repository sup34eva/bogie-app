package com.bogie;

import android.content.Intent;
import android.support.annotation.Nullable;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.GoogleApiClient;

import java.util.Map;

/**
 * Created by leops on 10/05/2016.
 */
public class GoogleLoginButtonManager extends SimpleViewManager<SignInButton> implements View.OnClickListener {

    public static final String REACT_CLASS = "GoogleLoginButton";
    public static final int RC_SIGN_IN = 0x42f0000;

    private final MainActivity activity;
    private final GoogleApiClient gApiClient;

    public GoogleLoginButtonManager(MainActivity activity) {
        this.activity = activity;
        String serverCode = activity.getResources().getString(R.string.google_server_code);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken(serverCode)
            .requestServerAuthCode(serverCode)
            .build();

        gApiClient = new GoogleApiClient.Builder(activity)
            .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
            .build();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public SignInButton createViewInstance(ThemedReactContext context) {
        SignInButton btn = new SignInButton(context);
        btn.setOnClickListener(this);
        return btn;
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "onSuccess", MapBuilder.of("registrationName", "onSuccess"),
            "onError", MapBuilder.of("registrationName", "onError")
        );
    }

    @Override
    public void onClick(final View btn) {
        int reqCode = RC_SIGN_IN | btn.getId();
        final MainActivity.Consumer<GoogleSignInResult> consumer = new MainActivity.Consumer<GoogleSignInResult>() {
            @Override
            public void consume(GoogleSignInResult result) {
                WritableMap event = Arguments.createMap();

                if (result.isSuccess()) {
                    GoogleSignInAccount acct = result.getSignInAccount();
                    event.putString("token", acct.getIdToken());
                    event.putString("code", acct.getServerAuthCode());

                    ReactContext reactContext = (ReactContext) btn.getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        btn.getId(),
                        "onSuccess",
                        event
                    );
                } else {
                    event.putString("message", "Authentication failed");

                    ReactContext reactContext = (ReactContext) btn.getContext();
                    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        btn.getId(),
                        "onError",
                        event
                    );
                }

            }
        };

        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(gApiClient);
        activity.googleCallbacks.put(reqCode, consumer);
        activity.startActivityForResult(signInIntent, reqCode);
    }
}

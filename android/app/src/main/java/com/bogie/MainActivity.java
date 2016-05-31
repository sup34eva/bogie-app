package com.bogie;

import android.content.Intent;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends ReactActivity {

    public CallbackManager callbackManager = null;
    public Map<Integer, Consumer<GoogleSignInResult>> googleCallbacks = new HashMap<>();

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "bogie";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        if(callbackManager == null) {
            FacebookSdk.sdkInitialize(this);
            callbackManager = CallbackManager.Factory.create();
        }

        return Arrays.asList(
            new MainReactPackage(),
            new BogiePackage(this)
        );
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(callbackManager != null)
            callbackManager.onActivityResult(requestCode, resultCode, data);

        if(googleCallbacks.containsKey(requestCode)) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            googleCallbacks.remove(requestCode).consume(result);
        }
    }

    public interface Consumer<T> {
        void consume(T data);
    }
}

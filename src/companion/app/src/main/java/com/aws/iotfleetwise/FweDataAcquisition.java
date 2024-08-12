package com.aws.iotfleetwise;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.preference.PreferenceManager;

import java.util.Locale;

public class FweDataAcquisition
        implements
        SharedPreferences.OnSharedPreferenceChangeListener,
        LocationListener {
    private static final String LOCATION_PROVIDER = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
            ? LocationManager.FUSED_PROVIDER
            : LocationManager.GPS_PROVIDER;
    private Location mLastLocation = null;
    private SharedPreferences mPrefs = null;
    private LocationManager mLocationManager = null;
    private Context mContext = null;

    public FweDataAcquisition(Context context) {
        mContext = context;
        mPrefs = PreferenceManager.getDefaultSharedPreferences(context);
        //mPrefs.registerOnSharedPreferenceChangeListener(mContext);
        onSharedPreferenceChanged(null, null);

        mDataAcquisitionThread.start();
        //serviceLocation();
    }

    private int getUpdateTime()
    {
        int updateTime = R.string.default_update_time;
        try {
            updateTime = Integer.parseInt(mPrefs.getString("update_time", String.valueOf(R.string.default_update_time)));
        }
        catch (Exception ignored) {
        }
        if (updateTime == 0) {
            updateTime = R.string.default_update_time;
        }
        updateTime *= 1000;
        return updateTime;
    }

    Thread mDataAcquisitionThread = new Thread(() -> {
        while (true) {
            Log.i("FweDataAcquisition", "Starting data acquisition");
            serviceLocation();

            // Wait for update time:
            try {
                Thread.sleep(getUpdateTime());
            } catch (InterruptedException e) {
                // Carry on
            }
        }
    });

    public void requestLocationUpdates() {
        if (mLocationManager == null) {
            Log.i("FweDataAcquisition", "Requesting location access");
            mLocationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
            try {
                mLocationManager.requestLocationUpdates(LOCATION_PROVIDER, 5000, 10, this);
            } catch (SecurityException e) {
                Log.e("FweDataAcquisition", "Location access denied");
                mLocationManager = null;
            }
        }
    }

    public void serviceLocation() {
        if (mLocationManager == null) {
            return;
        }
        try {
            mLastLocation = mLocationManager.getLastKnownLocation(LOCATION_PROVIDER);
            if (mLastLocation == null) {
                Log.d("FweDataAcquisition", "Location unknown");
                return;
            }
            Fwe.setLocation(mLastLocation.getLatitude(), mLastLocation.getLongitude());
        }
        catch (SecurityException e) {
            Log.d("FweDataAcquisition", "Location access denied");
        }
    }

    private String getLocationSummary()
    {
        if (mLastLocation == null) {
            return "UNKNOWN";
        }
        return String.format(Locale.getDefault(), "%f, %f", mLastLocation.getLatitude(), mLastLocation.getLongitude());
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, @Nullable String key) {

    }

    @Override
    public void onLocationChanged(@NonNull Location location) {

    }
}
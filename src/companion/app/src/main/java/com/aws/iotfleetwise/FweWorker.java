// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

package com.aws.iotfleetwise;

import static android.webkit.ConsoleMessage.MessageLevel.LOG;

import static com.aws.iotfleetwise.R.string.certificatePem;
import static com.aws.iotfleetwise.R.string.privateKey;

import android.content.Context;
import android.content.SharedPreferences;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.telecom.Call;
import android.util.Log;

import androidx.annotation.NonNull;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import androidx.concurrent.futures.CallbackToFutureAdapter;
import androidx.lifecycle.MutableLiveData;
import androidx.work.Data;
import androidx.work.ListenableWorker;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.google.common.util.concurrent.ListenableFuture;

import androidx.concurrent.futures.ResolvableFuture;

import javax.security.auth.callback.Callback;

public class FweWorker
        extends Worker
        implements
        LocationListener {
    private static final String LOCATION_PROVIDER = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
            ? LocationManager.FUSED_PROVIDER
            : LocationManager.GPS_PROVIDER;

    private MutableLiveData<String> locationLiveData = new MutableLiveData<>();
    private MutableLiveData<String> statusLiveData = new MutableLiveData<>();
    private Elm327 mElm327 = null;
    private LocationManager mLocationManager = null;
    private Location mLastLocation = null;
    private List<Integer> mSupportedPids = null;
    private final Object mSupportedSignalsLock = new Object();
    private boolean mReadVehicleProperties = false;
    private List<String> mSupportedVehicleProperties = null;
    private ResolvableFuture<Result> mFuture;

    public FweWorker(Context appContext, WorkerParameters workerParams) {
        super(appContext, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        try {
            ExecutorService executorService = Executors.newSingleThreadExecutor();
            try {
                executorService.submit(() -> {
                    Context applicationContext = getApplicationContext();
                    SharedPreferences mPrefs = applicationContext.getSharedPreferences(applicationContext.getString(R.string.sharedPrefs), Context.MODE_PRIVATE);

                    String vehicleName = mPrefs.getString(applicationContext.getString(R.string.vehicleName), "");
                    String endpointUrl = mPrefs.getString(applicationContext.getString(R.string.endpoint_address), "");
                    String certificate = mPrefs.getString("certificatePem", "");
                    String privateKey = mPrefs.getString(applicationContext.getString(R.string.privateKey), "");
                    String mqttTopicPrefix = mPrefs.getString(applicationContext.getString(R.string.mqttTopicPrefix), "");

                    startListening(applicationContext, vehicleName, endpointUrl, certificate, privateKey, mqttTopicPrefix);
                });
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        catch(Exception ex) {
            ex.printStackTrace();
        }

        return Result.success();
    }

    public void startListening(Context applicationContext, String vehicleName, String endpointUrl, String certificate, String privateKey, String mqttTopicPrefix ) {
        Log.i("FweApplication", "Starting FWE");
        try {
            Thread thread = new Thread() {
                @Override
                public void run() {
                    try {
                        int res = Fwe.run(
                                applicationContext.getAssets(),
                                vehicleName,
                                endpointUrl,
                                certificate,
                                privateKey,
                                mqttTopicPrefix);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            };
            thread.start();
        } catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    @Override
    public void onLocationChanged(Location loc) {
        Log.i("FweApplication", "Location change: Lat: " + loc.getLatitude() + " Long: " + loc.getLongitude());
        locationLiveData.postValue("Location change: Lat: " + loc.getLatitude() + " Long: " + loc.getLongitude());
    }

    public String getStatus() {
        return Fwe.getStatusSummary();
    }

    void serviceLocation() {
        if (mLocationManager == null) {
            return;
        }
        try {
            mLastLocation = mLocationManager.getLastKnownLocation(LOCATION_PROVIDER);
            if (mLastLocation == null) {
                Log.d("FweApplication", "Location unknown");
                return;
            }
            Fwe.setLocation(mLastLocation.getLatitude(), mLastLocation.getLongitude());
        }
        catch (SecurityException e) {
            Log.d("FweApplication", "Location access denied");
        }
    }

    private String getLocationSummary()
    {
        if (mLastLocation == null) {
            return "UNKNOWN";
        }
        return String.format(Locale.getDefault(), "%f, %f", mLastLocation.getLatitude(), mLastLocation.getLongitude());
    }

    private int getUpdateTime()
    {
        int updateTime = R.string.default_update_time;
        try {
                       // updateTime = Integer.parseInt(mPrefs.getString("update_time", String.valueOf(R.string.default_update_time)));
        }
        catch (Exception ignored) {
        }
        if (updateTime == 0) {
            updateTime = R.string.default_update_time;
        }
        updateTime *= 1000;
        return updateTime;
    }

    private static int chrToNibble(char chr)
    {
        int res;
        if (chr >= '0' && chr <= '9') {
            res = chr - '0';
        }
        else if (chr >= 'A' && chr <= 'F') {
            res = 10 + chr - 'A';
        }
        else {
            res = -1; // Invalid hex char
        }
        return res;
    }

    private static int[] convertResponse(String response)
    {
        List<Integer> responseList = new ArrayList<>();
        for (int i = 0; (i + 1) < response.length(); i+=2)
        {
            int highNibble = chrToNibble(response.charAt(i));
            int lowNibble = chrToNibble(response.charAt(i+1));
            if (highNibble < 0 || lowNibble < 0)
            {
                return null;
            }
            responseList.add((highNibble << 4) + lowNibble);
            // Skip over spaces:
            if ((i + 2) < response.length() && response.charAt(i+2) == ' ') {
                i++;
            }
        }
        // Convert list to array:
        int[] arr = new int[responseList.size()];
        for (int i = 0; i < responseList.size(); i++) {
            arr[i] = responseList.get(i);
        }
        return arr;
    }
    public void startDataAquistion() {
        Thread mDataAcquisitionThread = new Thread(() -> {
            while (true) {
                Log.i("FweApplication", "Starting data acquisition");
                serviceLocation();

                // Wait for update time:
                try {
                    Thread.sleep(getUpdateTime());
                } catch (InterruptedException e) {
                    // Carry on
                }
            }
        });
    }
    private void serviceOBD(String bluetoothDevice)
    {
        mElm327.connect(bluetoothDevice);
        if (!checkVehicleConnected()) {
            return;
        }
        int[] pidsToRequest = Fwe.getObdPidsToRequest();
        if (pidsToRequest.length == 0) {
            return;
        }
        Arrays.sort(pidsToRequest);
        List<Integer> supportedPids = new ArrayList<>();
        for (int pid : pidsToRequest) {
            if ((mSupportedPids != null) && !mSupportedPids.contains(pid)) {
                continue;
            }
            Log.i("FweApplication", String.format("Requesting PID: 0x%02X", pid));
            String request = String.format("01 %02X", pid);
            String responseString = mElm327.sendObdRequest(request);
            int[] responseBytes = convertResponse(responseString);
            if ((responseBytes == null) || (responseBytes.length == 0)) {
                Log.e("FweApplication", String.format("No response for PID: 0x%02X", pid));
                // If vehicle is disconnected:
                if (mSupportedPids != null) {
                    synchronized (mSupportedSignalsLock) {
                        mSupportedPids = null;
                    }
                    return;
                }
            }
            else {
                supportedPids.add(pid);
                Fwe.setObdPidResponse(pid, responseBytes);
            }
        }
        if ((mSupportedPids == null) && (supportedPids.size() > 0)) {
            StringBuilder sb = new StringBuilder();
            for (int b : supportedPids) {
                sb.append(String.format("%02X ", b));
            }
            Log.i("FweApplication", "Supported PIDs: " + sb.toString());
            synchronized (mSupportedSignalsLock) {
                mSupportedPids = supportedPids;
            }
        }
    }

    private boolean checkVehicleConnected()
    {
        if (mSupportedPids != null) {
            return true;
        }
        Log.i("FweApplication", "Checking if vehicle connected...");
        String response = mElm327.sendObdRequest(Elm327.CMD_OBD_SUPPORTED_PIDS_0);
        int[] responseBytes = convertResponse(response);
        boolean result = (responseBytes != null) && (responseBytes.length > 0);
        Log.i("FweApplication", "Vehicle is " + (result ? "CONNECTED" : "DISCONNECTED"));
        return result;
    }

    private int[] getVehiclePropertyIds(int[][] vehiclePropertyInfo)
    {
        Set<Integer> propIds = new LinkedHashSet<>();
        for (int[] info : vehiclePropertyInfo)
        {
            propIds.add(info[0]);
        }
        int[] arr = new int[propIds.size()];
        int i = 0;
        for (Integer id : propIds)
        {
            arr[i++] = id;
        }
        return arr;
    }

    private int getVehiclePropertySignalId(int[][] vehiclePropertyInfo, int propId, int areaIndex, int resultIndex)
    {
        for (int[] info : vehiclePropertyInfo)
        {
            if ((propId == info[0]) && (areaIndex == info[1]) && (resultIndex == info[2]))
            {
                return info[3];
            }
        }
        return -1;
    }


}

/*
    @SuppressLint("DefaultLocale")
    private void serviceCarProperties()
    {
        List<String> supportedProps = new ArrayList<>();
        int[][] propInfo = Fwe.getVehiclePropertyInfo();
        int[] propIds = getVehiclePropertyIds(propInfo);
        for (int propId : propIds) {
            String propName = VehiclePropertyIds.toString(propId);
            //CarPropertyConfig config = mCarPropertyManager.getCarPropertyConfig(propId);
            if (config == null) {
                Log.d("serviceCarProperties", "Property unavailable: "+propName);
                continue;
            }
            int[] areaIds = config.getAreaIds();
            Class<?> clazz = config.getPropertyType();
            for (int areaIndex = 0; areaIndex < areaIds.length; areaIndex++) {
                int signalId = getVehiclePropertySignalId(propInfo, propId, areaIndex, 0);
                if (signalId < 0) {
                    Log.d("serviceCarProperties", String.format("More area IDs (%d) than expected (%d) for %s", areaIds.length, areaIndex + 1, propName));
                    break;
                }
                CarPropertyValue propVal;
                try {
                    propVal = mCarPropertyManager.getProperty(clazz, propId, areaIds[areaIndex]);
                } catch (IllegalArgumentException ignored) {
                    Log.w("serviceCarProperties", String.format("Could not get %s 0x%X", propName, areaIds[areaIndex]));
                    continue;
                } catch (SecurityException e) {
                    Log.w("serviceCarProperties", String.format("Access denied for %s 0x%X", propName, areaIds[areaIndex]));
                    continue;
                }
                if (areaIndex == 0) {
                    supportedProps.add(propName);
                }
                StringBuilder sb = new StringBuilder();
                sb.append(String.format("%s 0x%X: ", propName, areaIds[areaIndex]));
                if (clazz.equals(Boolean.class)) {
                    double val = (boolean) propVal.getValue() ? 1.0 : 0.0;
                    sb.append(val);
                    Fwe.setVehicleProperty(signalId, val);
                } else if (clazz.equals(Integer.class) || clazz.equals(Float.class)) {
                    double val = ((Number)propVal.getValue()).doubleValue();
                    sb.append(val);
                    Fwe.setVehicleProperty(signalId, val);
                } else if (clazz.equals(Integer[].class) || clazz.equals(Long[].class)) {
                    sb.append("[");
                    for (int resultIndex = 0; resultIndex < Array.getLength(propVal.getValue()); resultIndex++) {
                        if (resultIndex > 0) {
                            signalId = getVehiclePropertySignalId(propInfo, propId, areaIndex, resultIndex);
                            if (signalId < 0) {
                                Log.d("serviceCarProperties", String.format("More results (%d) than expected (%d) for %s 0x%X", Array.getLength(propVal.getValue()), resultIndex + 1, propName, areaIds[areaIndex]));
                                break;
                            }
                        }
                        double val = ((Number)Array.get(propVal.getValue(), resultIndex)).doubleValue();
                        if (resultIndex > 0) {
                            sb.append(", ");
                        }
                        sb.append(val);
                        Fwe.setVehicleProperty(signalId, val);
                    }
                    sb.append("]");
                } else {
                    Log.w("serviceCarProperties", "Unsupported type " + clazz.toString() + " for " + propName);
                    continue;
                }
                Log.i("serviceCarProperties", sb.toString());
            }
        }
        if ((mSupportedVehicleProperties == null) && (supportedProps.size() > 0)) {
            Collections.sort(supportedProps);
            synchronized (mSupportedSignalsLock) {
                mSupportedVehicleProperties = supportedProps;
            }
        }
    }


    @Override
    public int onStartCommand(Intent intent, int flagsId, int startId) {
        super.onStartCommand(intent, flagsId, startId);
        Bundle extras = intent.getExtras();
        //if (extras == null) {
        //    Log.d("Service", "null");
        //}
        //else {
        //        Log.d("Service","not null");
        //        String from = (String) extras.get("From");
        //        if(from.equalsIgnoreCase("Main"))
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            mLocationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
            mLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 1, this);
        }
        mRunFWE.start();
        String status = Fwe.getStatusSummary();
        statusLiveData.postValue(status);
        return flagsId;
    }

        public void requestLocationUpdates() {
        if (mLocationManager == null) {
            Log.i("FweApplication", "Requesting location access");
            mLocationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            try {
                mLocationManager.requestLocationUpdates(LOCATION_PROVIDER, 5000, 10, this);
            } catch (SecurityException e) {
                Log.e("FweApplication", "Location access denied");
                mLocationManager = null;
            }
        }
    }

    public String getStatusSummary()
    {
        StringBuilder sb = new StringBuilder();
        synchronized (mSupportedSignalsLock) {
            if (isCar()) {
                if (mSupportedVehicleProperties != null) {
                    if (mSupportedVehicleProperties.size() == 0) {
                        sb.append("NONE");
                    } else {
                        sb.append("Supported vehicle properties: ")
                                .append(String.join(", ", mSupportedVehicleProperties));
                    }
                }
            }
            else {
                sb.append("Bluetooth: ")
                        .append(mElm327.getStatus())
                        .append("\n\n")
                        .append("Supported OBD PIDs: ");
                if (mSupportedPids == null) {
                    sb.append("VEHICLE DISCONNECTED");
                } else if (mSupportedPids.size() == 0) {
                    sb.append("NONE");
                } else {
                    for (int pid : mSupportedPids) {
                        sb.append(String.format("%02X ", pid));
                    }
                }
            }
        }
        sb.append("\n\n")
                .append("Location: ")
                .append(getLocationSummary())
                .append("\n\n")
                .append(Fwe.getStatusSummary());
        return sb.toString();
    }

*/
package com.aws.iotfleetwise.ui.home;

import static android.app.Activity.RESULT_OK;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.PermissionChecker;
import androidx.fragment.app.Fragment;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.aws.iotfleetwise.Fwe;
import com.aws.iotfleetwise.FweDataAcquisition;
import com.aws.iotfleetwise.FweWorker;
import com.aws.iotfleetwise.QRCodeScannerActivity;
import com.aws.iotfleetwise.R;
import com.aws.iotfleetwise.databinding.FragmentHomeBinding;
import com.aws.iotfleetwise.ui.SharedViewModel;
import com.google.common.util.concurrent.ListenableFuture;

import androidx.activity.result.ActivityResultLauncher;
import android.Manifest;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.contract.ActivityResultContracts;

import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;
import androidx.work.WorkQuery;
import androidx.work.WorkerParameters;

import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.Arrays;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import javax.xml.datatype.Duration;

public class HomeFragment extends Fragment {
    private FragmentHomeBinding binding;
    private Button mButton;
    private Button mBeginTrip;
    private Button mScanQRCode;
    private View location;
    private SharedViewModel model;
    private WorkManager mWorkManager;
    ActivityResultLauncher<String[]> locationPermissionRequest =
            registerForActivityResult(new ActivityResultContracts
                            .RequestMultiplePermissions(), result -> {
                        Boolean fineLocationGranted = result.getOrDefault(
                            Manifest.permission.ACCESS_FINE_LOCATION, false);
                            location = this.getActivity().findViewById(R.id.layoutLocation);
                            location.setVisibility(View.GONE);
                        Boolean coarseLocationGranted = result.getOrDefault(
                                Manifest.permission.ACCESS_COARSE_LOCATION,false);
                        if (fineLocationGranted != null && fineLocationGranted) {
                            // Precise location access granted.
                        } else if (coarseLocationGranted != null && coarseLocationGranted) {
                            // Only approximate location access granted.
                        } else {
                            // No location access granted.
                        }
                    }
            );

    ActivityResultLauncher<Intent> startActivityForResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    String rValues = result.getData().getExtras().get("values").toString();

                    JSONObject jObject = null;
                    try {
                        jObject = new JSONObject(rValues);

                        saveSharedPrefs(jObject);

                        if(jObject.getString("vehicleName").length() > 0) {
                            View contentView = getActivity().findViewById(R.id.layoutConnect);
                            contentView.setVisibility(View.GONE);
                            if(!WorkManager.isInitialized()) {
                                mWorkManager = WorkManager.getInstance(getContext());
                                OneTimeWorkRequest sendDataBuilder = new OneTimeWorkRequest.Builder(FweWorker.class).build();
                                mWorkManager.enqueueUniqueWork("Send Data", ExistingWorkPolicy.REPLACE, sendDataBuilder);
                            }

                            TextView tv = getActivity().findViewById(R.id.connected);
                            tv.setText("Attempting to connect to AWS IoT Core...");
                        }
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                    getActivity().setResult(RESULT_OK);
                } else if (result.getResultCode() == AppCompatActivity.RESULT_CANCELED) {
                    Bundle extras = result.getData().getExtras();
                    if(extras != null) {
                        String error = extras.getString("errorType");
                        if(error.equals("FileNotFound")) {
                            Toast.makeText(getContext(), "QR Code expired", Toast.LENGTH_LONG).show();
                        }
                    }
                }
            }
    );
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home,
                container, false);
        HomeViewModel homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);
              binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Get the ViewModel.
        model = new ViewModelProvider(getParentFragment().getActivity()).get(SharedViewModel.class);

        return root;
    }
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        Data.Builder builder = new Data.Builder();
        super.onViewCreated(view, savedInstanceState);
        Context c = getParentFragment().getActivity().getApplicationContext();
        TextView tv = view.findViewById(R.id.connected);
        tv.setText("Attempting to connect to AWS IoT FleetWise...");
        SharedPreferences sharedPref = getActivity().getSharedPreferences(getString(R.string.sharedPrefs), Context.MODE_PRIVATE);
        Boolean isValid = false;
        String vehicleName = sharedPref.getString("vehicleName", "");
        if (vehicleName.length() > 0) {
            View contentView = view.findViewById(R.id.layoutConnect);
            contentView.setVisibility(View.GONE);
            isValid = true;
        } else {
            View contentView = view.findViewById(R.id.layoutCampaign);
            contentView.setVisibility(View.GONE);
            tv.setText("Not Connected to AWS IoT FleetWise");
        }

        mButton = view.findViewById(R.id.allowLocation);
        mButton.setOnClickListener(v -> locationPermissionRequest.launch(new String[]{
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        }));
        mBeginTrip = view.findViewById(R.id.beginTrip);

        mScanQRCode =  view.findViewById(R.id.scanQRCode);
        mScanQRCode.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), QRCodeScannerActivity.class);
            startActivityForResult.launch(intent);
        });
        if (ContextCompat.checkSelfPermission(view.getContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PermissionChecker.PERMISSION_GRANTED) {
            View contentView = view.findViewById(R.id.layoutLocation);
            contentView.setVisibility(View.GONE);
            if (vehicleName.length() > 0) isValid = true;
        } else isValid = true;

        //we have a car, let's start the service automatically to start bringing in data
        if(isValid) {
            if(!WorkManager.isInitialized()) {
                mWorkManager = WorkManager.getInstance(c);
                OneTimeWorkRequest sendDataBuilder = new OneTimeWorkRequest.Builder(FweWorker.class).build();
                mWorkManager.enqueueUniqueWork("Start FWE", ExistingWorkPolicy.REPLACE, sendDataBuilder);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        update();
                    }
                }, 5000);   // give it a 5 seconds to connect


                mBeginTrip.setVisibility(View.VISIBLE);
                mBeginTrip.setOnClickListener(v -> {
                    Log.i("requestPermissions", "Permissions granted, starting data acquisition");
                    FweDataAcquisition fweDataAcquisition = new FweDataAcquisition(getContext());
                    fweDataAcquisition.requestLocationUpdates();
                    fweDataAcquisition.serviceLocation();
                });
            }
        }
        //then check status every 60 seconds
        new Timer().scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                update();
            }
        }, 0, 60000);
    }

    private void update() {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                String statusSummary = Fwe.getStatusSummary();
                if(statusSummary.length() > 0) {
                    Boolean connected = isConnected(statusSummary);
                    String campaigns = getCampaigns(statusSummary);
                    String payloads = getPayloads(statusSummary);
                    TextView tv = getView().findViewById(R.id.connected);
                    TextView tvCampaigns = getView().findViewById(R.id.tvCampaigns);
                    TextView tvPayloads = getView().findViewById(R.id.tvPayloads);
                    ImageView iv = getView().findViewById(R.id.connected_textview);
                    if (connected) {
                        tv.setText("Connected to AWS IoT FleetWise");
                        iv.setBackgroundResource(R.drawable.green_circle);
                        tvCampaigns.setText(campaigns);
                        tvPayloads.setText(payloads);
                        View contentView = getView().findViewById(R.id.layoutCampaign);
                        contentView.setVisibility(View.VISIBLE);
                        mBeginTrip.setVisibility(View.VISIBLE);

                    } else {
                        iv.setBackgroundResource(R.drawable.red_circle);
                        tv.setText("Not Connected to AWS IoT FleetWise");
                        tvCampaigns.setText("");
                        tvPayloads.setText("0");
                    }
                }
            }
        });
    }
    public boolean isConnected(String status) {
        String[] separated = status.split(":");
        String[] connected = separated[1].split("\n");
        if(connected[0].trim().equals("CONNECTED")) return true;
        return false;
    }

    public String getCampaigns(String status) {
        String[] separated = status.split("Campaign ARNs:");
        String[] connected = separated[1].split("\n");
        if(connected[0].trim().length() == 0) return connected[1];
        else return "";
    }

    public String getPayloads(String status) {
        String[] separated = status.split("Payloads sent:");
        String[] connected = separated[1].split("\n");
        if(connected[0].trim().length() > 0) return connected[0].trim();
        else return "0";
    }
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    protected void saveSharedPrefs(JSONObject jObject) {
        try {

            String vehiclename = jObject.getString("vehicleName");
            String endpoint = jObject.getString("endpointAddress");
            String certificateArn = jObject.getString("certificateArn");
            String certificateId = jObject.getString("certificateId");
            String privateKey = jObject.getString("privateKey");
            String certificatePem = jObject.getString("certificatePem");

            SharedPreferences sharedPref = getContext().getSharedPreferences(getString(R.string.sharedPrefs), getContext().MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putString("vehicleName", vehiclename);
            editor.putString(getString(R.string.endpoint_address), endpoint);
            editor.putString("certificateId", certificateId);
            editor.putString(getString(R.string.privateKey), privateKey);
            editor.putString("certificatePem", certificatePem);
            editor.putString("certificateArn", certificateArn);

            editor.commit();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}


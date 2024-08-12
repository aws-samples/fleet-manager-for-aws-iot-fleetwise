package com.aws.iotfleetwise.ui.preferences;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.aws.iotfleetwise.MainActivity;
import com.aws.iotfleetwise.QRCodeScannerActivity;
import com.aws.iotfleetwise.R;
import com.aws.iotfleetwise.databinding.FragmentPreferencesBinding;

import java.util.ArrayList;
import java.util.List;

import pub.devrel.easypermissions.AfterPermissionGranted;
import pub.devrel.easypermissions.EasyPermissions;

public class PreferencesFragment extends Fragment {
    private static final int REQUEST_PERMISSIONS = 100;
    private static final int REQUEST_BLUETOOTH = 200;
    private static final int REQUEST_CONFIGURE_VEHICLE = 300;
    private static final int REQUEST_ABOUT = 400;
    private FragmentPreferencesBinding binding;
    private Button mButton;
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        PreferencesViewModel notificationsViewModel =
                new ViewModelProvider(this).get(PreferencesViewModel.class);

        binding = FragmentPreferencesBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textPreferences;
        notificationsViewModel.getText().observe(getViewLifecycleOwner(), textView::setText);

        mButton = binding.scanQRCode1;
        mButton.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), QRCodeScannerActivity.class);
            ((Activity) getContext()).startActivityForResult(intent, 1);

        });
        return root;
    }

    @AfterPermissionGranted(REQUEST_PERMISSIONS) // This causes this function to be called again after the user has approved access
    private void requestPermissions()
    {
        List<String> perms = new ArrayList<>();
        perms.add(Manifest.permission.ACCESS_FINE_LOCATION);
        String rationale = "Location";
       /* if (((FweService)get.getApplication()).isCar()) {
            perms.add(Car.PERMISSION_ENERGY);
            perms.add(Car.PERMISSION_SPEED);
            rationale += " and car information";
        }
        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            perms.add(Manifest.permission.BLUETOOTH_CONNECT);
            rationale += " and Bluetooth";
        }
        String[] permsArray = perms.toArray(new String[0]);
        if (!EasyPermissions.hasPermissions(null, permsArray)) {
            Log.i("requestPermissions", "Requesting permissions");
            EasyPermissions.requestPermissions(this, rationale+" access required", REQUEST_PERMISSIONS, permsArray);
        }
        else {
            Log.i("requestPermissions", "Permissions granted, starting data acquisition");
            ((FweService)getActivity().getApplication()).requestLocationUpdates();
        }*/
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }


}
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

package com.aws.iotfleetwise;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

public class ConfigureVehicleActivity extends AppCompatActivity {
    private Button mButton;
    ActivityResultLauncher<Intent> startActivityForResult = registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
            if (result.getResultCode() == AppCompatActivity.RESULT_OK) {
                Intent data = result.getData();
                setResult(RESULT_OK);
                finish();
            } else if (result.getResultCode() == AppCompatActivity.RESULT_CANCELED) {
                Bundle extras = result.getData().getExtras();
                if(extras != null) {
                    String error = extras.getString("errorType");
                    if(error.equals("FileNotFound")) {
                        Toast.makeText(this, "QR Code expired", Toast.LENGTH_LONG).show();
                    }
                }
            }
        }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_configure_vehicle);
        setResult(Activity.RESULT_CANCELED);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
/*
        mButton = findViewById(R.id.scanQRCode);
        mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ConfigureVehicleActivity.this, QRCodeScannerActivity.class);
                //myIntent.putExtra("key", value); //Optional parameters
                startActivityForResult.launch(intent);

            }
        });
*/
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }

}


package com.aws.iotfleetwise;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        setContentView(R.layout.activity_splash);
        // Navigate to the main activity after a delay (e.g., 2000 milliseconds)
        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        Intent mainIntent = new Intent(SplashActivity.this, MainActivity.class);
                        startActivity(mainIntent);
                        finish();
                    }
                },
                2000 // Set the delay time in milliseconds
        );
    }
}
package com.aws.iotfleetwise.ui.home;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class HomeViewModel extends ViewModel {

    private final MutableLiveData<String> mText;

    public HomeViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("Your device has not been configured to connect to AWS IoT FleetWise. Please use the AWS IoT FleetWise Fleet Management tool to provision a vehicle to your account.");
    }

    public LiveData<String> getText() {
        return mText;
    }
}
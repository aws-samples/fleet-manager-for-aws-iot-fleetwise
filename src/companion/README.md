# AWS IoT FleetWise Fleet Manager Companion Application

In addition to the FleetWise Fleet Manager platform, we have built a companion application which will help pull telemetry off the vehicle via an OBD II port. For now, the Android application allows customers to connect an application running FleetWise agent on an Android phone and tracks the GPS location of the vehicle in the Fleet Manager portal. To use the FleetWise Fleet Manager companion application, clone the [IoT FleetWise Companion application](https://github.com/aws-samples/fleet-manager-for-aws-iot-fleetwise/src/companion) and build the project in [Android Studio](https://developer.android.com/studio/install) for your specific Android device (TODO:// provide an APK to download directly).

From there, within AWS IoT FleetWise Fleet Manager portal, add a Fleet called ```Android```. This will create an Android specific decoder manifest which will allow the GPS signals to be pushed to the FleetWise edge agent over JNI. From there, every 30 seconds the FleetWise campaign will capture Latitutde + Longitude and send them to the cloud once the ```Begin Data Aquisition``` button is clicked. (TODO:// need to develop the ```Trips``` concept to begin and end a trip)

Using the ```Link Device``` feature in the FleetWise Fleet Manager, you can generate a QR Code which will allow you to link your Android application to your proper FleetWise Fleet Manager instance.

![featurelink](/docs/fwfm-linkdevice.png)

From here, we can pull up the FleetWise Fleet Manager Companion Application on our Android device:

![featurelink](/docs/fwfm-android.png)

And select Scan QR Code:

![featurelink](/docs/fwfm-android3.png)

Then your device should connect to AWS IoT FleetWise:

![featurelink](/docs/fwfm-android4.png)

## Android Automotive User Guide


## Android Developer Guide

[Optional] - We have built the FleetWise Edge 1.1.1 libraries already and included them in the jniLibs in the ```src``` folder
This guide details how to build the app from source code and use the shared library in your own
Android apps. 

### App build guide

An x86_64 Ubuntu 20.04 development machine with 200GB free disk space should be used.

1. Clone the source code:

   ```bash
   git clone https://github.com/aws/aws-iot-fleetwise-edge.git ~/aws-iot-fleetwise-edge \
   && cd ~/aws-iot-fleetwise-edge
   ```

1. Install the dependencies:

   ```bash
   sudo -H ./tools/install-deps-cross-android.sh
   ```

1. Build the shared libraries:

   ```bash
   ./tools/build-fwe-cross-android.sh \
   && ./tools/build-dist.sh \
       build/x86_64/libaws-iot-fleetwise-edge.so:x86_64 \
       build/arm64-v8a/libaws-iot-fleetwise-edge.so:arm64-v8a \
       build/armeabi-v7a/libaws-iot-fleetwise-edge.so:armeabi-v7a
   ```

1. Build the app:

   ```bash
    mkdir -p tools/android-app/app/src/main/jniLibs \
    && cp -r build/dist/x86_64 build/dist/arm64-v8a build/dist/armeabi-v7a tools/android-app/app/src/main/jniLibs \
    && cp THIRD-PARTY-LICENSES tools/android-app/app/src/main/assets \
    && cd tools/android-app \
    && ANDROID_HOME=/usr/local/android_sdk ./gradlew assemble
   ```

### Shared library interface

The C++ code is compiled into a shared library using the Android NDK. The interface for shared
library can be found in the JNI wrapper class `app/src/main/java/com/aws/iotfleetwise/Fwe.java`. The
shared library can also be used in your app using this interface, which includes a method to ingest
raw CAN frame data.


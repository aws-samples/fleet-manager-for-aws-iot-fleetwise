# Android App for AWS IoT FleetWise

This app demonstrates AWS IoT FleetWise using an Android smartphone.

TODO: more dteails

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

### Android Automotive system image build guide

This guide details how to build the Android Automotive system image from source, in order for the
app to have access to the privileged VHAL properties. These properties are only accessible to apps
signed with the platform certificate, which in this case will be the
[standard Android test certificate](https://android.googlesource.com/platform/build/+/master/target/product/security/platform.x509.pem).

**Prerequisites:**

- A high performance x86_64 Ubuntu 20.04 development machine (e.g. an `m6a.8xlarge` EC2 instance)
  with 300 GB free storage space.
- A local x86_64 Ubuntu 20.04 machine with [Android Studio](https://developer.android.com/studio)
  and the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  installed.

**References:**

- [Android Virtual Device as a Development Platform](https://source.android.com/docs/automotive/start/avd/android_virtual_device)
- [AAOS car AVD tools](https://android.googlesource.com/device/generic/car/+/refs/heads/master/tools)

1. _On the development machine_, install the dependencies for compiling the system image:

   ```bash
   sudo apt update \
   && DEBIAN_FRONTEND=noninteractive sudo -E apt install -y default-jdk zip unzip libncurses5 binutils python curl \
   && sudo curl -o /usr/local/bin/repo https://storage.googleapis.com/git-repo-downloads/repo \
   && sudo chmod +x /usr/local/bin/repo \
   && git config user.name > /dev/null || git config --global user.name "ubuntu" \
   && git config user.email > /dev/null || git config --global user.email "ubuntu@`hostname`" \
   && git config color.ui || git config --global color.ui false
   ```

1. Run the following commands to build the Android Automotive system image. **This will take several
   hours.**

   ```bash
   ANDROID_BRANCH="android12L-release" \
   && REPO_URL="https://android.googlesource.com/platform/manifest" \
   && mkdir $ANDROID_BRANCH \
   && cd $ANDROID_BRANCH \
   && repo init -u $REPO_URL -b $ANDROID_BRANCH --partial-clone \
   && repo sync -c -j8 \
   && source build/envsetup.sh \
   && lunch sdk_car_x86_64-userdebug \
   && m -j`nproc`
   ```

1. Create the file `emu_img_zip.mk` and add the content from
   [here](https://cs.android.com/android/platform/superproject/+/master:device/generic/goldfish/tasks/emu_img_zip.mk),
   then create the Android Virtual Device (AVD) image ZIP file.

   ```bash
   m emu_img_zip
   ```

1. _On your local machine_, run the following to download and unzip the AVD image ZIP file in the
   `~/Android/Sdk/system-images` folder:

   ```bash
   scp -i <PATH_TO_PEM> ubuntu@<EC2_IP_ADDRESS>:/home/ubuntu/android12L-release/out/target/product/emulator_car_x86_64/sdk-repo-linux-system-images-eng.ubuntu.zip . \
   && unzip -d ~/Android/Sdk/system-images/car_avd \
      sdk-repo-linux-system-images-eng.ubuntu.zip
   ```

1. Create the file `create_avd_config.sh` and add the content from
   [here](https://android.googlesource.com/device/generic/car/+/refs/heads/master/tools/create_avd_config.sh),
   then create the AVD config file (with display settings 213 DPI, 1920x1080 resolution, and 3584 MB
   of memory):

   ```bash
   bash create_avd_config.sh \
      car_avd \
      ~ \
      $HOME/Android/Sdk/system-images/car_avd/x86_64/ \
      213 \
      1920 \
      1080 \
      3584 \
      x86_64
   ```

1. Run the emulator, which will start AAOS:

   ```bash
   ANDROID_SDK_ROOT=~/Android/Sdk ~/Android/Sdk/emulator/emulator -avd car_avd
   ```

1. Copy the platform key and certificate from the development machine (this is the
   [standard Android test certificate](https://android.googlesource.com/platform/build/+/master/target/product/security/platform.x509.pem)):

   ```bash
   scp -i <PATH_TO_PEM> ubuntu@<EC2_IP_ADDRESS>:/home/ubuntu/android12L-release/build/target/product/security/platform.x509.pem .
   scp -i <PATH_TO_PEM> ubuntu@<EC2_IP_ADDRESS>:/home/ubuntu/android12L-release/build/target/product/security/platform.pk8 .
   ```

1. Download the app from GitHub and re-sign it with the platform key, so that the app has access to
   the AAOS VHAL properties with privileged level permissions:

   ```bash
   curl -o aws-iot-fleetwise-edge-original.apk https://github.com/aws/aws-iot-fleetwise-edge/releases/latest/download/aws-iot-fleetwise-edge.apk \
   && `ls -d ~/Android/Sdk/build-tools/* | tail -n -1`/apksigner sign \
      --key platform.pk8 \
      --cert platform.x509.pem \
      --out aws-iot-fleetwise-edge.apk \
      aws-iot-fleetwise-edge-original.apk
   ```

1. Install the app using `adb`:

   ```bash
   ~/Android/Sdk/platform-tools/adb install aws-iot-fleetwise-edge.apk
   ```

1. You can now follow the [this section](#provision-credentials-and-collect-data) to provision
   credentials and collect data.
# iot-fleetwise-companion

# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.22

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/android_sdk/cmake/3.22.1/bin/cmake

# The command to remove a file.
RM = /usr/local/android_sdk/cmake/3.22.1/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/ubuntu/aws-iot-fleetwise-edge

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a

# Include any dependencies generated for this target.
include CMakeFiles/aws-iot-fleetwise-edge.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/aws-iot-fleetwise-edge.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/aws-iot-fleetwise-edge.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/aws-iot-fleetwise-edge.dir/flags.make

CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o: CMakeFiles/aws-iot-fleetwise-edge.dir/flags.make
CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o: ../../src/android_shared_library.cpp
CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o: CMakeFiles/aws-iot-fleetwise-edge.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o"
	/usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ --target=armv7-none-linux-androideabi21 --sysroot=/usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/sysroot $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o -MF CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o.d -o CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o -c /home/ubuntu/aws-iot-fleetwise-edge/src/android_shared_library.cpp

CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.i"
	/usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ --target=armv7-none-linux-androideabi21 --sysroot=/usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/sysroot $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/ubuntu/aws-iot-fleetwise-edge/src/android_shared_library.cpp > CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.i

CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.s"
	/usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ --target=armv7-none-linux-androideabi21 --sysroot=/usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/sysroot $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/ubuntu/aws-iot-fleetwise-edge/src/android_shared_library.cpp -o CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.s

# Object files for target aws-iot-fleetwise-edge
aws__iot__fleetwise__edge_OBJECTS = \
"CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o"

# External object files for target aws-iot-fleetwise-edge
aws__iot__fleetwise__edge_EXTERNAL_OBJECTS = \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/AwsBootstrap.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/AwsIotChannel.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/AwsIotConnectivityModule.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/AwsSDKMemoryManager.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CacheAndPersist.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CANDataConsumer.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CANDataSource.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CANDecoder.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CheckinAndPersistency.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ClockHandler.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CollectionInspectionEngine.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CollectionInspectionWorkerThread.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CollectionSchemeIngestion.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CollectionSchemeIngestionList.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CollectionSchemeManager.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ConsoleLogger.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CPUUsageInfo.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/DataSenderManager.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/DataSenderManagerWorkerThread.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/DataSenderProtoWriter.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/DecoderDictionaryExtractor.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/DecoderManifestIngestion.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ExternalCANDataSource.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/Geohash.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/GeohashFunctionNode.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/InspectionMatrixExtractor.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/IoTFleetWiseConfig.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/IoTFleetWiseEngine.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ISOTPOverCANReceiver.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ISOTPOverCANSender.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ISOTPOverCANSenderReceiver.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/LoggingModule.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/MemoryUsageInfo.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/OBDDataDecoder.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/OBDOverCANECU.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/OBDOverCANModule.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/PayloadManager.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/RemoteProfiler.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/RetryThread.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/Schema.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/Thread.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/TraceModule.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/IoTFleetWiseVersion.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/ExternalGpsSource.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/AaosVhalSource.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe.dir/src/CustomDataSource.cpp.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe-proto.dir/common_types.pb.cc.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe-proto.dir/collection_schemes.pb.cc.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe-proto.dir/decoder_manifest.pb.cc.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe-proto.dir/checkin.pb.cc.o" \
"/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/fwe-proto.dir/vehicle_data.pb.cc.o"

libaws-iot-fleetwise-edge.so: CMakeFiles/aws-iot-fleetwise-edge.dir/src/android_shared_library.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/AwsBootstrap.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/AwsIotChannel.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/AwsIotConnectivityModule.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/AwsSDKMemoryManager.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CacheAndPersist.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CANDataConsumer.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CANDataSource.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CANDecoder.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CheckinAndPersistency.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ClockHandler.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CollectionInspectionEngine.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CollectionInspectionWorkerThread.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CollectionSchemeIngestion.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CollectionSchemeIngestionList.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CollectionSchemeManager.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ConsoleLogger.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CPUUsageInfo.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/DataSenderManager.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/DataSenderManagerWorkerThread.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/DataSenderProtoWriter.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/DecoderDictionaryExtractor.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/DecoderManifestIngestion.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ExternalCANDataSource.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/Geohash.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/GeohashFunctionNode.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/InspectionMatrixExtractor.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/IoTFleetWiseConfig.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/IoTFleetWiseEngine.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ISOTPOverCANReceiver.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ISOTPOverCANSender.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ISOTPOverCANSenderReceiver.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/LoggingModule.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/MemoryUsageInfo.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/OBDDataDecoder.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/OBDOverCANECU.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/OBDOverCANModule.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/PayloadManager.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/RemoteProfiler.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/RetryThread.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/Schema.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/Thread.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/TraceModule.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/IoTFleetWiseVersion.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/ExternalGpsSource.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/AaosVhalSource.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe.dir/src/CustomDataSource.cpp.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe-proto.dir/common_types.pb.cc.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe-proto.dir/collection_schemes.pb.cc.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe-proto.dir/decoder_manifest.pb.cc.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe-proto.dir/checkin.pb.cc.o
libaws-iot-fleetwise-edge.so: CMakeFiles/fwe-proto.dir/vehicle_data.pb.cc.o
libaws-iot-fleetwise-edge.so: CMakeFiles/aws-iot-fleetwise-edge.dir/build.make
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-cpp-sdk-core.a
libaws-iot-fleetwise-edge.so: /usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/arm-linux-androideabi/21/libz.so
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-crt-cpp.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-mqtt.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-event-stream.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-s3.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-auth.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-http.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-io.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libs2n.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libcrypto.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-compression.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-cal.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-sdkutils.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-checksums.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libaws-c-common.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libcurl.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libssl.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libcrypto.a
libaws-iot-fleetwise-edge.so: /usr/local/android_sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/arm-linux-androideabi/21/libz.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libsnappy.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libjsoncpp.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libprotobuf.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libboost_thread.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libboost_filesystem.a
libaws-iot-fleetwise-edge.so: /usr/local/armv7a-linux-androideabi/lib/libboost_atomic.a
libaws-iot-fleetwise-edge.so: CMakeFiles/aws-iot-fleetwise-edge.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX shared library libaws-iot-fleetwise-edge.so"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/aws-iot-fleetwise-edge.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/aws-iot-fleetwise-edge.dir/build: libaws-iot-fleetwise-edge.so
.PHONY : CMakeFiles/aws-iot-fleetwise-edge.dir/build

CMakeFiles/aws-iot-fleetwise-edge.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/aws-iot-fleetwise-edge.dir/cmake_clean.cmake
.PHONY : CMakeFiles/aws-iot-fleetwise-edge.dir/clean

CMakeFiles/aws-iot-fleetwise-edge.dir/depend:
	cd /home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/ubuntu/aws-iot-fleetwise-edge /home/ubuntu/aws-iot-fleetwise-edge /home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a /home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a /home/ubuntu/aws-iot-fleetwise-edge/build/armeabi-v7a/CMakeFiles/aws-iot-fleetwise-edge.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/aws-iot-fleetwise-edge.dir/depend


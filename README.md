
# AWS IoT FleetWise Fleet Manager 

The AWS IoT FleetWise Fleet Manager provides a front-end user experience to the [AWS IoT FleetWise service](https://aws.amazon.com/iot-fleetwise/), creating the ability for customers and partners to develop fleet management platforms using AWS IoT Fleetwise. This reference implementation provides a front-end application using [Amazon Location Services](https://aws.amazon.com/pm/location/) as a mapping component, a vehicle simulator using (Amazon Elastic Container Service (Amazon ECS))[https://aws.amazon.com/ecs/] and uses [AWS IoT FleetWise service](https://aws.amazon.com/iot-fleetwise/) to model vehicles, transform vehicle data into human-readable values, and control what vehicle data to collect and when to transfer selected data to the cloud.

This project can be easily deployed into your account using the instructions below and will provide the capaibilty to simulate vehicle data from a standard vehicle model that will get setup when deployed through CDK. To add external devices (such as a dongle or a phone), this can be done as well and you are not limited to just using the simulator as is. There is a capability to download the IoT certificates to run locally on the device to authenticate to device to IoT Core.

The simulator uses the public ECR docker image of the [Fleet Wise Edge Agent](https://github.com/aws/aws-iot-fleetwise-edge) to communicate with another Docker image which is producting the simulation onto the vehicle's virtual network.

# FleetWise Fleet Manager Architecture

AWS IoT FleetWise is an AWS service that enables automakers and fleet operators to collect, store, organize, and monitor data from vehicles. Automakers need the ability to connect remotely to their fleet of vehicles and collect vehicle ECU/sensor data. AWS IoT FleetWise can be used by OEM engineers and data scientists to build vehicle models that can be used to build custom data collection schemes. These data collection schemes enables the OEM to optimize the data collection process by defining what signals to collect, how often to collect them, and most importantly the trigger conditions ("events") that enable the collection process.

Customers can define the data collection schemes to trigger based on a schedule or on specific conditions such as, but not limited to: 1. Ambient temperature dropping to below 0 degree or 2. Vehicle crosses state lines or 3. Active diagnostic trouble codes. These conditions are sent to the vehicle through a set of documents called data collection schemes. In summary, your Edge Agent collects the data of interest according to the data collection schemes and decoding rules as specified by the OEM on the AWS IoT FleetWise Console.

The following diagram illustrates a high-level architecture of the system that can be deployed.

![alt text](/docs/architecture-fw-fm.png)

# How to Deploy 
## Backend Deployment
1. Set up the Virtual Environment:
* Create a virtual environment using Python:
On MacOS and Linux:
```
    python -m venv .venv
```
On Windows:
```
    python -m venv .venv
```

2.	Activate the Virtual Environment:
On MacOS and Linux:
```
    source .venv/bin/activate
```
On Windows:
```
    .venv\Scripts\activate.bat
```

3.	Install Dependencies:
Ensure the virtual environment is activated, then install the required dependencies:
```
    pip install -r requirements.txt
```

4.	Create Configuration File:
Copy the config.template.yaml file to create a config.yaml file and modify account #:
```
    cp config.template.yaml config.yaml
```
5. Docker needs to be running to build the Simulation docker container: (on Mac)
```
brew install docker docker-compose colima
colima start
```
6.	Bootstrap CDK Environment (only required for the first time):
Run the following command to bootstrap your environment:
```
    cdk bootstrap 
```

7.	Synthesize CloudFormation Template:
Navigate to your CDK project directory and synthesize the CloudFormation template for the backend stack:
```
    cdk synth BackendStack
```

8.	Deploy Backend Stack:
Deploy the backend stack:
```
    cdk deploy BackendStack
```
Useful Commands:
List all stacks in the app:
```
    cdk ls
```
Compare deployed stack with the current state:
```
    cdk diff
```
Open CDK documentation:
```
    cdk docs
```    

## Frontend Deployment Instructions

1. Navigate to Frontend Directory:
```
    cd src/frontend/
```

2. Install Frontend Dependencies:
```
    npm install
```

3. Build the Frontend:
```
    npm run build
```

4. Navigate Back to CDK Directory:
```
    cd ../../
```

5. Synthesize CloudFormation Template for Frontend:
```
    cdk synth FrontendStack
```
6. Deploy Frontend Stack:
```
    cdk deploy FrontendStack
```

# FleetWise Fleet Manager Container Services

## Cluster Configuration

### VPC Configuration:
* The ECS cluster is created within a Virtual Private Cloud (VPC).
* The VPC is designed to span across 2 Availability Zones to ensure high availability.
###	Cluster Setup:
* **Cluster Name**: The cluster is prefixed with the application name, resulting in a cluster named {prefix}_ecs_cluster_{environment}.
* **Capacity Provider**: The cluster includes a capacity provider using burstable instance types for cost efficiency and performance.
* **Instance Type**: t3.xlarge (Bursty performance instance)
* **AMI**: ami-0bd2f238e75f8092a (Amazon Linux AMI specific to us-east-1 region)
### EC2 Task Definition
* **Task Family**: The task is defined under the family name {prefix}_vehicle_simulator_task_{enviroment}.
* **Network Mode**: The network mode is set to HOST, allowing containers to share the underlying EC2 instance's network interface.
* **IAM Policy**:
    * A specific IAM policy is attached to the task role, granting permission to perform s3:GetObject on all S3 resources.
## Containers
### Fleetwise Edge Container:
*	**Container Name**: cvs-fleetwise-edge
*	**Image**: public.ecr.aws/aws-iot-fleetwise-edge/aws-iot-fleetwise-edge:v1.1.1
*	**Memory Limit**: 512 MiB
*	**Memory Reservation**: 256 MiB
*	**Logging**: Configured to use AWS CloudWatch Logs with the prefix fleetwise-edge-agent.
*	**Environment Variables**:
    * PRIVATE_KEY
    * CAN_BUS0
    * ENDPOINT_URL
    * CERTIFICATE
    * VEHICLE_NAME
###	Simulator Container:
*	**Container Name**: cvs-fleetwise-simulator
*	**Image**: Built from a Dockerfile located in ./src/simulator/.
*	**Memory Limit**: 512 MiB (Configurable via SIMULATOR_MEMORY_LIMIT)
*	**Memory Reservation**: 256 MiB (Configurable via SIMULATOR_MEMORY_RESERVATION)
*	**Logging**: Configured to use AWS CloudWatch Logs with the prefix fleetwise-simulator.
*	Environment Variables**:
    * VCAN_ADDRESS
    * CONFIG_BUCKET_NAME
    * COORDINATES_S3_KEY
    * COORDINATES_TYPE
*	**Linux Parameters**: The container is given NET_ADMIN capabilities to manage network settings.

# IoT Core & Fleetwise Components

## IoT Policy
**Policy Name**: iot-policy
**Policy Document**:
```
    Version: 2012-10-17
    Statements: The policy includes several statements that define permissions for IoT operations:
    Connect: Allows IoT devices to connect to AWS IoT using the specified ARN pattern.
    Action: iot:Connect
    Resource: arn:aws:iot:us-east-1:12345678910:client/${iot:Connection.Thing.ThingName}
    Publish: Permits IoT devices to publish messages to specific topics.
    Action: iot:Publish
    Resource:
         arn:aws:iot:us-east-1:12345678910:topic/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/checkins
         arn:aws:iot:us-east-1:12345678910:topic/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/signals
    Subscribe: Enables subscription to specific topic filters.
    Action: iot:Subscribe
    Resources:
         arn:aws:iot:us-east-1:12345678910:topicfilter/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/collection_schemes
         arn:aws:iot:us-east-1:12345678910:topicfilter/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/decoder_manifests
    Receive: Allows receiving messages on specific topics.
    Action: iot:Receive
    Resources:
         arn:aws:iot:us-east-1:12345678910:topic/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/collection_schemes
         arn:aws:iot:us-east-1:12345678910:topic/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/decoder_manifests
```
**Thing Type**
    **Thing Type Name**: ```thing_type```
**Properties**:
    * Searchable Attributes: The thing type includes attributes such as make, model, and year, which can be used for searching IoT devices.

## Signal Catalog
* **Catalog Name**: signal_catalog
* **Description**: SignalCatalog
* **Nodes**: The signal catalog contains definitions of various signal nodes required for vehicle diagnostics and monitoring. These nodes are defined in a JSON file (signal-catalog-nodes.json).
## Model Manifest
* **Model Name**: vehicle_model
* **Description**: VEHICLE MODEL
* **Nodes**: The model manifest includes nodes that are derived from the signal catalog and additional attributes relevant to the vehicle model. The nodes are listed in a JSON file  (decoder-manifest-signals.json) and include attributes such as make, model, vin, year, and license.
* **Status**: The status of the model manifest is set to ACTIVE.
## Decoder Manifest
* **Decoder Manifest Name**: decoder_manifest
* **Description**: DECODER MANIFEST
* **Model Manifest ARN**: The ARN of the associated model manifest is referenced here.
* **Network Interfaces**: Defines the network interfaces used for vehicle communication.
    *	**Interface ID**: 1
    *	**Type**: CAN_INTERFACE
    *	**Details**: Uses a CAN interface named vcan0.
* **Signal Decoders**: The decoder manifest includes signal decoders defined for CAN and OBD signals, allowing the translation of raw vehicle data into meaningful metrics.
* **Status**: The status of the decoder manifest is ACTIVE.

## Key Components and Files

### JSON Files
* **signal-catalog-nodes.json**: Contains the definitions of signal nodes used in the signal catalog.
* **decoder-manifest-signals.json**: Lists the decoder signals and attributes used in the model manifest.
### IoT Operations and Topics
* **Topic for Vehicle Check-ins**: arn:aws:iot:us-east-1:12345678910:topic/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/checkins
* **Topic for Vehicle Signals**: arn:aws:iot:us-east-1:12345678910:topic/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/signals
* **Topic Filter for Collection Schemes**: arn:aws:iot:us-east-1:12345678910:topicfilter/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/collection_schemes
* **Topic Filter for Decoder Manifests**: arn:aws:iot:us-east-1:12345678910:topicfilter/$aws/iotfleetwise/vehicles/${iot:Connection.Thing.ThingName}/decoder_manifests

# Lambdas

## Fleet Management Lambda (fleet_management_lambda)
* **Function Name**: fleet_management_lambda
* **Memory Size**: 256 Mib
* **Timeout**: 30 seconds
* **Code Type**: Python
* **Environment Variables**:
    * **DECODER_MANIFEST_ARN**: ARN of the IoT Fleetwise decoder manifest, used to access and interpret vehicle data signals.
    * **VEHICLE_MODEL_ARN**: ARN of the IoT Fleetwise vehicle model manifest, specifying the structure of vehicle data.
    * **SIGNAL_CATALOG_ARN**: ARN of the IoT Fleetwise signal catalog, which contains definitions of all signals used for vehicle data.
    * **PREFIX**: Application prefix, used for naming and organizing resources.
    * **ACCOUNT**: AWS account ID where the resources are deployed.
    * **REGION**: AWS region where the resources are deployed.
    * **DDB_TABLE**: Name of the DynamoDB table storing metadata related to fleet management.
    * **ENVIRONMENT**: Environment name (e.g., test, prod) indicating the deployment environment.
    * **TS_DATABASE**: Name of the Timestream database used for storing telemetry data.
    * **TS_TABLE**: Name of the Timestream table for storing time-series telemetry data.
    * **TS_EXEC_ROLE**: ARN of the IAM role used for Timestream operations.
    * **TS_TABLE_ARN**: ARN of the Timestream table, providing access to telemetry data storage.
    * **THING_TYPE_NAME**: Name of the IoT Thing Type representing different types of IoT devices.
    * **CERTS_BUCKET**: Name of the S3 bucket where certificates are stored.
    * **LOCATIONS_BUCKET**: Name of the S3 bucket storing location data for the fleet.
## ECS Invoke Lambda (ecs_invoke_lambda)
* **Function Name**: ecs_invoke_lambda
* **Memory Size**: 256 Mib
* **Timeout**: 30 seconds
* **Code Type**: Python
* **Environment Variables**:
    * **ECS_CLUSTER_NAME**: Name of the ECS cluster to be invoked for tasks.
    * **TASK_DEFINITION_ARN**: ARN of the ECS task definition used for launching tasks.
    * **DDB_TABLE**: Name of the DynamoDB table for storing metadata.
    * **FLEETWISE_EDGE_CONTAINER_NAME**: Name of the Fleetwise Edge container in ECS.
    * **SIMULATOR_CONTAINER_NAME**: Name of the Fleetwise Simulator container in ECS.
    * **CERTS_BUCKET**: Name of the S3 bucket for storing certificates.
    * **LOCATIONS_BUCKET**: Name of the S3 bucket for storing location data.
## Simulation Lambda (simulation_lambda)
* **Function Name**: simulation_lambda
* **Environment Variables**:
    * **SIGNAL_CATALOG_ARN**: ARN of the IoT Fleetwise signal catalog for signal definitions.
    * **PREFIX**: Application prefix, used for naming conventions.
    * **ACCOUNT**: AWS account ID where resources are deployed.
    * **REGION**: AWS region where the stack is deployed.
    * **ENVIRONMENT**: Name of the deployment environment (e.g., test, prod).
    * **TS_DATABASE**: Name of the Timestream database for telemetry data.
    * **TS_TABLE**: Name of the Timestream table for time-series data.
    * **TS_TABLE_ARN**: ARN of the Timestream table for accessing telemetry data.
    * **ECS_INVOKE_LAMBDA_ARN**: ARN of the ECS invoke Lambda function, allowing this Lambda to invoke it.
    * **TS_EXEC_ROLE**: ARN of the IAM role for Timestream operations.
    * **DDB_TABLE**: Name of the DynamoDB table for metadata storage.
    * **CERTS_BUCKET**: Name of the S3 bucket for certificate storage.
    * **LOCATIONS_BUCKET**: Name of the S3 bucket for location data.
    * **ECS_CLUSTER_NAME**: Name of the ECS cluster involved in simulations.
## Telemetry Retrieval Lambda (telemetry_retrieval_lambda)
* **Function Name**: telemetry_retrieval_lambda
* **Memory Size**: 256 Mib
* **Timeout**: 30 seconds
* **Code Type**: Python
* **Environment Variables**:
    **TS_DATABASE**: Name of the Timestream database storing telemetry data.
    **TS_TABLE**: Name of the Timestream table for time-series data.
    **DDB_TABLE**: Name of the DynamoDB table for fleet management metadata.

# Data Repositories

## DynamoDB Table:
*	Efficiently stores and manages metadata related to fleet management.
*	Supports flexible querying and point-in-time recovery for data protection.
## S3 Buckets:
*	Securely stores files and data related to certificates and locations.
*	Provides scalable storage solutions with easy integration into other AWS services.
## Timestream Database and Table:
*	Efficiently stores time-series telemetry data with configurable retention policies.
*	Allows for quick retrieval and analysis of recent and historical telemetry data.

### DynamoDB Table
* **Table Name**: metadata_table
* **Description**: This DynamoDB table is used for storing metadata related to fleet management. The table is configured to support flexible querying with a partition key and an optional sort key.
* **Partition Key**:
    * **Name**: pk
    * **Type**: STRING
* **Sort Key (Optional)**:
    * **Name**: sk
    * **Type**: STRING
* **Billing Mode**: PAY_PER_REQUEST
    * DynamoDB automatically scales throughput based on the workload, allowing cost-effective and efficient data management.
* **Point-in-Time Recovery**: Enabled
    * Provides continuous backups and the ability to restore the table to any point in time within the last 35 days.
* **Parameter Store Path**: /dynamodb/metadata_table_name
    * The table name is stored in the AWS Systems Manager Parameter Store for easy retrieval and configuration management.

### Simulation Tasks Table Structure
* **Partition Key (pk)**:
* **Type**: String
* **Description**: Identifies the type of data stored. For simulation tasks, the value is set to "SIMULATIONS".
* **Sort Key (sk)**:
    * **Type**: String
    * **Description**: Unique identifier for each vehicle simulation task. It typically uses the vehicle's identifier (e.g., vehicle_id).
* **Attributes**:
    * **vcan**:
        * **Type**: String
        * **Description**: Represents the virtual CAN (Controller Area Network) port assigned to the simulation.
    * **status**:
        * **Type**: String
        * **Description**: Current status of the simulation task (e.g., "STARTING").
    * **task_arn (Optional, used in updates)**:
        * **Type**: String
        * **Description**: Amazon Resource Name (ARN) of the ECS task associated with the simulation.

### Trips Table Structure
* **Partition Key (pk)**:
    * **Type**: String
    * **Description**: Identifies the type of data and is prefixed with "TRIP**:". The value includes the vehicle name (e.g., TRIP:vehicle_name).
* **Sort Key (sk)**:
    * **Type**: String
    * **Description**: Unique identifier for each trip, generated using uuid.uuid4().
* **Attributes**:
    * **vehicle_name**:
        * **Type**: String
        * **Description**: Name of the vehicle associated with the trip.
    * **date**:
        * **Type**: String (ISO 8601 Date format)
        * **Description**: Date of the trip (e.g., "2024-06-12").
    * **start**:
        * **Type**: String
        * **Description**: Starting address of the trip.
    * **stop**:
        * **Type**: String
        * **Description**: Ending address of the trip.
    * **duration**:
        * **Type**: Number (Decimal with precision to three decimal places)
        * **Description**: Duration of the trip in seconds.
    * **distance**:
        * **Type**: Number (Decimal with precision to three decimal places)
        * **Description**: Distance covered during the trip.

### S3 Buckets
#### Certificates Bucket
* **Bucket Name**: cert_output_bucket
* **Description**: This S3 bucket is used for storing certificates related to the fleet management system. It ensures secure and scalable storage for various certificate files.
* **Naming Format**: cert-output-bucket
* **Parameter Store Path**: /s3/cert_output_bucket_name
    * The bucket name is stored in the AWS Systems Manager Parameter Store for easy retrieval and configuration management.
#### Locations Bucket
* **Bucket Name**: location_bucket
* **Description**: This S3 bucket is used for storing location data related to the fleet. It provides secure and scalable storage for files that contain location information.
* **Naming Format**: Spinal case (location-bucket)
* **Parameter Store Path**: /s3/location_bucket_name
    * The bucket name is stored in the AWS Systems Manager Parameter Store for easy retrieval and configuration management.
#### Timestream Database and Table
* **Timestream Database**
    * **Database Name**: fleetwise_telemetry_database
    * **Description**: This Timestream database is created to store telemetry data for the fleet management system. It supports efficient querying and storage of time-series data.
    * **Parameter Store Path**: /timestream/fleetwise_telemetry_database_name
        * The database name is stored in the AWS Systems Manager Parameter Store for easy retrieval and configuration management.
* **Timestream Table**
* **Table Name**: fleetwise_telemetry_table
* **Description**: This table is created within the Timestream database to store telemetry data collected from the fleet. It is configured to retain data in both memory and magnetic storage with specific retention policies.
* **Retention Properties**:
    * **Magnetic Store Retention Period**: 7 days
    * Data is retained in magnetic storage for 7 days, providing cost-effective long-term storage.
    * **Memory Store Retention Period**: 24 hours
    * Data is retained in memory for 24 hours, enabling fast querying for recent data.





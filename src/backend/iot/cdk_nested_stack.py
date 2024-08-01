import json
import os

from aws_cdk import aws_iot as iot
from aws_cdk import aws_iotfleetwise as iotfleetwise


from constructs import Construct

from src.utils.constructs import BaseNestedStack


class IoTStack(BaseNestedStack):
    def __init__(self, scope: Construct, id: str, *, config, **kwargs) -> None:
        super().__init__(scope, id, config=config, **kwargs)

        # Create IoT policy
        policy = iot.CfnPolicy(
            self, self.name_helper("user_pool"),
            policy_name=self.name_helper('iot-policy'),
            policy_document={
                "Version": '2012-10-17',
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": [
                            "iot:Connect"
                        ],
                        "Resource": [
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:client/${{iot:Connection.Thing.ThingName}}'
                        ]
                    },
                    {
                        "Effect": "Allow",
                        "Action": [
                            "iot:Publish"
                        ],
                        "Resource": [
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:topic/$aws/iotfleetwise/vehicles/${{iot:Connection.Thing.ThingName}}/checkins',
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:topic/$aws/iotfleetwise/vehicles/${{iot:Connection.Thing.ThingName}}/signals'
                        ]
                    },
                    {
                        "Effect": "Allow",
                        "Action": [
                            "iot:Subscribe"
                        ],
                        "Resource": [
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:topicfilter/$aws/iotfleetwise/vehicles/${{iot:Connection.Thing.ThingName}}/collection_schemes',
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:topicfilter/$aws/iotfleetwise/vehicles/${{iot:Connection.Thing.ThingName}}/decoder_manifests'
                        ]
                    },
                    {
                        "Effect": "Allow",
                        "Action": [
                            "iot:Receive"
                        ],
                        "Resource": [
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:topic/$aws/iotfleetwise/vehicles/${{iot:Connection.Thing.ThingName}}/collection_schemes',
                            f'arn:aws:iot:{config["REGION"]}:{config["ACCOUNT"]}:topic/$aws/iotfleetwise/vehicles/${{iot:Connection.Thing.ThingName}}/decoder_manifests'
                        ]
                    }
                ]
            }
        )

        #create thing type
        self.thing_type = iot.CfnThingType(
            self, self.name_helper('thing_type'),
            deprecate_thing_type=False,
            thing_type_name=self.name_helper(
                'thing_type'),
            thing_type_properties=iot.CfnThingType.ThingTypePropertiesProperty(
                searchable_attributes=["make", "model", "year"]
            )
        )

        #### CMS IOT FLEETWISE #####

        # Create SignalCatalog
        with open(os.path.join(os.path.dirname(__file__), 'signal-catalog-nodes.json'), 'r', encoding='utf-8') as file:
            signal_nodes = file.read().replace('\n', '').replace('\r', '').replace(' ', '')

        self.signal_catalog = iotfleetwise.CfnSignalCatalog(
            self, self.name_helper('signal_catalog'),
            description="SignalCatalog",
            name=self.name_helper("signal_catalog"),
            nodes=json.loads(signal_nodes)
        )

        with open(os.path.join(os.path.dirname(__file__), 'decoder-manifest-signals.json'), 'r', encoding='utf-8') as file:
            decoder_nodes = file.read().replace('\n', '').replace('\r', '').replace(' ', '')

        with open(os.path.join(os.path.dirname(__file__), 'network-interfaces.json'), 'r', encoding='utf-8') as file:
            network_interfaces = file.read().replace('\n', '').replace('\r', '').replace(' ', '')

        #with open(os.path.join(os.path.dirname(__file__), 'gps-nodes.json'), 'r', encoding='utf-8') as file:
        #    external_gps_nodes = file.read().replace('\n', '').replace('\r', '').replace(' ', '')

        nodes = []
        if (decoder_nodes != '{}'):
            signals = json.loads(decoder_nodes)
            nodes = [signal["fullyQualifiedName"] for signal in signals]

        network_nodes = []
        if (network_interfaces != '{}'):
            networks = json.loads(network_interfaces)
            network_nodes = [network["interfaceId"] for network in networks]

        attr_nodes = [
            {
                "dataType": "STRING",
                "fullyQualifiedName": "make",
                "unit": ""
            },
            {
                "dataType": "STRING",
                "fullyQualifiedName": "model",
                "unit": ""
            },
            {
                "dataType": "STRING",
                "fullyQualifiedName": "vin",
                "unit": ""
            },
            {
                "dataType": "STRING",
                "fullyQualifiedName": "year",
                "unit": ""
            },
            {
                "dataType": "STRING",
                "fullyQualifiedName": "license",
                "unit": ""
            }
        ]

        attributes = [signal["fullyQualifiedName"] for signal in attr_nodes]
        nodes.extend(attributes)
        self.model_manifest = iotfleetwise.CfnModelManifest(
            self, self.name_helper("vehicle_model"),
            name=self.name_helper(
                "vehicle_model"),
            signal_catalog_arn=self.signal_catalog.attr_arn,
            description="VEHICLE MODEL",
            nodes=nodes,
            status="ACTIVE"
        )

        self.decoder_manifest = iotfleetwise.CfnDecoderManifest(
            self, self.name_helper("decoder_manifest"),
            model_manifest_arn=self.model_manifest.attr_arn,
            name=self.name_helper(
                "decoder_manifest"),
            description="DECODER MANIFEST",
            network_interfaces=[
                {
                    'interfaceId': '1',
                    'type': 'CAN_INTERFACE',
                        'canInterface': {
                            'name': 'vcan0'
                        }
                },
            ],
            signal_decoders=[
                i
                for i in signals
                if (i["type"] == "CAN_SIGNAL" or i["type"] == "OBD_SIGNAL")
            ],
            status="ACTIVE"
        )

        self.model_manifest_android = iotfleetwise.CfnModelManifest(
            self, self.name_helper("vehicle_model_android"),
            name=self.name_helper(
                "vehicle_model_android"),
            signal_catalog_arn=self.signal_catalog.attr_arn,
            description="VEHICLE MODEL ANDROID",
            nodes=nodes,
            status="ACTIVE"
        )

        self.decoder_manifest_android = iotfleetwise.CfnDecoderManifest(
            self, self.name_helper("decoder_manifest_android"),
            model_manifest_arn=self.model_manifest_android.attr_arn,
            name=self.name_helper(
                "decoder_manifest_android"),
            description="DECODER MANIFEST ANDROID",
            network_interfaces=[
            {
                "interfaceId": "1",
                "type": "CAN_INTERFACE",
                "canInterface": {
                "name": "vcan0",
                "protocolName": "CAN",
                "protocolVersion": "2.0B"
                }
            },
            {
                "interfaceId": "0",
                "type": "OBD_INTERFACE",
                "obdInterface": {
                "name": "can0",
                "requestMessageId": "2015",
                "obdStandard": "J1979",
                "pidRequestIntervalSeconds": "5",
                "dtcRequestIntervalSeconds": "5"
                }
            },
            {
                "interfaceId": "EXTERNAL-GPS-CAN",
                "type": "CAN_INTERFACE",
                "canInterface": {
                "name": "can0",
                "protocolName": "CAN",
                "protocolVersion": "2.0B"
                }
            },
            {
                "interfaceId": "AAOS-VHAL-CAN",
                "type": "CAN_INTERFACE",
                "canInterface": {
                "name": "can0",
                "protocolName": "CAN",
                "protocolVersion": "2.0B"
                }
            }
            ],
            signal_decoders=[
                i
                for i in signals
                if (i["type"] == "CAN_SIGNAL" or i["type"] == "OBD_SIGNAL")
            ],
            status="ACTIVE"
        )

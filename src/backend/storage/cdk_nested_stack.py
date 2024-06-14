from aws_cdk import (
    aws_dynamodb as dynamodb,
    aws_timestream as timestream,
    aws_s3 as s3
)
from constructs import Construct
from src.utils.constructs import BaseNestedStack


class StorageStack(BaseNestedStack):
    def __init__(self, scope: Construct, id: str, *, config, **kwargs) -> None:
        super().__init__(scope, id, config=config, **kwargs)

        
        #create dynamodb fleet_table
        self.metadata_table = self.create_dynamodb_table(
            table_name="metadata_table",
            partition_key_name="pk",
            sort_key_name="sk"
        )

        # Create S3 bucket

        self.certs_bucket = s3.Bucket(
            self, 
            id=self.name_helper("cert_output_bucket"),
            bucket_name=self.name_helper(
                "cert_output_bucket", self.config["ACCOUNT"], output_format="spinalcase"
            )
        )


        # Create S3 bucket
        self.locations_bucket = s3.Bucket(
            self,
            id=self.name_helper("location_bucket"),
            bucket_name=self.name_helper(
                "location_bucket", self.config["ACCOUNT"], output_format="spinalcase"
            )
        )
        
        # Create a Timestream database for telemetry
        self.telemetry_ts_database = timestream.CfnDatabase(
            self, 
            id=self.name_helper("fleetwise_telemetry_database"),
            database_name=self.name_helper("fleetwise_telemetry_database")
        )

        # Create a Timestream table for telemetry
        self.telemetry_ts_table = timestream.CfnTable(
            self, 
            id=self.name_helper("fleetwise_telemetry_table"),
            database_name=self.telemetry_ts_database.ref,
            table_name=self.name_helper("fleetwise_telemetry_table"),
            retention_properties=timestream.CfnTable.RetentionPropertiesProperty(
                magnetic_store_retention_period_in_days=str(7),
                memory_store_retention_period_in_hours=str(24),
            )
        )
        self.telemetry_ts_table.add_dependency(self.telemetry_ts_database)

    def create_dynamodb_table(self, table_name, partition_key_name, sort_key_name=None):
        table_args = {
            "scope": self,
            "id": self.name_helper(table_name),
            "table_name": self.name_helper(table_name),
            "partition_key": dynamodb.Attribute(
                name=partition_key_name, type=dynamodb.AttributeType.STRING
            ),
            "billing_mode": dynamodb.BillingMode.PAY_PER_REQUEST,
            "point_in_time_recovery": True,
        }

        if sort_key_name is not None:
            table_args["sort_key"] = dynamodb.Attribute(
                name=sort_key_name, type=dynamodb.AttributeType.STRING
            )

        self.save_parameter(
            name=table_name + "_name", value=self.name_helper(table_name), category="/dynamodb/"
        )

        return dynamodb.Table(**table_args)

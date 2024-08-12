import os

from aws_cdk import (
    CfnOutput,
    RemovalPolicy,
    aws_cloudfront as cloudfront,
    aws_iam as iam,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
    aws_ssm as ssm,
    aws_location as location
)
from constructs import Construct

from src.utils.constructs import BaseStack


class FrontendStack(BaseStack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        
        # Create map resource
        self.route_map = location.CfnMap(
            self,
            self.name_helper("route_map"),
            map_name=self.name_helper("route_map"),
            configuration=location.CfnMap.MapConfigurationProperty(
                style=self.config["ROUTE_MAP_STYLE"] 
            )
        )
        
        # Create map resource
        self.location_map = location.CfnMap(
            self,
            self.name_helper("location_map"),
            map_name=self.name_helper("location_map"),
            configuration=location.CfnMap.MapConfigurationProperty(
                style=self.config["LOCATION_MAP_STYLE"] 
            )
        )

        # Create route calculator
        self.route_calculator = location.CfnRouteCalculator(
            self,
            self.name_helper("RouteCalculator"),
            calculator_name=self.name_helper("route_calculator"),
            data_source="Here" 
        )

        # Create place index
        self.place_index = location.CfnPlaceIndex(
            self,
            self.name_helper("PlaceIndex"),
            index_name=self.name_helper("place_index"),
            data_source="Here",  
            data_source_configuration=location.CfnPlaceIndex.DataSourceConfigurationProperty(
                intended_use="SingleUse"  
            )
        )
        
        # Generate Frontend Config File
        current_dir = os.path.dirname(os.path.abspath(__file__))
        destination_path = os.path.join(current_dir,"build","assets","appVariables.js")
        self.generate_config_file(destination_path)


        # create ui bucket
        self.static_ui_bucket = self.create_ui_bucket(bucket_name="static_ui_bucket")

        self.origin_access_identity = cloudfront.OriginAccessIdentity(
            self,
            self.name_helper("origin_access_identity"),
            comment="Fleet Manager UI S3 Backend OAI",
        )

        self.static_ui_bucket.grant_read(self.origin_access_identity)

        # Redirect all non exisiting s3 paths to react app  to be handled be react router
        error_response_1 = cloudfront.CfnDistribution.CustomErrorResponseProperty(
            error_code=404, response_code=200, response_page_path="/index.html"
        )
        error_response_2 = cloudfront.CfnDistribution.CustomErrorResponseProperty(
            error_code=403, response_code=200, response_page_path="/index.html"
        )

        # Cloudfront Distribution
        self.cloudfront_distribution = cloudfront.CloudFrontWebDistribution(
            self,
            self.name_helper("distribution"),
            origin_configs=[
                cloudfront.SourceConfiguration(
                    s3_origin_source=cloudfront.S3OriginConfig(
                        s3_bucket_source=self.static_ui_bucket,
                        origin_access_identity=self.origin_access_identity,
                    ),
                    behaviors=[cloudfront.Behavior(is_default_behavior=True)],
                )
            ],
            viewer_certificate=cloudfront.ViewerCertificate.from_cloud_front_default_certificate(),
            viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            comment="Fleet Manager Cloudfront Distribution. Env: "
            + self.config["ENVIRONMENT_NAME"],
            error_configurations=[error_response_1, error_response_2],
        )

        # S3 deployment
        s3_deployment.BucketDeployment(
            self,
            "DeployWebsite",
            sources=[
                s3_deployment.Source.asset("./src/frontend/build/")
            ],
            destination_bucket=self.static_ui_bucket,
            distribution=self.cloudfront_distribution,
            distribution_paths=["/*"],
        )

        CfnOutput(self, "URL", value=self.cloudfront_distribution.distribution_domain_name)



    def create_ui_bucket(self, bucket_name: str) -> s3.Bucket:
        bucket = s3.Bucket(
            self,
            self.name_helper(bucket_name),
            bucket_name=self.name_helper(
                bucket_name, self.config["ACCOUNT"], output_format="spinalcase"
            ),
            website_index_document="index.html",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            versioned=True,
            removal_policy=RemovalPolicy.RETAIN,
        )

        # Bucket Policy to enforce SSL
        bucket.add_to_resource_policy(
            iam.PolicyStatement(
                actions=["s3:*"],
                effect=iam.Effect.DENY,
                principals=[iam.AnyPrincipal()],
                resources=[bucket.bucket_arn, bucket.arn_for_objects("*")],
                conditions={"Bool": {"aws:SecureTransport": False}},
            )
        )

        ssm.StringParameter(
            self,
            self.name_helper(f"{bucket_name}_paramater"),
            parameter_name=f'/{self.config["ENVIRONMENT_NAME"]}/s3/{bucket_name}_name',
            string_value=bucket.bucket_name,
        )

        return bucket
    
    
    def generate_config_file(self, file_path: str):
        """
        Generates a configuration file for the frontend application.

        This function fetches parameter values from AWS SSM Parameter Store at
        synth time and uses them to generate a frontend configuration file.

        Args:
            file_path (str): The file path where the configuration file should be written.

        Raises:
            FileNotFoundError: If the specified file_path is not accessible.
            Exception: For general failures, especially in fetching parameters.
        """
        try:
            user_pool_id = '';
            # Fetch parameter values from SSM Parameter Store
            user_pool_id = ssm.StringParameter.value_from_lookup(
                self, self.get_parameter_name("user_pool_id", "/cognito/")
            )
            user_pool_client_id = ssm.StringParameter.value_from_lookup(
                self, self.get_parameter_name("user_pool_client_id", "/cognito/")
            )
            identity_pool_id=''
            identity_pool_id = ssm.StringParameter.value_from_lookup(
                self, self.get_parameter_name("identity_pool_id", "/cognito/")
            )

            print(identity_pool_id)
            api_url = ssm.StringParameter.value_from_lookup(
                self, self.get_parameter_name("backend_api_url", "/api/")
            )

            # Prepare the configuration string
            config_string = (
                "window.appVariables = {"
                f"REGION:'{self.config['REGION']}',"
                f"USER_POOL_ID:'{user_pool_id}',"
                f"USER_POOL_CLIENT_ID:'{user_pool_client_id}',"
                f"IDENTITY_POOL_ID:'{identity_pool_id}',"
                f"CDF_AUTO_ENDPOINT:'{api_url.strip('/')}',"
                f"LOCATION_MAP_NAME:'{self.location_map.map_name}',"
                f"ROUTE_MAP_NAME:'{self.route_map.map_name}',"
                f"CALCULATOR_NAME:'{self.route_calculator.calculator_name}',"
                f"PLACE_INDEX_NAME:'{self.place_index.index_name}'"
                "};"
            )

            # Write to the file
            with open(file_path, "w") as file:
                file.write(config_string)

        except FileNotFoundError as e:
            # Handle file not found error
            print(f"Error: The file at {file_path} could not be opened.")
            raise e
        except Exception as e:
            # Handle other exceptions
            print("An error occurred during configuration file generation.")
            raise e

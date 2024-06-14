import cdk_nag
from aws_cdk import (
    Duration,
    aws_apigateway as apigw,
    aws_cognito as cognito,
    aws_dynamodb as dynamodb,
    aws_timestream as ts,
    aws_iam as iam,
    aws_lambda as _lambda
)
from constructs import Construct

from src.utils.constructs import BaseNestedStack

class ApiStack(BaseNestedStack):
    def __init__(
        self,
        scope: Construct,
        id: str,
        *,
        config,
        user_pool: cognito.UserPool = None,
        ts_database,
        ts_table,
        ddb_metadata_table,
        iot_stack,
        simulator_stack,
        certs_bucket,
        locations_bucket,
        **kwargs,
    ) -> None:
        super().__init__(scope, id, config=config, **kwargs)

        self.common_layer = self._build_common_layer()
        
        
        self.backend_api_authorizer = apigw.CognitoUserPoolsAuthorizer(
            self,
            self.name_helper("backend_api_authorizer"),
            authorizer_name=self.name_helper("backend_api_authorizer"),
            cognito_user_pools=[user_pool],
        )
        
        self.backend_api = apigw.RestApi(
            self,
            self.name_helper("backend_api"),
            rest_api_name=self.name_helper("backend_api"),
            default_cors_preflight_options=apigw.CorsOptions(
                allow_origins=apigw.Cors.ALL_ORIGINS,
                allow_methods=apigw.Cors.ALL_METHODS,
                allow_headers=apigw.Cors.DEFAULT_HEADERS
            ),
            default_method_options=apigw.MethodOptions(authorizer=self.backend_api_authorizer),
        )

        self.save_parameter(name="backend_api_url", value=self.backend_api.url, category="/api/")

        # Create timestream execution role
        self.ts_exec_role =  iam.Role(self, self.name_helper('timestream_exec_role'), 
        assumed_by=iam.ServicePrincipal('iotfleetwise.amazonaws.com'),
        role_name=self.name_helper("timestream_exec_role"))

        self.ts_exec_role.add_to_policy(iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions= [
                'timestream:DescribeEndpoints',
                'timestream:DescribeDatabase',
                'timestream:DescribeTable',
                'timestream:WriteRecords',
                'timestream:Select',
            ],
            resources= ['*'],
            ))
    
        
        ### lambda creation ###

        self.fleet_management_lambda, self.fleet_creation_role = self.create_api_lambda(
            lambda_name="fleet_management_lambda",
            code_asset_path="src/backend/api/lambdas/fleet_management_lambda",
            api_path="/vehicle",
            api_methods=["GET", "POST", "PUT", "DELETE"],
            managed_policy_arns=[
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
                "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
                "arn:aws:iam::aws:policy/AWSIoTFullAccess",
                "arn:aws:iam::aws:policy/AmazonS3FullAccess",
                "arn:aws:iam::aws:policy/AmazonTimestreamFullAccess"
            ],
            memory_size=256,
            timeout=30,
            layers=[self.common_layer],
            env={
                "DECODER_MANIFEST_ARN": iot_stack.decoder_manifest.attr_arn,
                "VEHICLE_MODEL_ARN":  iot_stack.model_manifest.attr_arn,
                "SIGNAL_CATALOG_ARN": iot_stack.signal_catalog.attr_arn,
                "PREFIX" : config["APP_PREFIX"],
                "ACCOUNT" : config["ACCOUNT"],
                "REGION" : config["REGION"],
                "DDB_TABLE":ddb_metadata_table.table_name,
                "ENVIRONMENT" : config["ENVIRONMENT_NAME"],
                "TS_DATABASE": ts_database,
                "TS_TABLE": ts_table.table_name,
                "TS_EXEC_ROLE": self.ts_exec_role.role_arn,
                "TS_TABLE_ARN":ts_table.attr_arn,
                "THING_TYPE_NAME":iot_stack.thing_type.thing_type_name,
                "CERTS_BUCKET":certs_bucket.bucket_name ,
                "LOCATIONS_BUCKET":locations_bucket.bucket_name
            },
        )
        
        # Define a Managed Policy for iot fleetwise role            
        fleetwise_policy = iam.ManagedPolicy(self, self.name_helper("iotfleetwisepolicy"),
                                            description="A policy for iotfleetwise",
                                            managed_policy_name=self.name_helper("iotfleetwisepolicy"),
                                            statements=[
                                                iam.PolicyStatement(
                                                    actions=["iotfleetwise:*"],
                                                    resources=["*"],
                                                    effect=iam.Effect.ALLOW,
                                                )
                                            ])

        # Define a Managed Policy for iot fleetwise role            
        passRole_policy = iam.ManagedPolicy(self, self.name_helper("iampassrolepolicy"),
                                            description="A policy for iam pass role",
                                            managed_policy_name=self.name_helper("iampassrolepolicy"),
                                            statements=[
                                                iam.PolicyStatement(
                                                    actions=["iam:PassRole"],
                                                    resources=["*"],
                                                    effect=iam.Effect.ALLOW,
                                                )
                                            ])
            
        fleetwise_policy.attach_to_role(role=self.fleet_creation_role)
        passRole_policy.attach_to_role(role=self.fleet_creation_role)
        
        ecs_invoke_role = self.create_lambda_role(
            self.name_helper("ecs_invoke_lambda_role"), 
            [
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
                "arn:aws:iam::aws:policy/AmazonTimestreamReadOnlyAccess",
                "arn:aws:iam::aws:policy/AWSIoTFullAccess",
                "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
                "arn:aws:iam::aws:policy/AmazonS3FullAccess",
                "arn:aws:iam::aws:policy/AmazonECS_FullAccess"
            ])

        ecs_invoke_lambda = _lambda.Function(
            self,
            self.name_helper("ecs_invoke_lambda"),
            function_name=self.name_helper("ecs_invoke_lambda"),
            code=_lambda.Code.from_asset("src/backend/api/lambdas/ecs_invoke_lambda"),
            handler="handler.lambda_handler",
            runtime=_lambda.Runtime.PYTHON_3_12,
            role=ecs_invoke_role,
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "ECS_CLUSTER_NAME":simulator_stack.cluster.cluster_name,
                "TASK_DEFINITION_ARN":simulator_stack.task_arn,
                "DDB_TABLE":ddb_metadata_table.table_name,
                "FLEETWISE_EDGE_CONTAINER_NAME":simulator_stack.fleetwise_container.container_name,
                "SIMULATOR_CONTAINER_NAME":simulator_stack.simulator_container.container_name,
                "CERTS_BUCKET":certs_bucket.bucket_name ,
                "LOCATIONS_BUCKET":locations_bucket.bucket_name
            }
        )

        self.simulation_lambda, self.simulation_lambda_role= self.create_api_lambda(
            lambda_name="simulation_lambda",
            code_asset_path="src/backend/api/lambdas/simulation_lambda",
            api_path="/simulation",
            api_methods=["GET", "POST", "PUT", "DELETE"],
            managed_policy_arns=[
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
                "arn:aws:iam::aws:policy/AmazonTimestreamReadOnlyAccess",
                "arn:aws:iam::aws:policy/AWSIoTFullAccess",
                "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
                "arn:aws:iam::aws:policy/AmazonECS_FullAccess"
            ],
            memory_size=256,
            timeout=30,
            env={            
                "SIGNAL_CATALOG_ARN": iot_stack.signal_catalog.attr_arn,
                "PREFIX" : config["APP_PREFIX"],
                "ACCOUNT" : config["ACCOUNT"],
                "REGION" : config["REGION"],
                "ENVIRONMENT" : config["ENVIRONMENT_NAME"],
                "TS_DATABASE": ts_database,
                "TS_TABLE": ts_table.table_name,
                "TS_TABLE_ARN":ts_table.attr_arn,
                "ECS_INVOKE_LAMBDA_ARN": ecs_invoke_lambda.function_arn,
                "TS_EXEC_ROLE": self.ts_exec_role.role_arn,
                "DDB_TABLE":ddb_metadata_table.table_name,
                "CERTS_BUCKET":certs_bucket.bucket_name ,
                "LOCATIONS_BUCKET":locations_bucket.bucket_name,
                "ECS_CLUSTER_NAME":simulator_stack.cluster.cluster_name
            },
        )
        
        ecs_invoke_lambda.grant_invoke(self.simulation_lambda)

        fleetwise_policy.attach_to_role(role=self.simulation_lambda_role)
        passRole_policy.attach_to_role(role=self.simulation_lambda_role)

        self.telemetry_retrieval_lambda, self.telemetry_retrieval_lambda_role = self.create_api_lambda(
            lambda_name="telemetry_retrieval_lambda",
            code_asset_path="src/backend/api/lambdas/telemetry_retrieval_lambda",
            api_path="/telemetry",
            api_methods=["GET", "POST", "PUT", "DELETE"],
            managed_policy_arns=[
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
                "arn:aws:iam::aws:policy/AmazonTimestreamReadOnlyAccess",
                "arn:aws:iam::aws:policy/AWSIoTFullAccess",
                "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
            ],
            memory_size=256,
            timeout=30,
            env={                
                "TS_DATABASE": ts_database,
                "TS_TABLE": ts_table.table_name,
                "DDB_TABLE":ddb_metadata_table.table_name,
            },
        )

        fleetwise_policy.attach_to_role(role=self.telemetry_retrieval_lambda_role)
        
        
    def _build_common_layer(self) -> _lambda.LayerVersion:
        return _lambda.LayerVersion.from_layer_version_arn(self, 'powertools',
                                                           'arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV2:17')        

    def add_lambda_to_api_path(
        self, lambda_function: _lambda.Function, resource_path: str, user_methods  ):

        resource = self.backend_api.root.resource_for_path(resource_path)

        # Define method response
        method_response = apigw.MethodResponse(
            status_code="200",
            response_parameters={
                "method.response.header.Access-Control-Allow-Headers": True,
                "method.response.header.Access-Control-Allow-Methods": True,
                "method.response.header.Access-Control-Allow-Origin": True,
            },
            response_models={"application/json": apigw.Model.EMPTY_MODEL},
        )

        # Add methods to the resource with CORS headers and method response
        for method in user_methods:
            resource.add_method(
                method,
                integration=apigw.LambdaIntegration(handler=lambda_function, proxy=True),
                method_responses=[method_response],
            )

    def create_lambda_role(self, role_name, managed_policy_arns):
        return iam.Role(
            self,
            self.name_helper(role_name),
            role_name=self.name_helper(role_name),
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_managed_policy_arn(
                    self, f"{self.name_helper(role_name)}-policy-{i}", arn
                )
                for i, arn in enumerate(managed_policy_arns)
            ],
        )
        
    def create_api_lambda(
        self,
        *,
        lambda_name,
        code_asset_path,
        api_path,
        api_methods,
        managed_policy_arns,
        alias_name=None,
        provisioned_concurrent_executions=None,
        memory_size=128,
        timeout=30,
        env=None,
        layers=None,
    ) -> _lambda.Function:
        lambda_role = self.create_lambda_role(lambda_name + "_role", managed_policy_arns)

        lambda_function = _lambda.Function(
            self,
            self.name_helper(lambda_name),
            function_name=self.name_helper(lambda_name),
            code=_lambda.Code.from_asset(code_asset_path),
            handler="handler.lambda_handler",
            runtime=_lambda.Runtime.PYTHON_3_12,
            role=lambda_role,
            timeout=Duration.seconds(timeout),
            memory_size=memory_size,
            environment=env,
            layers=layers
        )

        if alias_name:
            alias = lambda_function.add_alias(
                alias_name=alias_name,
                provisioned_concurrent_executions=provisioned_concurrent_executions,
            )
            ref = alias
        else:
            ref = lambda_function

        self.add_lambda_to_api_path(
            ref,
            api_path,
            api_methods,
        )

        
        if api_path == "/vehicle":
            self.add_lambda_to_api_path(
            ref,
            "/fleet",
            ["GET", "POST", "PUT", "DELETE"]
            )

            self.add_lambda_to_api_path(
            ref,
            "/vehicle/list-fleets",
            ["GET"]
            )

            self.add_lambda_to_api_path(
            ref,
            "/vehicle/trips",
            ["GET"]
            )

            self.add_lambda_to_api_path(
            ref,
            "/vehicle/download-cert",
            ["GET"]
            )

            self.add_lambda_to_api_path(
            ref,
            "/fleet/list-vehicles",
            ["GET"]
            )

            self.add_lambda_to_api_path(
                ref,
                "/fleet/associate-vehicle",
                ["POST"]
            )
            self.add_lambda_to_api_path(
                ref,
                "/fleet/disassociate-vehicle",
                ["DELETE"]
            )
            self.add_lambda_to_api_path(
                ref,
                "/fleet/campaign",
                ["GET"]
            )

        
        return lambda_function, lambda_role
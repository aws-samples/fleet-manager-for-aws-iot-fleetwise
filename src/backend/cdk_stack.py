from constructs import Construct

from src.utils.constructs import BaseStack

from .api.cdk_nested_stack import ApiStack
from .cognito.cdk_nested_stack import CognitoStack
from .storage.cdk_nested_stack import StorageStack
from .iot.cdk_nested_stack import IoTStack
from .simulator.simulator_stack import SimulatorStack


class BackendStack(BaseStack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        self.storage_stack = StorageStack(
            self, "StorageStack", config=self.config)

        self.cognito_stack = CognitoStack(
            self, "CognitoStack", config=self.config)

        self.iot_stack = IoTStack(self, "IoTStack", config=self.config)

        self.simulator_stack = SimulatorStack(
            self, "SimulatorStack", config=self.config)

        self.api_stack = ApiStack(
            self, "ApiStack", config=self.config,
            user_pool=self.cognito_stack.user_pool,
            ts_database=self.storage_stack.telemetry_ts_database.database_name,
            ts_table=self.storage_stack.telemetry_ts_table,
            ddb_metadata_table=self.storage_stack.metadata_table,
            iot_stack=self.iot_stack,
            simulator_stack=self.simulator_stack,
            certs_bucket=self.storage_stack.certs_bucket,
            locations_bucket=self.storage_stack.locations_bucket
        )

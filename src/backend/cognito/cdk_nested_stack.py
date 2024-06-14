
from aws_cdk import (
    aws_cognito as cognito,
    aws_iam as iam
)
from constructs import Construct

from src.utils.constructs import BaseNestedStack


class CognitoStack(BaseNestedStack):
    def __init__(self, scope: Construct, id: str, *, config, **kwargs) -> None:
        super().__init__(scope, id, config=config, **kwargs)

        # Create a Cognito User Pool
        self.user_pool = cognito.UserPool(
            scope,
            self.name_helper("user_pool"),
            user_pool_name=self.name_helper("user_pool"),
            self_sign_up_enabled=True,
            sign_in_aliases={"email": True},
            password_policy={
                "min_length": 8,
                "require_digits": True,
                "require_lowercase": True,
                "require_uppercase": True,
                "require_symbols": True,
            },
            advanced_security_mode=cognito.AdvancedSecurityMode.ENFORCED,
        )

        # Create a Cognito User Pool Client
        self.user_pool_client = self.user_pool.add_client(
            self.name_helper("user_pool_client"),
            user_pool_client_name=self.name_helper("user_pool_client"),
            generate_secret=False,
            auth_flows={"user_srp": True, "user_password": True},
        )

        self.save_parameter(
            name="user_pool_id", value=self.user_pool.user_pool_id, category="/cognito/"
        )
        self.save_parameter(
            name="user_pool_client_id",
            value=self.user_pool_client.user_pool_client_id,
            category="/cognito/",
        )
        
        # Create a Cognito Identity Pool
        self.identity_pool = cognito.CfnIdentityPool(
            scope,
            self.name_helper("identity_pool"),
            identity_pool_name=self.name_helper("identity_pool"),
            allow_unauthenticated_identities=True,
            cognito_identity_providers=[
                cognito.CfnIdentityPool.CognitoIdentityProviderProperty(
                    client_id=self.user_pool_client.user_pool_client_id,
                    provider_name=self.user_pool.user_pool_provider_name,
                )
            ],
        )

        # Create IAM roles for authenticated and unauthenticated users
        unauthenticated_role = iam.Role(
            scope,
            self.name_helper("unauthenticated_role"),
            assumed_by=iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    'StringEquals': {
                        'cognito-identity.amazonaws.com:aud': self.identity_pool.ref
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                    }
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name('service-role/AWSLambdaBasicExecutionRole')
            ]
        )

        # Add Amazon Location permissions for unauthenticated role
        unauthenticated_role.add_to_policy(iam.PolicyStatement(
            actions=[
                "geo:GetMap*",
                "geo:SearchPlaceIndex*",
                "geo:GetPlace",
                "geo:CalculateRoute*",
                "geo:GetGeofence",
                "geo:ListGeofences",
                "geo:PutGeofence",
                "geo:BatchDeleteGeofence",
                "geo:BatchPutGeofence",
                "geo:BatchEvaluateGeofences",
                "geo:GetDevicePosition*",
                "geo:ListDevicePositions",
                "geo:BatchDeleteDevicePositionHistory",
                "geo:BatchGetDevicePosition",
                "geo:BatchUpdateDevicePosition",
            ],
            resources=["*"]
        ))

        authenticated_role = iam.Role(
            scope,
            self.name_helper("authenticated_role"),
            assumed_by=iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    'StringEquals': {
                        'cognito-identity.amazonaws.com:aud': self.identity_pool.ref
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'authenticated'
                    }
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name('service-role/AWSLambdaBasicExecutionRole')
            ]
        )

        # Attach roles to the identity pool
        cognito.CfnIdentityPoolRoleAttachment(
            scope,
            self.name_helper("identity_pool_role_attachment"),
            identity_pool_id=self.identity_pool.ref,
            roles={
                'unauthenticated': unauthenticated_role.role_arn,
                'authenticated': authenticated_role.role_arn,
            },
        )

        # Save the identity pool ID as a parameter
        self.save_parameter(
            name="identity_pool_id", value=self.identity_pool.ref, category="/cognito/"
        )

from aws_cdk import (
    aws_ecs as ecs,
    aws_iam as iam,
    aws_ec2 as ec2,
    aws_autoscaling as autoscaling,
)

from constructs import Construct
from src.utils.constructs import BaseNestedStack


class SimulatorStack(BaseNestedStack):
    def __init__(self, scope: Construct, id: str, *, config, **kwargs) -> None:
        super().__init__(scope, id, config=config, **kwargs)

        # Create a VPC
        vpc = ec2.Vpc(
            self, self.name_helper("vpc"), max_azs=2, vpc_name=self.name_helper("vpc")
        )

        # Create an ECS cluster
        self.cluster = ecs.Cluster(
            self,
            self.name_helper("ecs_cluster"),
            vpc=vpc,
            cluster_name=self.name_helper("ecs_cluster"),
        )

        instance_role = iam.Role(
            self,
            self.name_helper("ecs_instance_role"),
            assumed_by=iam.ServicePrincipal("ec2.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AmazonEC2ContainerServiceforEC2Role"
                ),
            ],
        )

        launch_template = ec2.LaunchTemplate(
            self,
            self.name_helper("autoscaling_launch_template"),
            machine_image=ec2.MachineImage.generic_linux(
                {"us-east-1": "ami-0bd2f238e75f8092a"}
            ),
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.XLARGE
            ),
            role=instance_role,
            associate_public_ip_address=True,
        )

        asg = autoscaling.AutoScalingGroup(
            self,
            self.name_helper("autoscaling_group"),
            launch_template=launch_template,
            desired_capacity=1,
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),
        )

        capacity_provider = ecs.AsgCapacityProvider(
            self, self.name_helper("ecs_asg_capacity"), auto_scaling_group=asg
        )

        self.cluster.add_asg_capacity_provider(capacity_provider)

        # Define an EC2 task definition
        self.task_definition = ecs.Ec2TaskDefinition(
            self,
            self.name_helper("vehicle_simulator_task"),
            family=self.name_helper("vehicle_simulator_task"),
            network_mode=ecs.NetworkMode.HOST,
        )

        # Define the IAM policy for S3 access
        s3_policy = iam.Policy(
            self,
            self.name_helper("ecs_task_policy"),
            statements=[iam.PolicyStatement(actions=["s3:GetObject"], resources=["*"])],
        )

        # Attach the policy to the task role
        self.task_definition.task_role.attach_inline_policy(s3_policy)

        # Add a container to the task definition
        self.fleetwise_container = self.task_definition.add_container(
            self.name_helper("fleetwise-edge"),
            container_name=self.name_helper("fleetwise-edge"),
            image=ecs.ContainerImage.from_registry(self.config["FLEETWISE_EDGE_IMAGE"]),
            memory_limit_mib=512,
            memory_reservation_mib=256,
            environment={
                "PRIVATE_KEY": "",
                "CAN_BUS0": "",
                "ENDPOINT_URL": "",
                "CERTIFICATE": "",
                "VEHICLE_NAME": "",
            },
            logging=ecs.LogDriver.aws_logs(stream_prefix="fleetwise-edge-agent"),
        )

        linux_paramaters = ecs.LinuxParameters(self, "LinuxParameters")
        linux_paramaters.add_capabilities(ecs.Capability.NET_ADMIN)
        # Add a container to the task definition
        self.simulator_container = self.task_definition.add_container(
            self.name_helper("fleetwise-simulator"),
            container_name=self.name_helper("fleetwise-simulator"),
            image=ecs.ContainerImage.from_asset("./src/simulator/", file="Dockerfile"),
            memory_limit_mib=self.config["SIMULATOR_MEMORY_LIMIT"],
            memory_reservation_mib=self.config["SIMULATOR_MEMORY_RESERVATION"],
            environment={
                "VCAN_ADDRESS": "",
                "CONFIG_BUCKET_NAME": "",
                "COORDINATES_S3_KEY": "",
                "COORDINATES_TYPE": "",
            },
            logging=ecs.LogDriver.aws_logs(stream_prefix="fleetwise-simulator"),
            linux_parameters=linux_paramaters,
        )

        self.task_arn = self.task_definition.task_definition_arn

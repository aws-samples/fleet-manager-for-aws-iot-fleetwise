from aws_cdk import NestedStack, Stack, Stage, aws_ssm as ssm
from constructs import Construct


class BaseCDKClass:
    """
    The BaseCDKClass serves as a common superclass for CDK related classes.
    It contains shared attributes and methods.
    """

    name_helper = None  # Shared class variable - function to generate names

    def __init__(self, scope: Construct, id: str, *, config, **kwargs):
        super().__init__(scope, id, **kwargs)
        self.config = config
        self.name_helper = config["NAME_HELPER"]

    def save_parameter(self, name: str, value: str, category: str = "/") -> ssm.StringParameter:
        """
        This method creates and saves a new parameter to the AWS SSM Parameter Store with
        the specified name, value, and category. It constructs the full parameter name using
        the application prefix and environment name from the class configuration.

        Parameters:
        name (str): The name of the parameter to be saved.
        value (str): The value of the parameter to be saved.
        category (str, optional): The category path for the parameter.
        Defaults to the root category '/'.

        Raises:
        TypeError: If either the 'name' or 'value' is not a string.
        ValueError: If either the 'name' or 'value' is only whitespace or is empty.

        Returns:
        ssm.StringParameter: An instance of the SSM StringParameter that was saved.
        """

        if not isinstance(name, str) or not isinstance(value, str):
            raise TypeError("Both name and value must be of type str.")

        if not name.strip() or not value.strip():
            raise ValueError("Name and value must not be empty.")

        return ssm.StringParameter(
            self,
            self.name_helper(f"{name}_parameter"),
            parameter_name=f'/{self.config["APP_PREFIX"]}{category}{self.config["ENVIRONMENT_NAME"]}/{name}',
            string_value=value,
        )

    def get_parameter_name(self, resource_short_name: str, category: str) -> str:
        """
        Constructs and returns a fully qualified name for a resource parameter
        by combining provided short name and category withthe application prefix
        and environment name from the class configuration.

        Parameters:
        resource_short_name (str): The short name of the resource for
        which the parameter name is to be constructed.
        category (str): The category path for the parameter.

        Returns:
        str: The fully qualified name of the parameter for the given resource and category.
        """

        return (
            f'/{self.config["APP_PREFIX"]}{category}'
            f'{self.config["ENVIRONMENT_NAME"]}/{resource_short_name}'
        )


class BaseStack(BaseCDKClass, Stack):
    """
    The BaseStack class extends BaseCDKClass and AWS CDK's Stack.
    It is used as the parent class for all stack classes in the project.
    """

    pass


class BaseNestedStack(BaseCDKClass, NestedStack):
    """
    The BaseNestedStack class extends BaseCDKClass and AWS CDK's NestedStack.
    It is used as the parent class for all nested stack classes in the project.
    """

    pass


class BaseConstruct(BaseCDKClass, Construct):
    """
    The BaseConstruct class extends BaseCDKClass and AWS CDK's Construct.
    It is used as the parent class for all construct classes in the project.
    """

    pass


class BaseStage(BaseCDKClass, Stage):
    """
    The BaseStage class extends BaseCDKClass and AWS CDK's Stage.
    It is used as the parent class for all stage classes in the project.
    """

    pass

import yaml
from aws_cdk import App

from src.utils.cdk_name_generator import name_factory


def load_config(app: App):
    config_file = app.node.try_get_context("config")
    if not config_file:
        config_file = "config.yaml"

    with open(config_file, encoding="utf-8") as file:
        config = yaml.safe_load(file)


    # create config variable for name generation helper function
    name_generator = name_factory(prefix=config["APP_PREFIX"], suffix=config["ENVIRONMENT_NAME"])
    config["NAME_HELPER"] = name_generator

    return config

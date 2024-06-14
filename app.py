import cdk_nag
from aws_cdk import App, Aspects, Environment
from src.backend.cdk_stack import BackendStack
from src.frontend.cdk_stack import FrontendStack
from src.utils.config import load_config

app = App()

config = load_config(app)

name_generator = config["NAME_HELPER"]

backend_stack = BackendStack(
    app,
    "BackendStack",
    env=Environment(account=config["ACCOUNT"], region=config["REGION"]),
    stack_name=name_generator("backend_stack", output_format="spinalcase"),
    config=config
)

frontend_stack = FrontendStack(
    app,
    "FrontendStack",
    env=Environment(account=config["ACCOUNT"], region=config["REGION"]),
    stack_name=name_generator("frontend_stack", output_format="spinalcase"),
    config=config,
)

app.synth()
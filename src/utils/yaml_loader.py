import yaml


def load_buildspec(file_path):
    with open(file_path, encoding="utf-8") as file:
        return yaml.safe_load(file)

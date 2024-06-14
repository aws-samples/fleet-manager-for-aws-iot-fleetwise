import stringcase


def name_factory(prefix, suffix):
    """
    Returns a function that transforms the input strings into a specified naming convention,
    adding a specified prefix and suffix to the result.

    Parameters:
    prefix (str): The prefix to add to the transformed string.
    suffix (str): The suffix to add to the transformed string.

    Returns:
    function: The transform_strings function that adds the provided prefix and suffix
        to the string before transforming it.
    """

    def generate_name(*args, output_format="snakecase"):
        """
        Transforms the input strings into a specified naming convention.

        Parameters:
        *args (str): Variable length argument list of strings to be concatenated and transformed.
        output_format (str, optional): The naming convention to transform the strings into.
        It can be 'snakecase', 'camelcase', 'pascalcase',
        or 'spinalcase'. Defaults to 'snakecase'.

        Returns:
        str: The transformed string with a prefix and a suffix.

        Raises:
        ValueError: If no strings are provided or if an invalid output format is provided.
        TypeError: If any of the provided arguments are not strings.
        """

        if not args:
            raise ValueError("No strings provided")

        # Check if all arguments are strings
        if not all(isinstance(arg, str) for arg in args):
            raise TypeError("All arguments must be strings")

        # Concatenate the strings with an underscore
        concatenated = "_".join(args)

        # Add prefix and suffix
        concatenated = f"{prefix}_{concatenated}_{suffix}"

        # Switch statement to determine which function to call based on output format
        switcher = {
            "snakecase": stringcase.snakecase,
            "camelcase": stringcase.camelcase,
            "pascalcase": stringcase.pascalcase,
            "spinalcase": stringcase.spinalcase,
        }

        # Get the function from switcher dictionary
        func = switcher.get(output_format)

        # Check if a valid output format was provided
        if not func:
            raise ValueError(f"Invalid output format: {output_format}")

        # Execute the function
        result = func(concatenated)

        return result

    return generate_name

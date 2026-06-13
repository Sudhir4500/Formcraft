from rest_framework.views import exception_handler
from core.responses import ApiResponse


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is None:
        return response

    message = "Request failed"

    # it will check if the response data is a dict
    # if it is a dict, it will get the detail message
    # if it is not a dict, it will use the default message
    if isinstance(response.data, dict):
        message = response.data.get("detail", message)

    # it will set the response data to the ApiResponse.error
    # which is a custom response class
    # status_code is the status code of the response
    # errors is the response data
    response.data = ApiResponse.error(
        message=message,
        errors=response.data,
    )

    return response
from rest_framework.response import Response
from rest_framework import status

class ApiResponse:
    @staticmethod
    def success(message='Success',data=None):
        return{
            'success':True,
            'message':message,
            "data":data,
            "errors":None,
        }
    @staticmethod
    def error(message="Error",errors=None):
        return{
            "success":False,
            "message":message,
            "data":None,
            "errors":errors
        }

def success_response(message="Success",data=None,status_code=status.HTTP_200_OK):
    """
    return successful response
    """
    return Response(ApiResponse.success(message,data),status=status_code)

def error_response(message="Error",errors=None,status_code=status.HTTP_400_BAD_REQUEST):
    """
    return error response
    """
    return Response(ApiResponse.error(message,errors),status=status_code)
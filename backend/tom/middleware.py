import json
import logging
import time
import traceback

from django.contrib.auth import get_user_model
from system.models import RequestLog

logger = logging.getLogger(__name__)
User = get_user_model()


class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        request_data = {
            'path': request.path,
            'method': request.method,
            'query_params': request.GET.dict(),
            'body': request.body.decode('utf-8') if request.body else None,
            'headers': self._sanitize_headers(dict(request.headers)),
            'ip_address': self._get_client_ip(request),
            'request_size': len(request.body) if request.body else 0,
        }

        try:
            response = self.get_response(request)
            error_occurred = False
            error_type = None
            error_message = None
            stack_trace = None

            # Check user authentication after response is generated
            has_user = hasattr(request, 'user')

            if has_user:
                # Force evaluation of the lazy user object
                user = request.user
                if user.is_authenticated:
                    request_data['user'] = user
                else:
                    request_data['user'] = None
            else:
                request_data['user'] = None

        except Exception as e:
            error_occurred = True
            error_type = e.__class__.__name__
            error_message = str(e)
            stack_trace = traceback.format_exc()
            raise

        finally:
            processing_time = (time.time() - start_time) * \
                1000

            try:
                request_log = RequestLog(
                    path=request_data['path'],
                    method=request_data['method'],
                    query_params=json.dumps(request_data['query_params']),
                    body=self._get_body(request),
                    headers=json.dumps(request_data['headers']),
                    ip_address=request_data['ip_address'],
                    user=request_data['user'],
                    processing_time=processing_time,
                    request_size=request_data['request_size'],
                    error_occurred=error_occurred,
                    error_type=error_type,
                    error_message=error_message,
                    stack_trace=stack_trace,
                    response_status=getattr(response, 'status_code', 500),
                    response_body=getattr(response, 'content', b'').decode(
                        'utf-8') if not error_occurred else None
                )
                request_log.save()
            except Exception as e:
                logger.error(f"Failed to save request log: {str(e)}")
                logger.error(f"Request data: {request_data}")

        return response

    def _get_body(self, request):
        if request.body:
            try:
                body = json.loads(request.body.decode('utf-8'))
                return self._sanitize_data(body)
            except json.JSONDecodeError:
                return request.body.decode('utf-8')
        return None

    def _sanitize_data(self, data):
        """Sanitize sensitive data from request body or headers"""
        if isinstance(data, dict):
            sanitized = data.copy()
            sensitive_fields = {
                'password', 'token', 'access_token', 'refresh_token', 'api_key', 'secret'}
            for key in data:
                if any(sensitive in key.lower() for sensitive in sensitive_fields):
                    sanitized[key] = '****'
            return sanitized
        return data

    def _sanitize_headers(self, headers):
        """Sanitize sensitive headers"""
        sensitive_headers = {'authorization', 'cookie', 'x-api-key'}
        return {k: '****' if k.lower() in sensitive_headers else v for k, v in headers.items()}

    def _get_client_ip(self, request):
        """Get the real client IP, considering proxy headers"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

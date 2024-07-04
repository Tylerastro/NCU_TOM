# middleware.py

import json

from django.contrib.auth import get_user_model
from helpers.models import RequestLog

User = get_user_model()


class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_data = {
            'path': request.path,
            'method': request.method,
            'query_params': request.GET.dict(),
            'body': request.body.decode('utf-8') if request.body else None,
            'headers': dict(request.headers),
            'ip_address': request.META.get('REMOTE_ADDR'),
            'user': None,
        }

        if hasattr(request, 'user') and request.user.is_authenticated:
            request_data['user'] = request.user

        response = self.get_response(request)

        request_log = RequestLog(
            path=request_data['path'],
            method=request_data['method'],
            query_params=json.dumps(request_data['query_params']),
            body=self._get_body(request),
            headers=json.dumps(request_data['headers']),
            ip_address=request_data['ip_address'],
            user=request_data['user'],
            response_status=response.status_code,
            response_body=response.content.decode('utf-8')
        )
        request_log.save()

        return response

    def _get_body(self, request):
        if request.body:
            try:
                body = json.loads(request.body.decode('utf-8'))
                if 'password' in body:
                    body['password'] = '****'
                if 're_password' in body:
                    body['re_password'] = '****'
                return json.dumps(body)
            except json.JSONDecodeError:
                return request.body.decode('utf-8')
        return None

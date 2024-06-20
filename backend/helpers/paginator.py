from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class Pagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'next': self.page.next_page_number() if self.page.has_next() else None,
            'previous': self.page.previous_page_number() if self.page.has_previous() else None,
            'count': self.page.paginator.count,
            'current': self.page.number,
            'total': self.page.paginator.num_pages,
            'results': data
        })

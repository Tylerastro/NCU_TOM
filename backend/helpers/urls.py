from django.urls import path

from .views import AnnouncementViewSet, CommentViewSet, TagViewSet

urlpatterns = [
    path("tags/", TagViewSet.as_view({'get': 'list', 'post': 'create'}), name="tags"),
    path("tags/<int:pk>/", TagViewSet.as_view({'get': 'retrieve'})),
    path("announcements/", AnnouncementViewSet.as_view({'get': 'list', 'post': 'create'}), name="announcements"),
    path("announcements/<int:pk>/", AnnouncementViewSet.as_view({'put': 'update', 'delete': 'destroy'}), name="announcements_detail"),
    path("comments/<int:pk>/", CommentViewSet.as_view({'put': 'update', 'delete': 'destroy'}), name="comments"),
]

from django.urls import path, re_path

from .views import (AnnouncementsDetailView, AnnouncementsView, CommentsView,
                    TagsDetailView, TagsView)

urlpatterns = [
    path("tags/", TagsView.as_view(), name="tags"),
    path("tags/<int:pk>/", TagsDetailView.as_view(),),
    path("announcements/", AnnouncementsView.as_view(), name="announcements"),
    path("announcements/<int:pk>/",
         AnnouncementsDetailView.as_view(), name="announcements"),
    path("comments/<int:pk>/",
         CommentsView.as_view(), name="comments"),
]

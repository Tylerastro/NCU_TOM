import dataproducts.views as views
from django.urls import path

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('data-products/lulin/target/<int:pk>/',
         views.LulinTargetDataView.as_view()),
    path('logs/ETL/', views.get_etl_logs),
]

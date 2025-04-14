from django.urls import path

from .views import (
    RetrieveBucketsView,
    RetrieveMeasurementsView,
    RetrieveFieldsView,
    ExecuteQueryView
)


urlpatterns = [
    path("buckets", RetrieveBucketsView.as_view()),
    path("measurements", RetrieveMeasurementsView.as_view()),
    path("fields", RetrieveFieldsView.as_view()),
    path("query", ExecuteQueryView.as_view()),
]

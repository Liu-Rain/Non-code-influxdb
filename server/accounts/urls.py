from django.urls import path

from .views import (
    LoginView,
    CheckAuthenticationView
)


urlpatterns = [
    path("signin/", LoginView.as_view()),
    path("me", CheckAuthenticationView.as_view()),
]
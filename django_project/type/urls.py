from django.urls import path
from .views import StatListView, StatDetailView
from . import views

urlpatterns = [
    path("", views.home, name='type-home'),
    path('stats/<int:pk>/', StatDetailView.as_view(), name='stat-detail'),
    path("about/", views.about, name='type-about'),
    path("stats/", StatListView.as_view(), name='type-stats'),
]
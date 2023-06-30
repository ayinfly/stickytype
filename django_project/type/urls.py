from django.urls import path
from .views import StatListView, StatDetailView, StatCreateView
from . import views

urlpatterns = [
    path("", views.home, name='type-home'),
    path('stats/<int:pk>/', StatDetailView.as_view(), name='stat-detail'),
    path('stats/new/', StatCreateView.as_view(), name='stat-create'),
    path("about/", views.about, name='type-about'),
    path("stats/", StatListView.as_view(), name='type-stats'),
]
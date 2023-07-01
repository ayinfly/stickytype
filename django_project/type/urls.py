from django.urls import path
from .views import StatListView, StatDetailView, StatCreateView, StatUpdateView, StatDeleteView
from . import views

urlpatterns = [
    path("", views.home, name='type-home'),
    path('stats/<int:pk>/', StatDetailView.as_view(), name='stat-detail'),
    path('stats/new/', StatCreateView.as_view(), name='stat-create'),
    path('stats/<int:pk>/update/', StatUpdateView.as_view(), name='stat-update'),
    path('stats/<int:pk>/delete/', StatDeleteView.as_view(), name='stat-delete'),
    path("about/", views.about, name='type-about'),
    path("stats/", StatListView.as_view(), name='type-stats'),
]
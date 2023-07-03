from django.urls import path
from .views import StatListView, StatDetailView, StatCreateView, StatUpdateView, StatDeleteView, LeaderboardListView
from . import views

urlpatterns = [
    path("", views.home, name='type-home'),
    path('stats/<int:pk>/', StatDetailView.as_view(), name='stat-detail'),
    path('stats/new/', StatCreateView.as_view(), name='stat-create'),
    path('stats/<int:pk>/update/', StatUpdateView.as_view(), name='stat-update'),
    path('stats/<int:pk>/delete/', StatDeleteView.as_view(), name='stat-delete'),
    path("about/", views.about, name='type-about'),
    path("stats/<str:username>", StatListView.as_view(), name='type-stats'),
    path("leaderboard/", LeaderboardListView.as_view(), name='type-leaderboard'),
    path("done/", views.newStat, name='type-done'),
]
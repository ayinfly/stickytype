from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name='type-home'),
    path("about/", views.about, name='type-about'),
    path("stats/", views.stats, name='type-stats'),

]
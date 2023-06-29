from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import Stat

def home(request):
    return render(request, 'type/home.html')

def about(request):
    context = {
        'title': 'about'
    }
    return render(request, 'type/about.html', context)

class StatListView(ListView):
    model = Stat
    template_name = 'type/stats.html'
    context_object_name = 'stats'
    ordering = ['-time']

class StatDetailView(DetailView):
    model = Stat

def stats(request):
    context = {
        'title': 'stats',
        'stats': Stat.objects.all()
    }
    return render(request, 'type/stats.html', context)
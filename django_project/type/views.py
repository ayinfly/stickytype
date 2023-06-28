from django.shortcuts import render
from .models import Stat

def home(request):
    return render(request, 'type/home.html')

def about(request):
    context = {
        'title': 'about'
    }
    return render(request, 'type/about.html', context)

def stats(request):
    context = {
        'title': 'stats',
        'stats': Stat.objects.all()
    }
    return render(request, 'type/stats.html', context)
from typing import Any
from django.db.models.query import QuerySet
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import User
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Stat
from django.http import HttpResponse
import json

def home(request):
    return render(request, 'type/home.html')

def about(request):
    context = {
        'title': 'about'
    }
    return render(request, 'type/about.html', context)

def newStat(request):
    if request.method == 'POST':
        wpm_total = request.POST.get('wpm_total')
        wpm_raw = request.POST.get('wpm_raw')
        accuracy = request.POST.get('accuracy')
        mode = request.POST.get('mode')
        m = Stat(wpm_total=wpm_total, wpm_raw=wpm_raw, accuracy=accuracy, author=request.user, mode=mode)
        m.save()
        return HttpResponse(json.dumps({'status': "1", 'username': request.user.username}), content_type="application/json")
    else:
        return redirect(stats)
        

class StatListView(ListView):
    model = Stat
    template_name = 'type/stats.html'
    context_object_name = 'stats'
    ordering = ['-time']
    paginate_by = 5

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        return Stat.objects.filter(author=user).order_by('-time')
        

class LeaderboardListView(ListView):
    model = Stat
    template_name = 'type/leaderboard.html'
    context_object_name = 'stats'
    ordering = ['-wpm_total']
    paginate_by = 5

class StatDetailView(DetailView):
    model = Stat

class StatCreateView(LoginRequiredMixin, CreateView):
    model = Stat
    fields = ['wpm_total', 'wpm_raw', 'accuracy', 'mode']
    for ch in 'qwertyuiopasdfghjklzxcvbnm':
        fields.append('wpm_' + ch)

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class StatUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Stat
    fields = ['wpm_total', 'wpm_raw', 'accuracy', 'mode']
    for ch in 'qwertyuiopasdfghjklzxcvbnm':
        fields.append('wpm_' + ch)

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
    
    def test_func(self):
        post = self.get_object()
        if self.request.user == post.author:
            return True
        return False

class StatDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Stat
    success_url = '/'

    def test_func(self):
        post = self.get_object()
        if self.request.user == post.author:
            return True
        return False

def stats(request):
    context = {
        'title': 'stats',
        'stats': Stat.objects.all()
    }
    return render(request, 'type/stats.html', context)
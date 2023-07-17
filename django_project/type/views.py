from typing import Any
from django.db.models.query import QuerySet
from django.db.models import Avg, Max, Min, Sum
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import User
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Stat
from users.models import Profile
from django.http import HttpResponse
import json

def home(request):
    context = {
        'title': 'type'
    }
    return render(request, 'type/home.html', context)

def about(request):
    context = {
        'title': 'about',
        'test_cnt': Stat.objects.count(),
        'avg_wpm': round(Stat.objects.aggregate(Avg('wpm_total'))['wpm_total__avg'], 2),
        'user_cnt': Profile.objects.count()
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
    paginate_by = 10

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        return Stat.objects.filter(author=user).order_by('-time')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        
        stat_queryset = self.get_queryset()
        try:
            context['avg_wpm_total'] = round(stat_queryset.aggregate(Avg('wpm_total'))['wpm_total__avg'], 2)
            context['avg_wpm_raw'] = round(stat_queryset.aggregate(Avg('wpm_raw'))['wpm_raw__avg'], 2)
            context['avg_accuracy'] = round(stat_queryset.aggregate(Avg('accuracy'))['accuracy__avg'], 2)
            context['max_wpm_total'] = round(stat_queryset.aggregate(Max('wpm_total'))['wpm_total__max'], 2)
            context['max_wpm_raw'] = round(stat_queryset.aggregate(Max('wpm_raw'))['wpm_raw__max'], 2)
            context['max_accuracy'] = round(stat_queryset.aggregate(Max('accuracy'))['accuracy__max'], 2)
            context['min_wpm_total'] = round(stat_queryset.aggregate(Min('wpm_total'))['wpm_total__min'], 2)
            context['min_wpm_raw'] = round(stat_queryset.aggregate(Min('wpm_raw'))['wpm_raw__min'], 2)
            context['min_accuracy'] = round(stat_queryset.aggregate(Min('accuracy'))['accuracy__min'], 2)
        except:
            context['avg_wpm_total'] = 0
            context['avg_wpm_raw'] = 0
            context['avg_accuracy'] = 0
            context['max_wpm_total'] = 0
            context['max_wpm_raw'] = 0
            context['max_accuracy'] = 0
            context['min_wpm_total'] = 0
            context['min_wpm_raw'] = 0
            context['min_accuracy'] = 0
        context['title'] = 'stats'
        graph_wpm = []
        graph_date = []
        for stat in stat_queryset:
            graph_wpm.append(stat.wpm_total)
            graph_date.append(str(stat.time))
        context['graph_wpm'] = graph_wpm
        context['graph_date'] = graph_date
        context['image'] = user.profile.image  # Assuming User model has a related Profile model with an image field
        return context
        

class LeaderboardListView(ListView):
    model = Stat
    template_name = 'type/leaderboard.html'
    context_object_name = 'stats'
    ordering = ['-wpm_total']
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'leaderboard'
        return context

class StatDetailView(DetailView):
    model = Stat
    context_object_name = 'stat'

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
from django.shortcuts import render

posts = [
    {
        'author': 'Help',
        'title': 'Help title',
        'content': 'whooh',
        'date_posted': 'idk'
    },
    {
        'author': 'Help 2',
        'title': 'Help title',
        'content': 'whooh',
        'date_posted': 'idk'
    },
    {
        'author': 'Help 3',
        'title': 'Help title',
        'content': 'whooh',
        'date_posted': 'idk'
    }
]

def home(request):
    context = {
        'posts': posts
    }
    return render(request, 'type/home.html', context)

def about(request):
    return render(request, 'type/about.html', {'title': 'about'})
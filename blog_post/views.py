from django.shortcuts import render
from django.template.response import TemplateResponse

from .models import BlogPosts

def post_view(request, arg):
    content = {}

    blog_posts = BlogPosts.objects.filter(is_published=True).order_by('-post_published_on')
    
    content['blog_posts'] = blog_posts
    return render(request, 'blog_body.html', content)

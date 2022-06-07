from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.template.response import TemplateResponse

from taggit.models import Tag

from .models import BlogPosts,Categories,Profile
from .forms import PostForm,CategoryForm

from .scripts import load_sidebars_nav

def create_category(request):
    content = {}
    if request.method == 'POST':
        category_form = CategoryForm(request.POST)
        if category_form.is_valid():
            category_form.save()
            return HttpResponseRedirect('/create/')

    else:
        category_form = CategoryForm()

    content['category_form'] = category_form
    print(content['category_form'])
    return render(request, 'blog_post/create_category.html',content)

def create_post(request):
    content = {}
    # Load the information for the navigation/about_me/category tags.
    # content["navitation"]
    # content['about_me']
    # content['tags']
    content = load_sidebars_nav()

    if request.method == 'POST':
        post_form = PostForm(request.POST)
        if post_form.is_valid():
            post_form.save()
    else:
        post_form = PostForm()

    #Make the dirctory of content to be used in the site:
    content['post_form'] = post_form

    return render(request, 'blog_post/create_post.html',content)

def post_view(request,slug=None):
    content = {}
    # Load the information for the navigation/about_me/category tags.
    # content["navitation"]
    # content['about_me']
    # content['tags']
    content = load_sidebars_nav()

    post = BlogPosts.objects.filter(author=content['aboutme'].pk,slug=slug)

    content["posts"] = post
    content['posts_exists'] = True
    return render(request, 'blog_post/blog_body.html', content)

def home_view(request, slug=None):
    content = {}
    # Load the information for the navigation/about_me/category tags.
    # content["navitation"]
    # content['about_me']
    # content['tags']
    content = load_sidebars_nav()

    # Creates the blog posts for the site. If there has been no post published
    # then it will default to saying there is no posts.
    posts_exists = True
    no_posts_comment = "Blog post 404, These are not the posts you are looking for."

    # If the user wants to filter the blog this will handle any of the quick
    # taggit links and category navigation filters that are used on the site.
    print(content)
    print(content['about_me'])
    if slug:
        if slug.startswith("category-"):
            category = Categories.objects.get(slug=slug)
            posts = BlogPosts.objects.filter(author=content['about_me'].id,is_published=True,category=category).order_by('-post_published_on')

        else:
            posts = BlogPosts.objects.filter(author=content['about_me'].id,is_published=True,tags__slug=slug).order_by('-post_published_on')
    else:
        posts = BlogPosts.objects.filter(author=content['about_me'].id,is_published=True).order_by('-post_published_on')

    # Checks to see if there is any objests in posts, If there is none then it
    # send the no_posts_comment to the user.
    if not posts.exists():
        posts = no_posts_comment
        posts_exists = False

    # Set all needed data to the dictionary of contants used by the frount end.
    content['posts'] = posts
    content['posts_exists'] = posts_exists

    return render(request, 'blog_post/blog_body.html', content)

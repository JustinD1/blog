from django.contrib.auth.models import User
from .models import Categories
from taggit.models import Tag

def blog_owner():
    #This is set up to only display information about the author of the blog. To
    #allow the ability of other users in the site access but the home page is
    #always about the blog owner.
    return User.objects.get(groups__name="Blog_Owner")

def build_tag_menu():
    content = {}
    for category in Categories.objects.all():
        content[category] = Tag.objects.filter(blogposts__author=blog_owner().id,blogposts__category=category).distinct().order_by('name')
    return content


def load_sidebars_nav():
    content={}
    # print('Load in about me section')
    content['about_me'] = blog_owner()

    # Load in the category model for setting up the navigation for the site and
    # the tag's used in the categories
    if Categories.objects.all().exists():
        # print('Load in nav section')
        content["navigation"] = Categories.objects.all()
        # print('Load in tag section')
        content['tags'] = build_tag_menu()

    return content

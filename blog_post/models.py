from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.text import slugify
from django.utils.timezone import now

from blog.util import unique_slug_generator

from taggit.managers import TaggableManager
from taggit.models import TagBase, GenericTaggedItemBase

class PublishedPapers(models.Model):
    """docstring for ExternalLinks for none social media."""
    """I want to distinguish between the socials and other work I have done"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(blank=True, max_length=100)
    url = models.URLField(blank=False)
    show = models.BooleanField(default=True)
    position = models.IntegerField(blank=True, null=True)

    def __init__(self, arg):
        super(ExternalLinks, self).__init__()
        self.arg = arg


class SocialLinks(models.Model):
    """docstring for Socials."""
    """ This is mainly to link to linkedin profile. """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(blank=True, max_length=100)
    social_username = models.CharField(blank=False, max_length=100)
    social_link = models.URLField(blank=False)
    show = models.BooleanField(default=True)
    logo = models.ImageField(upload_to="social_logo/", null=True,blank=True)
    position = models.IntegerField(blank=True, null=True)

    def __init__(self, arg):
        super(Socials, self).__init__()
        self.arg = arg


class Profile(models.Model):
    """This extends the user model created by django. It is to render the about
    me section on the blog, commeting out the external links for now as I want
    think how to handle them"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    # socials = models.ForeignKey(SocialLinks, on_delete=models.CASCADE)
    # papers = models.ForeignKey(PublishedPapers, on_delete=models.CASCADE)

class Categories(models.Model):
    """(Categories description)"""
    """ Model for listing all the categories that are created by the user. This
    is the same list that creates the site navigation """
    category = models.CharField(blank=True, max_length=100)
    slug = models.SlugField(unique=True,null=True,editable=False,blank=True)

    def __str__(self):
        return self.category
    def save(self, *args, **kwargs):
        value = "-".join(("category", self.category))
        self.slug = slugify(value, allow_unicode=True)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"

    def __unicode__(self):
        return u"Categories"

class BlogPosts(models.Model):
    """(Blogpost description)"""
    """This model covers the structure of the blog posts.
        It calls other models for the
            -Author of the post the current person that is logged in.
            -Catagory seleted and created by the user.
            -Tags handled by the addon django-taggit."""
    title = models.CharField(blank=False, max_length=300)
    body = models.TextField(blank=True, max_length=1000)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    slug = models.SlugField(max_length=350, unique=True,null=True,editable=False,blank=True)
    post_created_on = models.DateTimeField(auto_now_add=True)
    post_published_on = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    thumbnail = models.ImageField(upload_to='post_images/%Y/%m/%d/', height_field=300, width_field=250,blank=True, null=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)

    tags=TaggableManager()

    def __str__(self):
        name = '.'.join((self.author.first_name[0], self.author.last_name))
        return ':'.join((name, self.title,))

    class Meta:
        verbose_name = "post"
        verbose_name_plural = "posts"
        ordering = ("-post_created_on",)

    def __unicode__(self):
        return u"Blogpost"

class PostAlbum(models.Model):
    """(PostAlbum description)"""
    """ If the user wants to add an album to the post this models links to the original post and will delete the album on CASCADE"""
    image = models.ImageField(upload_to='post_images/%Y/%m/%d/')
    blogpost = models.ForeignKey(BlogPosts,on_delete=models.CASCADE)

    def __unicode__(self):
        return u"PostAlbum"
"""These are hooks for saving information to the database, via
automatically taking information from other fields for the slug field which is
compossited of titles/prefix/counter to keep the slug unique. and for the user
to fill out the about me section when an account is created."""
@receiver(pre_save, sender=BlogPosts)
def pre_save_receiver(sender, instance, *args, **kwargs):
   if not instance.slug:
       instance.slug = unique_slug_generator(instance)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

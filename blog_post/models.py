from django.db import models
from django.utils.timezone import now
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import pre_save

from blog.util import unique_slug_generator

from taggit.managers import TaggableManager

class Categories(models.Model):
    """(Categories description)"""
    """ Model for listing all the categories that are created by the user. This is the same list that creates the site navigation """
    category = models.CharField(blank=True, max_length=100)
    slug = models.SlugField(unique=True,null=True,editable=False,blank=True)

    def __str__(self):
        return self.category
    def save(self, *args, **kwargs):
        value = self.category
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


@receiver(pre_save, sender=BlogPosts)
def pre_save_receiver(sender, instance, *args, **kwargs):
   if not instance.slug:
       instance.slug = unique_slug_generator(instance)

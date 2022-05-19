from django.contrib import admin

from .models import BlogPosts,Categories

# Register your models here.

class PostEntery(admin.ModelAdmin):
    list_display = ("title","author","slug","post_created_on","post_published_on","is_published","category",)


class CatagoryEntery(admin.ModelAdmin):
    list_display = ("category","slug",)


admin.site.register(BlogPosts,PostEntery)
admin.site.register(Categories,CatagoryEntery)

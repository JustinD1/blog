from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import BlogPosts,Categories,Profile

"""Link the profile to the user model in the admin."""
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'
class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)

"""Give the admin access to the model fields to be view/edited"""
class PostEntery(admin.ModelAdmin):
    model=BlogPosts
class CategoryEntery(admin.ModelAdmin):
    model=Categories



admin.site.register(Categories,CategoryEntery)
admin.site.register(BlogPosts,PostEntery)
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

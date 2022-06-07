from django import forms
from django.conf import settings
from django.forms import ModelForm, widgets
from django.urls.base import reverse
from django.utils.safestring import mark_safe

from .models import BlogPosts,Categories

#widget to add "+" icon next to the category in the create post page, though
#I need to figure out how to fix the static icon link as it is showing up as a
#imgage 404.
class RelatedFieldWidgetCanAdd(widgets.Select):

    def __init__(self, related_model, related_url=None, *args, **kw):

        super(RelatedFieldWidgetCanAdd, self).__init__(*args, **kw)

        if not related_url:
            rel_to = related_model
            info = (rel_to._meta.app_label, rel_to._meta.object_name.lower())
            related_url = 'admin:%s_%s_add' % info

        # Be careful that here "reverse" is not allowed
        self.related_url = related_url

    def render(self, name, value, *args, **kwargs):
        self.related_url = reverse(self.related_url)
        output = [super(RelatedFieldWidgetCanAdd, self).render(name, value, *args, **kwargs)]
        output.append('<a href="%s?_to_field=id&_popup=1" class="add-another" id="add_id_%s" onclick="return showAddAnotherPopup(this);"> ' % \
            (self.related_url, name))
        output.append('<img src='"%simage/icon_addlink.svg"' width="10" height="10" alt="%s"/></a>' % (settings.STATIC_URL, 'Add Another'))
        return mark_safe(''.join(output))

#This is form model for adding in a new categoty as a user.
class CategoryForm(ModelForm):
    class Meta:
        model=Categories
        fields=['category']
#This is the form models for the user to add in a post via the site and not admin.
#It calls in the widget to the category so you can add in a new object.
class PostForm(ModelForm):
    category = forms.ModelChoiceField(
       required=False,
       queryset=Categories.objects.all(),
       widget=RelatedFieldWidgetCanAdd(Categories, related_url="create_category")
                                    )
    class Meta:
        model=BlogPosts
        fields=['title','body','author','is_published','category','tags','thumbnail']

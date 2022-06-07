from django import template
from django.urls.base import reverse

register = template.Library()

@register.simple_tag
def navactive(request, urls, slug):
    if request.path in ( reverse(url, kwargs={'slug':slug}) for url in urls.split() ):
        return "active"
    return ""

from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('search/<str:slug>/', views.home_view, name='blog_filter'),
    path('post/<str:slug>/', views.post_view, name='post_detail'),
    path('create/', views.create_post, name='create_post'),
    path('create/category/', views.create_category, name='create_category'),
]

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'), # This is the path to the index page,
    path('basic', views.my_api_view, name='basic')
]
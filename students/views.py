from django.shortcuts import render
from django.http import JsonResponse
from .models import Students

# Create your views here.

def index(request):
    return render(request, 'students/index.html')

def my_api_view(request):
    s1 = Students.objects.create(name="last", email="last@last.com", regdno="RA2011029010011")
    data = {
        'message': "Parth" + '!',
        'status': 'Done'
    }
    return JsonResponse(data)

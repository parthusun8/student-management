from django.db import models

# Create your models here.
class Students(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    regdno = models.CharField(max_length=20)
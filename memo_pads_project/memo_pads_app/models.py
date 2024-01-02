from django.db import models
from django.contrib.auth.models import User


class MemoPads(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.ForeignKey("Category", on_delete=models.SET_NULL, null=True)
    note = models.CharField()
    image = models.ImageField(upload_to='memo_images/', null=True, blank=True)


class Category(models.Model):
    category = models.CharField(max_length=64)

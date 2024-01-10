from memo_pads_app.models import MemoPads, Category
from rest_framework import serializers
from django.contrib.auth.models import Group, User
class MemoPadsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemoPads
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

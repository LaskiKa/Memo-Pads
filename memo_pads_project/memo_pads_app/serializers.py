from memo_pads_app.models import MemoPads, Category
from rest_framework import serializers
from django.contrib.auth.models import Group, User


class UserSerializer(serializers.ModelSerializer):
    memopads = serializers.PrimaryKeyRelatedField(many=True, queryset=MemoPads.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'memopads']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

    def update(self, instance, validated_data):
        instance.category = validated_data.get('category', instance.category)
        instance.save()

        return instance


class MemoPadsSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    # category = serializers.StringRelatedField()
    class Meta:
        model = MemoPads
        fields = '__all__'
        # fields = ('id', 'owner', 'title', 'category', 'note', 'image')

    def create(self, validated_data):
        category_data = validated_data.pop('category')
        category_instance = Category.objects.create(**category_data)
        memo_instance = MemoPads.objects.create(category=category_instance, **validated_data)
        return memo_instance

    def update(self, instance, validated_data):
        """Update existing memopad. It is checking is category existin or is new"""
        category_data = validated_data.pop('category')
        userMemeos = MemoPads.objects.filter(owner=validated_data.get('owner'))
        is_new_Category = False


        for memo in userMemeos:
            if memo.category.category == category_data.get('category'):
                is_new_Category = False
                break
            else:
                is_new_Category = True

        if is_new_Category:
            new_category = Category.objects.create(category=category_data.get('category'))
            category = new_category
        else:
            category = Category.objects.get(category=category_data.get('category'))

        instance.category = category
        instance.title = validated_data.get('title', instance.title)
        instance.note = validated_data.get('note', instance.note)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance

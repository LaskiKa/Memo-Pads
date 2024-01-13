"""
URL configuration for memo_pads_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from memo_pads_app.views import (MainSite, MemoPadsView, LoginView,
                                 LogoutView, ShuffleView, RegisterView,
                                 MemoPadDetailView, MemoPadDelete,
                                 MemoPadViewSet, CategoryViewSet,
                                 UserViewSet)
from rest_framework import routers, renderers




memopads_list = MemoPadViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

memopad_detail = MemoPadViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

category_list = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

category_detail = CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

user_list = UserViewSet.as_view({
    'get': 'list'
})
user_detail = UserViewSet.as_view({
    'get': 'retrieve'
})

router = routers.DefaultRouter()
router.register(r'memopadsapi', MemoPadViewSet)
router.register(r'categoryapi', CategoryViewSet)
router.register(r'userapi', UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    # path('memopadsapi/', memopads_list, name='memopadsapi'),
    # path('memopadsapi/<int:pk>', memopad_detail, name='memopaddetailapi'),
    # path('users/', user_list, name='usersapi'),
    # path('users/<int:pk>', user_detail, name='userdetailapi'),
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', MainSite.as_view(), name='main'),
    path('memopads/', MemoPadsView.as_view(), name='memopads'),
    path('memopads/<int:pk>/', MemoPadDetailView.as_view(), name='memopad'),
    path('memopads/delete/<int:pk>/', MemoPadDelete.as_view(), name='delete'),
    path('shuffle/', ShuffleView.as_view(), name='shuffle'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += router.urls
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
from memo_pads_app.views import MainSite, MemoPadsView, LoginView, LogoutView, ShuffleView, RegisterView, MemoPadDetailView, MemoPadDelete

urlpatterns = [
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

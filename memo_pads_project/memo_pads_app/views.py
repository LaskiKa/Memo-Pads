import random

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from memo_pads_app.models import MemoPads, Category
from django.views import View


# Create your views here.

class MainSite(View):
    """Main site of Memo pads app"""

    def get(self, request):
        return render(request,
                      'base.html')


class MemoPadsView(View):
    """Memo pads list"""

    def get(self, request):
        user_id = self.request.user.id
        categories = Category.objects.filter(memopads__owner=user_id).distinct()
        memopads = MemoPads.objects.filter(owner=user_id)

        return render(request,
                      'memo-pads.html',
                      context={"memopads": memopads,
                               "categories": categories})

    def post(self, request):
        title = request.POST.get('title')
        category_select = request.POST.get('category-select')
        category_input = request.POST.get('category-input')
        image = request.FILES.get('image')
        note = request.POST.get('note')
        user_id = self.request.user.id

        if category_select == 'addNewCategory':
            new_category, created = Category.objects.get_or_create(category=category_input)
            category = new_category
        else:
            category = Category.objects.get(pk=category_select)

        MemoPads.objects.create(owner_id=user_id,
                                title=title,
                                category=category,
                                note=note,
                                image=image)

        return redirect('memopads')


class MemoPadDetailView(View):
    def get(self, request, pk):
        user_id = self.request.user.id
        memopad = MemoPads.objects.get(pk=pk)
        categories = Category.objects.filter(memopads__owner=user_id).distinct()

        return render(request,
                      'memo-pad-details.html',
                      context={
                          "memopad": memopad,
                          "categories": categories
                      })

    def post(self, request, pk):
        """Memo Pad update"""
        memopad = MemoPads.objects.get(pk=pk)

        title = request.POST.get('title')
        category_select = request.POST.get('category-select')
        category_input = request.POST.get('category-input')
        image = request.FILES.get('image')
        note = request.POST.get('note')

        if category_select == 'addNewCategory':
            new_category, created = Category.objects.get_or_create(category=category_input)
            category = new_category
        else:
            category = Category.objects.get(pk=category_select)

        memopad.title = title
        memopad.category = category
        if not image == None:
            memopad.image = image
        memopad.note = note
        memopad.save()

        return redirect('memopads')


class MemoPadDelete(View):
    def get(self, request, pk):
        return render(request,
                      'delete.html')

    def post(self, request, pk):
        memopad = MemoPads.objects.get(pk=pk)
        memopad.delete()

        return redirect('memopads')
class ShuffleView(View):
    def get(self, request):
        user_id = self.request.user.id
        memopads_queryset = MemoPads.objects.filter(owner=user_id)
        memopads = list(memopads_queryset)

        random.shuffle(memopads)

        return render(request,
                      'shuffle.html',
                      context={"memopads": memopads})


class LoginView(View):
    def get(self, request):
        return render(request,
                      'login.html')

    def post(self, request):
        user_mail = request.POST.get("email")
        user_password = request.POST.get("password")

        userobj = User.objects.filter(email=user_mail).first()

        if userobj is None:
            messages.warning(request, "Wrong mail or password, try again.")
            return render(request,
                          'login.html',
                          )

        user = authenticate(username=userobj.username, password=user_password)
        try:
            auth = user.is_authenticated
            login(self.request, user)
            return redirect('/memopads')

        except AttributeError:
            messages.warning(request, "Wrong mail or password, try again.")
            return render(request,
                          'login.html',
                          )


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('/')


class RegisterView(View):

    def get(self, request):
        return render(request,
                      'register.html')

    def post(self, request):
        username = request.POST.get("user_name")
        user_mail = str(request.POST.get("email"))
        user_password = request.POST.get("password")

        if User.objects.filter(email=user_mail).first():
            messages.success(request, "Account already exist, try to login")
            return redirect('/register')

        usr_obj = User(username=username, email=user_mail)
        usr_obj.set_password(user_password)
        usr_obj.save()

        return redirect('/login')

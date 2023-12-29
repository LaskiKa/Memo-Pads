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
        categories = Category.objects.all()
        memopads = MemoPads.objects.filter(owner=self.request.user.id)
        return render(request,
                      'memo-pads.html',
                      context={"memopads": memopads,
                               "categories": categories})

    def post(self, request):
        print(request.POST)

        title = request.POST.get('title')
        categoryselect = request.POST.get('category-select')
        categoryinput = request.POST.get('category-input')
        note = request.POST.get('note')
        categories = Category.objects.all()
        memopads = MemoPads.objects.all()

        memopad = MemoPads(owner=self.request.user,
                           title=title,
                           category=Category.objects.get(pk=categoryselect),
                           note=note)
        memopad.save()

        return render(request,
                      'memo-pads.html',
                      context={"memopads": memopads,
                               "categories": categories})


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
        if user.is_authenticated:
            login(self.request, user)
            return redirect('/memopads')

        else:
            messages.warning(request, "Wrong mail or password, try again.")
            return render(request,
                          'login.html',
                          )

class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('/main')
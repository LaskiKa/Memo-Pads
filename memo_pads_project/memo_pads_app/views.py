from django.shortcuts import render
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
        memopads = MemoPads.objects.all()
        return render(request,
                      'memo-pads.html',
                      context={"memopads": memopads})

from django.contrib import admin
from .models import Items

class ItemAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'name')
    list_display_links = ('id', 'user', 'name' )
admin.site.register(Items, ItemAdmin)
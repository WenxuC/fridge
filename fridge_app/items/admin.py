from django.contrib import admin
from .models import Items

class ItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'name')
    list_display_links = ('user', 'name')
admin.site.register(Items, ItemAdmin)
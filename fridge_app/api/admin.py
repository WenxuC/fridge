from django.contrib import admin
from .models import Recipe

# Register your models here.
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'source')
    list_display_links = ('id', 'title')

admin.site.register(Recipe, RecipeAdmin)

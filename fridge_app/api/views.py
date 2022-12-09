from django.shortcuts import render
from django.http import HttpResponse
# Write the endpoints
def main(request):
    print('hello')
    return HttpResponse("Hello")
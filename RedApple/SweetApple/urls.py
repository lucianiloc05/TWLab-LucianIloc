from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.loading, name='loading'),
    path('loading/', views.loading, name='loading'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('home/', views.home, name='home'),
    path('universities/', views.universities, name='universities'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('galerie/', views.galerie, name='galerie'),
    path('species/', views.naturalist_page, name='naturalist_page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

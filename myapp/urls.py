from django.contrib import admin
from django.urls import path
from myapp import views

urlpatterns = [
    path('',views.index, name='index'),
    path('download_resume/',views.download_resume, name='download_resume'),
    path('save-resume-email/', views.save_resume_email, name='save_resume_email'),
    path('save-contact/', views.save_contact, name='save_contact'),
]
from django.shortcuts import render
from myapp.models import Contact, ResumeDownloadEmail
from datetime import datetime
from django.http import FileResponse, Http404
from django.http import HttpResponse
from django.conf import settings
import os
from django.http import JsonResponse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def index(request):
    if request.method == "POST":
        print("POST RECEIVED:", request.POST)
        current_now = datetime.now()

        Contact.objects.create(
            name=request.POST.get("name"),
            email=request.POST.get("email"),
            message=request.POST.get("message"),
            date = current_now.date(),
            time = current_now.time()

        )

        print("SAVED TO DB")

    return render(request, "portfolio.html")

def save_resume_email(request):
    if request.method == "POST":
        email = request.POST.get("email", "").strip()

        if not email:
            return JsonResponse({"status": "error", "message": "Email required"})

        try:
            validate_email(email)  # 🔥 Django built-in validator
        except ValidationError:
            return JsonResponse({"status": "error", "message": "Invalid email format"})

        ResumeDownloadEmail.objects.create(email=email)
        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "invalid request"})

def download_resume(request):
    file_path = os.path.join(
        settings.BASE_DIR,
        'protected_files',
        'Vrushank_Resume.pdf'
    )

    if not os.path.exists(file_path):
        raise Http404("File not found")

    return FileResponse(
        open(file_path, 'rb'),
        as_attachment=True,
        filename='Vrushank_Resume.pdf'
    )

    file_path = os.path.join(settings.MEDIA_ROOT,'Vrushank_Resume.pdf')
    if os.path.exists(file_path):
        return FileResponse( open(file_path,'rb'), as_attachment=True, filename='Vrushank_Resume.pdf')
    else:
        raise Http404("File not found")

def save_contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        contact = Contact(name = name, email = email, message = message)
        contact.save()

        return redirect('index')  # Redirect to the index page after saving
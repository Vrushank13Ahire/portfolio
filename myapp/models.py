from django.db import models

# Create your models here.

class Contact(models.Model):
    name = models.CharField(max_length=122)
    email = models.EmailField()
    message = models.TextField()
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

class ResumeDownloadEmail(models.Model):
    email = models.EmailField()
    downloaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

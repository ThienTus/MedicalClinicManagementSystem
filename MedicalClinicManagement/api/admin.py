from django.contrib import admin
from .models import UserProfile, Medicine, Schedule, PatientAppointment, Prescription
from django.contrib.auth.models import User

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar')

class MedicineAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price')

class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'nurse', 'date', 'shift')

class PatientAppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'appointment_date', 'confirmed')

class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'symptoms', 'diagnosis')  # Specify which fields to display in the list view

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Medicine, MedicineAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(PatientAppointment, PatientAppointmentAdmin)
admin.site.register(Prescription, PrescriptionAdmin)

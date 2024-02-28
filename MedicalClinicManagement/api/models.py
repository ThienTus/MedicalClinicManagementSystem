# api/models.py
from django.db import models
from django.contrib.auth.models import User

TIME_SLOT_CHOICES = [
    ("7-8", "7-8"),
    ("9-10", "9-10"),
    ("10-11", "10-11"),
    ("11-12", "11-12"),
    ("12-13", "12-13"),
    ("13-14", "13-14"),
    ("15-16", "15-16"),
    ("17-18", "17-18"),
    ("19-20", "19-20"),
    ("21-22", "21-22"),
]


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/')

    def __str__(self):
        return self.user.username
    
class Medicine(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    
class Schedule(models.Model):
    SHIFT_CHOICES = [
        ('Morning', 'Morning'),
        ('Afternoon', 'Afternoon'),
        ('Night', 'Night'),
    ]

    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_schedules')
    nurse = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nurse_schedules')
    date = models.DateField()
    shift = models.CharField(max_length=10, choices=SHIFT_CHOICES)

    def __str__(self):
        return f"{self.doctor.username} - {self.date} - {self.shift}"

class PatientAppointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    time_slot = models.CharField(max_length=10, choices=TIME_SLOT_CHOICES, default="7-8")
    confirmed = models.BooleanField(default=False)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='appointments', default="1")

    def __str__(self):
        return f"{self.patient.username} - {self.appointment_date} - {self.time_slot}"

class Prescription(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions_given')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions_received')
    symptoms = models.TextField()
    diagnosis = models.TextField()
    medicines = models.ManyToManyField(Medicine, related_name='prescriptions')

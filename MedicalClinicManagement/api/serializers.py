# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Medicine, Schedule, PatientAppointment, Prescription
from oauth2_provider.models import Application

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    scope = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'scope']

    def get_avatar(self, obj):
        # Lấy thông tin avatar từ UserProfile nếu có
        if hasattr(obj, 'userprofile') and obj.userprofile.avatar:
            return obj.userprofile.avatar.url
        return None

    def get_scope(self, obj):
        # Trả về scope của user dựa trên thông tin OAuth2
        try:
            application = Application.objects.get(user=obj)
            return application.name
        except Application.DoesNotExist:
            return None

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar']

class UserRegisterSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create_user(**validated_data)
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        return user

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'name', 'description', 'price']

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'doctor', 'nurse', 'date', 'shift']

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

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'doctor', 'nurse', 'date', 'shift']

class PatientAppointmentSerializer(serializers.ModelSerializer):
    time_slot = serializers.ChoiceField(choices=TIME_SLOT_CHOICES)
    schedule = serializers.PrimaryKeyRelatedField(queryset=Schedule.objects.all())

    class Meta:
        model = PatientAppointment
        fields = ['id', 'patient', 'appointment_date', 'time_slot', 'confirmed', 'schedule']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'doctor', 'patient', 'symptoms', 'diagnosis', 'medicines']

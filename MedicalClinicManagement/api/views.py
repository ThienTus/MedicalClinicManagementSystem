# api/views.py
from rest_framework import status, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Medicine, Schedule, PatientAppointment, Prescription
from .serializers import UserRegisterSerializer, MedicineSerializer, ScheduleSerializer, PatientAppointmentSerializer, PrescriptionSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from oauth2_provider.models import get_application_model, get_access_token_model
from django.contrib.auth.models import User
from oauth2_provider.settings import oauth2_settings
from oauthlib.oauth2.rfc6749.tokens import random_token_generator
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from oauth2_provider.models import AccessToken
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import UserProfile, PatientAppointment
from .serializers import UserSerializer 
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
from django.conf import settings
from urllib.parse import unquote
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

ACCESS_TOKEN_EXPIRE_SECONDS = 3600  # Ví dụ: hết hạn sau 1 giờ

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'schedules': reverse('schedule-list-create', request=request, format=format),
        'appointments': reverse('appointment-list-create', request=request, format=format),
        'users': reverse('user-list-create', request=request, format=format),
        # Thêm các endpoint API khác nếu cần thiết...
    })
class UserListCreateAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        data = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'avatar': unquote(user.userprofile.avatar.url).replace('/https:', 'https:') if hasattr(user, 'userprofile') and user.userprofile.avatar else None,
            }
            data.append(user_data)
        return Response(data)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar': user.userprofile.avatar.url.split(settings.MEDIA_URL, 1)[-1] if hasattr(user, 'userprofile') and user.userprofile.avatar else None,
        }
        return Response(data)
    
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        scope = request.data.get('scope')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        avatar = request.data.get('avatar')

        # Kiểm tra xem scope có hợp lệ không
        valid_scopes = ['admin', 'doctor', 'nurse', 'patient']
        if scope not in valid_scopes:
            return Response({'error': 'Invalid scope'}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo user
        user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name)
        
        # Tạo thông tin UserProfile
        UserProfile.objects.create(user=user, avatar=avatar)

        # Tạo application cho user dựa trên scope
        Application = get_application_model()
        app = Application.objects.create(
            user=user,
            client_type='confidential',
            authorization_grant_type='password',
            name=scope,
            redirect_uris='',
        )

        # Tạo access token cho application
        AccessToken = get_access_token_model()
        access_token = AccessToken.objects.create(
            user=user,
            application=app,
            token=random_token_generator(request),
            scope=scope,
            expires=timezone.now() + timedelta(seconds=oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS)
        )

        access_token.save()

        return Response({'message': 'Đăng ký thành công'}, status=status.HTTP_201_CREATED)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Xác thực thành công, tạo access token và trả về cho người dùng
            token_info = self.create_access_token(user, request)
            return Response(token_info, status=status.HTTP_200_OK)
        else:
            # Xác thực thất bại
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

    def create_access_token(self, user, request):
        AccessToken = get_access_token_model()
        application = self.get_user_application(user)

        if application:
            access_token_expire_seconds = oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS  # Lấy giá trị của cấu hình access token expire seconds
            scopes = oauth2_settings.SCOPES.get(application.name)  # Lấy giá trị của scopes từ cấu hình
            access_token = AccessToken.objects.create(
                user=user,
                application=application,
                token=random_token_generator(request),
                scope=scopes,
                expires=timezone.now() + timedelta(seconds=access_token_expire_seconds)
            )
            token_info = {
                'access_token': access_token.token,
                'expires_in': access_token_expire_seconds,
                'token_type': 'Bearer',
                'scope': scopes,
            }
            return token_info
        else:
            raise Exception("User's application not found")

    def get_user_application(self, user):
        Application = get_application_model()
        try:
            application = Application.objects.get(user=user)
            return application
        except Application.DoesNotExist:
            return None
    

class MedicineCreateAPIView(generics.CreateAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

class MedicineUpdateAPIView(generics.UpdateAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    lookup_field = 'pk'

class MedicineDeleteAPIView(generics.DestroyAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    lookup_field = 'pk'

class MedicineSearchAPIView(generics.ListAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset
    
class MedicineListAPIView(ListAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

class MedicineDetailAPIView(RetrieveAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

class ScheduleListCreateAPIView(APIView):
    def get(self, request):
        schedules = Schedule.objects.all()
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScheduleDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Schedule.objects.get(pk=pk)
        except Schedule.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        schedule = self.get_object(pk)
        serializer = ScheduleSerializer(schedule)
        return Response(serializer.data)

    def put(self, request, pk):
        schedule = self.get_object(pk)
        serializer = ScheduleSerializer(schedule, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        schedule = self.get_object(pk)
        schedule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PatientAppointmentListCreateAPIView(APIView):
    def get(self, request):
        appointments = PatientAppointment.objects.all()
        serializer = PatientAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientAppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment_date = serializer.validated_data['appointment_date']
            time_slot = serializer.validated_data['time_slot']
            existing_appointments = PatientAppointment.objects.filter(appointment_date=appointment_date, time_slot=time_slot).count()
            if existing_appointments >= 10:
                return Response({'error': 'Số lượng đăng ký cho khung giờ này đã đạt tối đa'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientAppointmentDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return PatientAppointment.objects.get(pk=pk)
        except PatientAppointment.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        appointment = self.get_object(pk)
        serializer = PatientAppointmentSerializer(appointment)
        return Response(serializer.data)

    def put(self, request, pk):
        appointment = self.get_object(pk)
        serializer = PatientAppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        appointment = self.get_object(pk)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class UserAppointmentListAPIView(generics.ListAPIView):
    serializer_class = PatientAppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lấy user hiện tại đăng nhập và lấy tất cả các cuộc hẹn của user đó
        user = self.request.user
        return PatientAppointment.objects.filter(patient=user)
    
class PrescriptionCreateAPIView(generics.CreateAPIView):
    serializer_class = PrescriptionSerializer

    def perform_create(self, serializer):
        # Lưu thông tin toa thuốc và liên kết với bác sĩ và bệnh nhân
        serializer.save(doctor=self.request.user)

class PrescriptionListAPIView(generics.ListAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]
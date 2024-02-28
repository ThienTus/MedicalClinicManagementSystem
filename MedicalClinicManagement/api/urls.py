from django.urls import path
from .views import PrescriptionListAPIView, PrescriptionCreateAPIView, UserListCreateAPIView, UserDetailAPIView, UserAppointmentListAPIView, CurrentUserView, LoginView, RegisterView, MedicineCreateAPIView, MedicineUpdateAPIView, MedicineDeleteAPIView, MedicineSearchAPIView, MedicineListAPIView, MedicineDetailAPIView, ScheduleListCreateAPIView, ScheduleDetailAPIView, PatientAppointmentListCreateAPIView, PatientAppointmentDetailAPIView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    path('current-user/', CurrentUserView.as_view(), name='current-user'),  # Endpoint để lấy thông tin người dùng hiện tại

    path('medicines/', MedicineListAPIView.as_view(), name='medicine-list'),
    path('medicines/<int:pk>/', MedicineDetailAPIView.as_view(), name='medicine-detail'),
    path('medicines/create/', MedicineCreateAPIView.as_view(), name='medicine-create'),
    path('medicines/<int:pk>/update/', MedicineUpdateAPIView.as_view(), name='medicine-update'),
    path('medicines/<int:pk>/delete/', MedicineDeleteAPIView.as_view(), name='medicine-delete'),
    path('medicines/search/', MedicineSearchAPIView.as_view(), name='medicine-search'),

    path('schedules/', ScheduleListCreateAPIView.as_view(), name='schedule-list-create'),
    path('schedules/<int:pk>/', ScheduleDetailAPIView.as_view(), name='schedule-detail'),

    path('appointments/', PatientAppointmentListCreateAPIView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', PatientAppointmentDetailAPIView.as_view(), name='appointment-detail'),
    path('user-appointments/', UserAppointmentListAPIView.as_view(), name='user-appointments'),

    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),

    path('prescriptions/create/', PrescriptionCreateAPIView.as_view(), name='prescription-create'),
    path('prescriptions/', PrescriptionListAPIView.as_view(), name='prescription-list'),

]

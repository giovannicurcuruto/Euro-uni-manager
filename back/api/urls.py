from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    
    # Universities
    path('universities/', views.university_list, name='university-list'),
    path('universities/<int:pk>/', views.university_detail, name='university-detail'),
    
    # Courses
    path('courses/', views.course_list, name='course-list'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'),
    
    # Students
    path('students/', views.student_list, name='student-list'),
    path('students/<int:pk>/', views.student_detail, name='student-detail'),
]
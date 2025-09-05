from rest_framework import serializers
from .models import UniversityDjango, CourseDjango, StudentDjango, UnidadeDjango, FalhaDjango

class UniversitySerializer(serializers.ModelSerializer):
    courses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UniversityDjango
        fields = ['id', 'name', 'country', 'city', 'website', 'established_year', 'description', 'created_at', 'courses_count']
    
    def get_courses_count(self, obj):
        return obj.courses.count()

class CourseSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseDjango
        fields = ['id', 'name', 'code', 'duration_months', 'language', 'tuition_fee', 'description', 'university', 'university_name', 'created_at', 'students_count']
    
    def get_students_count(self, obj):
        return obj.students.count()

class StudentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    university_name = serializers.CharField(source='course.university.name', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentDjango
        fields = ['id', 'first_name', 'last_name', 'full_name', 'email', 'nationality', 'birth_date', 'enrollment_date', 'course', 'course_name', 'university_name']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class CourseDetailSerializer(CourseSerializer):
    students = StudentSerializer(many=True, read_only=True)
    
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['students']

class UniversityDetailSerializer(UniversitySerializer):
    courses = CourseSerializer(many=True, read_only=True)
    
    class Meta(UniversitySerializer.Meta):
        fields = UniversitySerializer.Meta.fields + ['courses']

class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadeDjango
        fields = ['id', 'nome_unidade', 'grupo_unidade', 'tecnico_unidade', 'id_unidade', 'observacoes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class FalhaSerializer(serializers.ModelSerializer):
    unidade_nome = serializers.CharField(source='unidade.nome_unidade', read_only=True)
    
    class Meta:
        model = FalhaDjango
        fields = ['id', 'unidade', 'unidade_nome', 'falha_ocorrida', 'data_falha', 'observacao', 'ativa', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
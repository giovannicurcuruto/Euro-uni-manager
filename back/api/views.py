from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .mock_data import (
    MOCK_UNIVERSITIES, MOCK_COURSES, MOCK_STUDENTS,
    get_university_by_id, get_course_by_id, get_student_by_id,
    get_courses_by_university, get_students_by_course
)

@api_view(['GET'])
def university_list(request):
    """Lista todas as universidades"""
    # Adiciona contagem de cursos para cada universidade
    universities_with_counts = []
    for uni in MOCK_UNIVERSITIES:
        uni_copy = uni.copy()
        uni_copy['courses_count'] = len(get_courses_by_university(uni['id']))
        universities_with_counts.append(uni_copy)
    
    return Response(universities_with_counts)

@api_view(['GET'])
def university_detail(request, pk):
    """Detalhes de uma universidade específica"""
    university = get_university_by_id(pk)
    if not university:
        return Response({'error': 'Universidade não encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    # Adiciona cursos da universidade
    university_copy = university.copy()
    courses = get_courses_by_university(pk)
    university_copy['courses'] = courses
    university_copy['courses_count'] = len(courses)
    
    return Response(university_copy)

@api_view(['GET'])
def course_list(request):
    """Lista todos os cursos"""
    # Adiciona informações da universidade e contagem de estudantes
    courses_with_details = []
    for course in MOCK_COURSES:
        course_copy = course.copy()
        university = get_university_by_id(course['university_id'])
        course_copy['university_name'] = university['name'] if university else 'N/A'
        course_copy['students_count'] = len(get_students_by_course(course['id']))
        courses_with_details.append(course_copy)
    
    return Response(courses_with_details)

@api_view(['GET'])
def course_detail(request, pk):
    """Detalhes de um curso específico"""
    course = get_course_by_id(pk)
    if not course:
        return Response({'error': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    # Adiciona informações da universidade e estudantes
    course_copy = course.copy()
    university = get_university_by_id(course['university_id'])
    course_copy['university_name'] = university['name'] if university else 'N/A'
    
    students = get_students_by_course(pk)
    course_copy['students'] = students
    course_copy['students_count'] = len(students)
    
    return Response(course_copy)

@api_view(['GET'])
def student_list(request):
    """Lista todos os estudantes"""
    # Adiciona informações do curso e universidade
    students_with_details = []
    for student in MOCK_STUDENTS:
        student_copy = student.copy()
        course = get_course_by_id(student['course_id'])
        if course:
            student_copy['course_name'] = course['name']
            university = get_university_by_id(course['university_id'])
            student_copy['university_name'] = university['name'] if university else 'N/A'
        else:
            student_copy['course_name'] = 'N/A'
            student_copy['university_name'] = 'N/A'
        
        student_copy['full_name'] = f"{student['first_name']} {student['last_name']}"
        students_with_details.append(student_copy)
    
    return Response(students_with_details)

@api_view(['GET'])
def student_detail(request, pk):
    """Detalhes de um estudante específico"""
    student = get_student_by_id(pk)
    if not student:
        return Response({'error': 'Estudante não encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    # Adiciona informações do curso e universidade
    student_copy = student.copy()
    course = get_course_by_id(student['course_id'])
    if course:
        student_copy['course_name'] = course['name']
        university = get_university_by_id(course['university_id'])
        student_copy['university_name'] = university['name'] if university else 'N/A'
    else:
        student_copy['course_name'] = 'N/A'
        student_copy['university_name'] = 'N/A'
    
    student_copy['full_name'] = f"{student['first_name']} {student['last_name']}"
    
    return Response(student_copy)

@api_view(['GET'])
def dashboard_stats(request):
    """Estatísticas gerais do dashboard"""
    stats = {
        'total_universities': len(MOCK_UNIVERSITIES),
        'total_courses': len(MOCK_COURSES),
        'total_students': len(MOCK_STUDENTS),
        'countries': list(set(uni['country'] for uni in MOCK_UNIVERSITIES)),
        'languages': list(set(course['language'] for course in MOCK_COURSES if course['language'])),
    }
    
    return Response(stats)

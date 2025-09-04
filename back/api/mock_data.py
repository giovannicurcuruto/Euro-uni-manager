from datetime import datetime, date

# Dados mocados para Universidades
MOCK_UNIVERSITIES = [
    {
        'id': 1,
        'name': 'Universidade de Oxford',
        'country': 'Reino Unido',
        'city': 'Oxford',
        'website': 'https://www.ox.ac.uk',
        'established_year': 1096,
        'description': 'Uma das universidades mais antigas e prestigiosas do mundo, localizada em Oxford, Inglaterra.',
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 2,
        'name': 'Sorbonne Université',
        'country': 'França',
        'city': 'Paris',
        'website': 'https://www.sorbonne-universite.fr',
        'established_year': 1150,
        'description': 'Universidade francesa de renome mundial, localizada no coração de Paris.',
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 3,
        'name': 'Universität Heidelberg',
        'country': 'Alemanha',
        'city': 'Heidelberg',
        'website': 'https://www.uni-heidelberg.de',
        'established_year': 1386,
        'description': 'A universidade mais antiga da Alemanha, conhecida por sua excelência em pesquisa.',
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 4,
        'name': 'Università Bocconi',
        'country': 'Itália',
        'city': 'Milão',
        'website': 'https://www.unibocconi.eu',
        'established_year': 1902,
        'description': 'Universidade italiana líder em economia, gestão e direito.',
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 5,
        'name': 'Universidad Complutense Madrid',
        'country': 'Espanha',
        'city': 'Madrid',
        'website': 'https://www.ucm.es',
        'established_year': 1499,
        'description': 'Uma das universidades mais antigas da Espanha, localizada na capital.',
        'created_at': datetime(2024, 1, 1)
    }
]

# Dados mocados para Cursos
MOCK_COURSES = [
    {
        'id': 1,
        'name': 'Mestrado em Ciência da Computação',
        'code': 'CS-MSC-001',
        'duration_months': 24,
        'language': 'Inglês',
        'tuition_fee': 15000,
        'description': 'Programa avançado em ciência da computação com foco em IA e machine learning.',
        'university_id': 1,
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 2,
        'name': 'Bacharelado em Filosofia',
        'code': 'PHIL-BA-001',
        'duration_months': 36,
        'language': 'Inglês',
        'tuition_fee': 12000,
        'description': 'Curso de graduação em filosofia com tradição centenária.',
        'university_id': 1,
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 3,
        'name': 'Mestrado em Literatura Francesa',
        'code': 'LIT-MSC-001',
        'duration_months': 24,
        'language': 'Francês',
        'tuition_fee': 8000,
        'description': 'Programa de mestrado focado na literatura francesa clássica e contemporânea.',
        'university_id': 2,
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 4,
        'name': 'Doutorado em Física',
        'code': 'PHYS-PHD-001',
        'duration_months': 48,
        'language': 'Alemão',
        'tuition_fee': 0,
        'description': 'Programa de doutorado em física teórica e experimental.',
        'university_id': 3,
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 5,
        'name': 'MBA em Gestão Internacional',
        'code': 'MBA-INT-001',
        'duration_months': 18,
        'language': 'Inglês',
        'tuition_fee': 45000,
        'description': 'MBA focado em gestão internacional e estratégia empresarial.',
        'university_id': 4,
        'created_at': datetime(2024, 1, 1)
    },
    {
        'id': 6,
        'name': 'Bacharelado em História',
        'code': 'HIST-BA-001',
        'duration_months': 48,
        'language': 'Espanhol',
        'tuition_fee': 3000,
        'description': 'Curso de graduação em história com foco na história ibérica.',
        'university_id': 5,
        'created_at': datetime(2024, 1, 1)
    }
]

# Dados mocados para Estudantes
MOCK_STUDENTS = [
    {
        'id': 1,
        'first_name': 'Ana',
        'last_name': 'Silva',
        'email': 'ana.silva@email.com',
        'nationality': 'Portuguesa',
        'birth_date': date(1998, 5, 15),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 1
    },
    {
        'id': 2,
        'first_name': 'Marco',
        'last_name': 'Rossi',
        'email': 'marco.rossi@email.com',
        'nationality': 'Italiana',
        'birth_date': date(1997, 8, 22),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 1
    },
    {
        'id': 3,
        'first_name': 'Sophie',
        'last_name': 'Dubois',
        'email': 'sophie.dubois@email.com',
        'nationality': 'Francesa',
        'birth_date': date(1999, 3, 10),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 3
    },
    {
        'id': 4,
        'first_name': 'Hans',
        'last_name': 'Mueller',
        'email': 'hans.mueller@email.com',
        'nationality': 'Alemã',
        'birth_date': date(1995, 12, 5),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 4
    },
    {
        'id': 5,
        'first_name': 'Elena',
        'last_name': 'García',
        'email': 'elena.garcia@email.com',
        'nationality': 'Espanhola',
        'birth_date': date(2000, 7, 18),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 6
    },
    {
        'id': 6,
        'first_name': 'James',
        'last_name': 'Smith',
        'email': 'james.smith@email.com',
        'nationality': 'Britânica',
        'birth_date': date(1996, 11, 30),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 2
    },
    {
        'id': 7,
        'first_name': 'Giulia',
        'last_name': 'Bianchi',
        'email': 'giulia.bianchi@email.com',
        'nationality': 'Italiana',
        'birth_date': date(1994, 4, 25),
        'enrollment_date': datetime(2024, 9, 1),
        'course_id': 5
    }
]

def get_university_by_id(university_id):
    """Retorna uma universidade pelo ID"""
    return next((uni for uni in MOCK_UNIVERSITIES if uni['id'] == university_id), None)

def get_course_by_id(course_id):
    """Retorna um curso pelo ID"""
    return next((course for course in MOCK_COURSES if course['id'] == course_id), None)

def get_student_by_id(student_id):
    """Retorna um estudante pelo ID"""
    return next((student for student in MOCK_STUDENTS if student['id'] == student_id), None)

def get_courses_by_university(university_id):
    """Retorna todos os cursos de uma universidade"""
    return [course for course in MOCK_COURSES if course['university_id'] == university_id]

def get_students_by_course(course_id):
    """Retorna todos os estudantes de um curso"""
    return [student for student in MOCK_STUDENTS if student['course_id'] == course_id]
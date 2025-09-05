from django.db import models
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# SQLAlchemy Base
Base = declarative_base()

# SQLAlchemy Models
class University(Base):
    __tablename__ = 'universities'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    website = Column(String(255))
    established_year = Column(Integer)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    courses = relationship("Course", back_populates="university")

class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    code = Column(String(20), nullable=False)
    duration_months = Column(Integer)
    language = Column(String(50))
    tuition_fee = Column(Integer)  # Em euros
    description = Column(Text)
    university_id = Column(Integer, ForeignKey('universities.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    university = relationship("University", back_populates="courses")
    students = relationship("Student", back_populates="course")

class Student(Base):
    __tablename__ = 'students'
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    nationality = Column(String(100))
    birth_date = Column(DateTime)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    course_id = Column(Integer, ForeignKey('courses.id'))
    
    # Relationship
    course = relationship("Course", back_populates="students")

# Django Models (para compatibilidade)
class UniversityDjango(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    established_year = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "University"
        verbose_name_plural = "Universities"
    
    def __str__(self):
        return self.name

class CourseDjango(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20)
    duration_months = models.IntegerField(null=True, blank=True)
    language = models.CharField(max_length=50, blank=True)
    tuition_fee = models.IntegerField(null=True, blank=True)  # Em euros
    description = models.TextField(blank=True)
    university = models.ForeignKey(UniversityDjango, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class StudentDjango(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    nationality = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(CourseDjango, on_delete=models.CASCADE, related_name='students')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class UnidadeDjango(models.Model):
    nome_unidade = models.CharField(max_length=200, verbose_name="Nome da Unidade")
    grupo_unidade = models.CharField(max_length=100, verbose_name="Grupo")
    tecnico_unidade = models.CharField(max_length=200, blank=True, verbose_name="Técnico da Unidade")
    id_unidade = models.CharField(max_length=50, unique=True, verbose_name="ID da Unidade")
    observacoes = models.TextField(blank=True, verbose_name="Observações")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Unidade"
        verbose_name_plural = "Unidades"
        ordering = ['nome_unidade']

    def __str__(self):
        return f"{self.nome_unidade} ({self.id_unidade})"

class FalhaDjango(models.Model):
    unidade = models.ForeignKey(UnidadeDjango, on_delete=models.CASCADE, related_name='falhas', verbose_name="Unidade")
    falha_ocorrida = models.CharField(max_length=500, verbose_name="Falha Ocorrida")
    data_falha = models.DateField(verbose_name="Data da Falha")
    observacao = models.TextField(blank=True, verbose_name="Observação")
    ativa = models.BooleanField(default=True, verbose_name="Ativa")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Falha"
        verbose_name_plural = "Falhas"
        ordering = ['-data_falha', '-created_at']

    def __str__(self):
        return f"{self.unidade.nome_unidade} - {self.falha_ocorrida}"

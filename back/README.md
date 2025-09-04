# Euro University Manager - Backend

Backend da aplicação Euro University Manager desenvolvido com Django e SQLAlchemy.

## Características

- **Framework**: Django 5.2.6
- **ORM**: SQLAlchemy 2.0.43
- **API**: Django REST Framework
- **CORS**: Configurado para desenvolvimento
- **Dados**: Sistema de dados mocados (sem banco de dados)

## Estrutura do Projeto

```
back/
├── eurounimanager/          # Configurações principais do Django
│   ├── settings.py          # Configurações do projeto
│   ├── urls.py             # URLs principais
│   └── ...
├── api/                     # Aplicação da API
│   ├── models.py           # Modelos SQLAlchemy e Django
│   ├── views.py            # Views da API
│   ├── urls.py             # URLs da API
│   ├── serializers.py      # Serializers do DRF
│   └── mock_data.py        # Dados mocados
├── venv/                   # Ambiente virtual
├── manage.py               # Script de gerenciamento Django
└── requirements.txt        # Dependências
```

## Instalação e Execução

### 1. Ativar o ambiente virtual
```bash
# Windows
.\venv\bin\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

### 3. Executar migrações
```bash
python manage.py migrate
```

### 4. Iniciar o servidor
```bash
python manage.py runserver
```

O servidor estará disponível em: http://127.0.0.1:8000/

## Endpoints da API

### Dashboard
- `GET /api/dashboard/stats/` - Estatísticas gerais

### Universidades
- `GET /api/universities/` - Lista todas as universidades
- `GET /api/universities/{id}/` - Detalhes de uma universidade

### Cursos
- `GET /api/courses/` - Lista todos os cursos
- `GET /api/courses/{id}/` - Detalhes de um curso

### Estudantes
- `GET /api/students/` - Lista todos os estudantes
- `GET /api/students/{id}/` - Detalhes de um estudante

## Dados Mocados

O sistema utiliza dados mocados definidos em `api/mock_data.py` que incluem:

- **5 Universidades** europeias (Oxford, Sorbonne, Heidelberg, Bocconi, Complutense)
- **6 Cursos** diversos (Ciência da Computação, Filosofia, Literatura, Física, MBA, História)
- **7 Estudantes** de diferentes nacionalidades

## Configurações

### CORS
Configurado para aceitar requisições de:
- http://localhost:3000
- http://localhost:5173
- http://127.0.0.1:3000
- http://127.0.0.1:5173

### Django REST Framework
- Permissões: AllowAny (para desenvolvimento)
- Renderização: JSON apenas
- Parser: JSON apenas

## Desenvolvimento

Para adicionar novos dados mocados, edite o arquivo `api/mock_data.py`.
Para adicionar novos endpoints, crie views em `api/views.py` e adicione as URLs em `api/urls.py`.
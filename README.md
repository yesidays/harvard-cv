# Harvard CV Generator

Aplicación web minimalista para generar currículums profesionales en formato Harvard con exportación a PDF y DOCX.

## Características

- **Diseño minimalista**: Interfaz clara y sin distracciones
- **Formato Harvard**: CV profesional siguiendo estándares de Harvard Business School
- **Multiidioma**: Soporte completo para Español e Inglés
- **Exportación múltiple**: Genera PDF y DOCX con formato perfecto
- **Gestión completa**: Perfil, educación, experiencia, certificaciones, proyectos y habilidades
- **Vista previa en tiempo real**: Visualiza tu CV antes de exportar
- **Autenticación segura**: JWT con contraseñas hasheadas usando bcrypt
- **Responsive**: Optimizado para desktop y móvil

## Stack Tecnológico

### Backend
- **FastAPI**: Framework web moderno y rápido
- **PostgreSQL**: Base de datos relacional
- **SQLAlchemy**: ORM para Python
- **Alembic**: Migraciones de base de datos
- **WeasyPrint**: Generación de PDF
- **python-docx**: Generación de DOCX
- **JWT**: Autenticación con tokens

### Frontend
- **React 18**: Biblioteca de UI
- **Vite**: Build tool ultra-rápido
- **React Router**: Enrutamiento SPA
- **i18next**: Internacionalización
- **Axios**: Cliente HTTP

## Estructura del Proyecto

```
harvard-cv/
├── backend/
│   ├── app/
│   │   ├── api/           # Endpoints REST
│   │   ├── core/          # Configuración y seguridad
│   │   ├── models/        # Modelos SQLAlchemy
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── services/      # Lógica de negocio
│   │   └── templates/     # Plantillas HTML para CV
│   ├── alembic/           # Migraciones
│   ├── main.py            # Punto de entrada FastAPI
│   ├── requirements.txt   # Dependencias Python
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # API client
│   │   ├── contexts/      # React contexts
│   │   └── i18n/          # Traducciones
│   ├── package.json       # Dependencias Node
│   └── Dockerfile
├── docker-compose.yml     # Orquestación de servicios
└── README.md
```

## Instalación y Uso

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio
git clone <repository-url>
cd harvard-cv

# Iniciar todos los servicios
docker-compose up -d

# La aplicación estará disponible en:
# - Frontend: http://localhost
# - Backend API: http://localhost:8000
# - Documentación API: http://localhost:8000/docs
```

### Opción 2: Desarrollo Local

#### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Crear base de datos PostgreSQL
createdb harvard_cv

# Ejecutar migraciones
alembic upgrade head

# Sembrar datos de ejemplo (opcional)
python seed_data.py

# Iniciar servidor
uvicorn main:app --reload

# API disponible en http://localhost:8000
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API

# Iniciar servidor de desarrollo
npm run dev

# Aplicación disponible en http://localhost:5173
```

## Configuración

### Variables de Entorno Backend

```env
DATABASE_URL=postgresql://cvuser:cvpassword@localhost:5432/harvard_cv
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=10080
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

### Variables de Entorno Frontend

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## API Endpoints

### Autenticación
- `POST /api/v1/auth/signup` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión

### Perfil
- `GET /api/v1/profile` - Obtener perfil
- `POST /api/v1/profile` - Crear perfil
- `PUT /api/v1/profile` - Actualizar perfil
- `DELETE /api/v1/profile` - Eliminar perfil

### Educación
- `GET /api/v1/education` - Listar educación
- `POST /api/v1/education` - Crear entrada
- `PUT /api/v1/education/{id}` - Actualizar entrada
- `DELETE /api/v1/education/{id}` - Eliminar entrada

### Experiencia
- `GET /api/v1/experience` - Listar experiencia
- `POST /api/v1/experience` - Crear entrada
- `PUT /api/v1/experience/{id}` - Actualizar entrada
- `DELETE /api/v1/experience/{id}` - Eliminar entrada

### Certificaciones
- `GET /api/v1/certifications` - Listar certificaciones
- `POST /api/v1/certifications` - Crear entrada
- `PUT /api/v1/certifications/{id}` - Actualizar entrada
- `DELETE /api/v1/certifications/{id}` - Eliminar entrada

### Proyectos
- `GET /api/v1/projects` - Listar proyectos
- `POST /api/v1/projects` - Crear entrada
- `PUT /api/v1/projects/{id}` - Actualizar entrada
- `DELETE /api/v1/projects/{id}` - Eliminar entrada

### Skills
- `GET /api/v1/skills` - Obtener habilidades
- `POST /api/v1/skills` - Crear habilidades
- `PUT /api/v1/skills` - Actualizar habilidades
- `DELETE /api/v1/skills` - Eliminar habilidades

### Exportación CV
- `GET /api/v1/cv/preview` - Vista previa HTML
- `GET /api/v1/cv/export/pdf` - Exportar PDF
- `GET /api/v1/cv/export/docx` - Exportar DOCX

## Datos de Ejemplo

El proyecto incluye un script de seed con un usuario de ejemplo:

```
Email: demo@example.com
Password: demo123
```

Este usuario tiene un CV completo con datos de ejemplo que puedes usar para probar la aplicación.

## Formato Harvard - Especificaciones

El CV generado sigue las especificaciones del formato Harvard:

- **Cabecera**: Nombre en negrita, información de contacto
- **Educación**: Primero, en orden cronológico inverso
- **Experiencia**: Bullets orientados a impacto con métricas
- **Proyectos**: Descripción de impacto y tecnologías
- **Certificaciones**: Con emisor, fecha y credenciales
- **Habilidades**: Categorizadas por tipo

**Tipografía**:
- Títulos: Georgia (serif)
- Cuerpo: Helvetica/Arial (sans-serif)
- Márgenes: 1.9cm
- Interlineado: 1.0-1.15

## Testing

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## Deployment

### Producción con Docker

```bash
# Construir imágenes
docker-compose build

# Iniciar en producción
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Variables de Entorno de Producción

Asegúrate de cambiar:
- `SECRET_KEY`: Usa un valor seguro generado aleatoriamente
- `DATABASE_URL`: URL de tu base de datos PostgreSQL
- `BACKEND_CORS_ORIGINS`: Dominios permitidos

## Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación stateless
- HTTPS obligatorio en producción
- CORS configurado
- Validación de datos con Pydantic
- Protección contra inyección SQL (SQLAlchemy)

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT

## Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

## Autor

Desarrollado con el objetivo de simplificar la creación de CVs profesionales en formato Harvard.

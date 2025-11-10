"""Seed database with example data."""
import sys
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import User, Profile, Education, Experience, Certification, Project, Skills


def seed_database():
    """Create example user with complete CV data."""
    db = SessionLocal()

    try:
        # Check if example user already exists
        existing_user = db.query(User).filter(User.email == "demo@example.com").first()
        if existing_user:
            print("Example user already exists. Skipping seed.")
            return

        # Create example user
        user = User(
            email="demo@example.com",
            hashed_password=get_password_hash("demo123"),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create profile
        profile = Profile(
            user_id=user.id,
            first_name="María",
            last_name="González",
            email="maria.gonzalez@email.com",
            phone="+1 555-0123",
            location="Madrid, España",
            linkedin="linkedin.com/in/mariagonzalez",
            summary="Ingeniera de Software con 5+ años de experiencia en desarrollo full-stack y arquitectura de sistemas escalables. Especializada en Python, React y cloud computing con AWS. Lideré equipos de 8 personas y proyectos que incrementaron la eficiencia operativa en 40%.",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        # Education
        education_entries = [
            Education(
                profile_id=profile.id,
                degree="Master en Ciencias de la Computación",
                institution="Universidad Politécnica de Madrid",
                location="Madrid, España",
                start_date="2015-09",
                end_date="2017-06",
                details=[
                    "Especialización en Inteligencia Artificial y Machine Learning",
                    "Tesis: Optimización de algoritmos de aprendizaje profundo",
                    "GPA: 9.2/10",
                ],
            ),
            Education(
                profile_id=profile.id,
                degree="Grado en Ingeniería Informática",
                institution="Universidad Complutense de Madrid",
                location="Madrid, España",
                start_date="2011-09",
                end_date="2015-06",
                details=[
                    "Matrícula de Honor en Estructuras de Datos y Algoritmos",
                    "Presidente del Club de Programación Competitiva",
                ],
            ),
        ]
        for edu in education_entries:
            db.add(edu)

        # Experience
        experience_entries = [
            Experience(
                profile_id=profile.id,
                company="TechCorp International",
                role="Senior Software Engineer",
                location="Madrid, España",
                start_date="2020-03",
                end_date=None,
                bullets=[
                    "Lideré equipo de 8 ingenieros en migración de arquitectura monolítica a microservicios, reduciendo tiempos de respuesta en 60%",
                    "Implementé pipeline CI/CD con GitHub Actions y AWS CodePipeline, disminuyendo tiempo de deployment de 2 horas a 15 minutos",
                    "Diseñé y desarrollé API REST con FastAPI procesando 10M+ requests diarios con 99.9% uptime",
                    "Reduje costos de infraestructura AWS en 35% mediante optimización de recursos y auto-scaling inteligente",
                    "Mentoricé a 5 desarrolladores junior, logrando promoción de 3 a nivel mid en 12 meses",
                ],
            ),
            Experience(
                profile_id=profile.id,
                company="StartupXYZ",
                role="Full Stack Developer",
                location="Barcelona, España",
                start_date="2017-07",
                end_date="2020-02",
                bullets=[
                    "Desarrollé plataforma SaaS desde cero con React y Node.js, alcanzando 5,000 usuarios activos en primer año",
                    "Implementé sistema de autenticación OAuth2 y JWT, garantizando seguridad para datos de 10,000+ usuarios",
                    "Optimicé queries de PostgreSQL reduciendo tiempo de carga de dashboards de 8s a 1.2s",
                    "Creé suite de tests automatizados con Jest y Cypress, aumentando cobertura de código a 85%",
                ],
            ),
        ]
        for exp in experience_entries:
            db.add(exp)

        # Certifications
        certifications = [
            Certification(
                profile_id=profile.id,
                name="AWS Certified Solutions Architect - Professional",
                issuer="Amazon Web Services",
                date="2022-08",
                credential_id="AWS-SAP-2022-12345",
                url="https://aws.amazon.com/certification/",
            ),
            Certification(
                profile_id=profile.id,
                name="Professional Scrum Master I (PSM I)",
                issuer="Scrum.org",
                date="2021-03",
                credential_id="PSM-2021-67890",
                url="https://www.scrum.org/",
            ),
        ]
        for cert in certifications:
            db.add(cert)

        # Projects
        projects = [
            Project(
                profile_id=profile.id,
                name="Sistema de Recomendación de Contenido",
                impact="Implementé algoritmo de ML que incrementó engagement de usuarios en 45% y tiempo de sesión promedio de 8 a 15 minutos",
                technologies=["Python", "TensorFlow", "Redis", "PostgreSQL", "FastAPI"],
                url="https://github.com/example/recommendation-system",
            ),
            Project(
                profile_id=profile.id,
                name="Plataforma de Análisis de Datos en Tiempo Real",
                impact="Diseñé arquitectura de streaming con Apache Kafka procesando 100K eventos/segundo para dashboard ejecutivo con métricas de negocio",
                technologies=["Apache Kafka", "Spark", "Python", "React", "Docker"],
                url=None,
            ),
        ]
        for proj in projects:
            db.add(proj)

        # Skills
        skills = Skills(
            profile_id=profile.id,
            languages=["Python", "JavaScript", "TypeScript", "SQL", "Java"],
            tools=[
                "React",
                "FastAPI",
                "Docker",
                "Kubernetes",
                "PostgreSQL",
                "MongoDB",
                "Redis",
                "AWS",
                "Git",
            ],
            methods=["Agile", "Scrum", "TDD", "CI/CD", "Microservices", "RESTful APIs"],
        )
        db.add(skills)

        db.commit()
        print("✓ Database seeded successfully with example user:")
        print(f"  Email: demo@example.com")
        print(f"  Password: demo123")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

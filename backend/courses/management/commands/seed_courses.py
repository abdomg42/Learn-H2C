from django.core.management.base import BaseCommand
from django.utils.text import slugify
from courses.models import Category, Course, CourseSection, Lesson
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Crée des données de démonstration pour les cours'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Création des données de démonstration...'))
        
        # Création des utilisateurs si nécessaire
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('adminpassword')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Utilisateur admin créé'))
        
        # Création des catégories
        categories = [
            {'name': 'Développement Web', 'color': '#4CAF50', 'icon': 'code'},
            {'name': 'Data Science', 'color': '#2196F3', 'icon': 'database'},
            {'name': 'Business', 'color': '#FFC107', 'icon': 'briefcase'},
            {'name': 'Design', 'color': '#9C27B0', 'icon': 'pen-tool'},
            {'name': 'Ingénierie Logicielle', 'color': '#FF5722', 'icon': 'settings'},
        ]
        
        created_categories = []
        for cat_data in categories:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'color': cat_data['color'],
                    'icon': cat_data['icon'],
                    'slug': slugify(cat_data['name'])
                }
            )
            created_categories.append(cat)
            status = 'créée' if created else 'existait déjà'
            self.stdout.write(self.style.SUCCESS(f'Catégorie "{cat.name}" {status}'))
        
        # Création des cours
        courses_data = [
            {
                'title': 'Introduction à Python',
                'subtitle': 'Maîtrisez les bases du langage Python',
                'description': 'Apprenez Python, l\'un des langages de programmation les plus populaires et polyvalents. Ce cours vous guidera à travers les concepts fondamentaux du langage Python.',
                'category': created_categories[1],  # Data Science
                'level': 'beginner',
                'language': 'french',
                'price': 0,  # Gratuit
                'objectives': 'Comprendre les bases de Python\nÉcrire des programmes simples\nManipuler des données\nUtiliser les bibliothèques standards',
                'prerequisites': 'Aucune expérience en programmation n\'est requise',
                'target_audience': 'Débutants en programmation\nÉtudiants\nProfessionnels souhaitant acquérir de nouvelles compétences',
                'featured': True,
                'status': 'published',
                'created_by': admin_user,
                'sections': [
                    {
                        'title': 'Introduction',
                        'description': 'Les bases de Python',
                        'order': 1,
                        'lessons': [
                            {
                                'title': 'Qu\'est-ce que Python?',
                                'description': 'Introduction à Python et à son écosystème',
                                'content': '<h2>Python: un langage populaire et puissant</h2><p>Python est un langage de programmation interprété, orienté objet et de haut niveau avec une syntaxe simple et lisible. Créé par Guido van Rossum et publié pour la première fois en 1991, Python est devenu l\'un des langages de programmation les plus populaires au monde.</p><p>Dans cette leçon, nous allons découvrir pourquoi Python est si populaire et comment il peut être utilisé dans divers domaines.</p>',
                                'content_type': 'text',
                                'duration': '10 min',
                                'order': 1,
                            },
                            {
                                'title': 'Installation et configuration',
                                'description': 'Comment installer Python sur votre ordinateur',
                                'content': '<h2>Installation de Python</h2><p>Dans cette leçon, nous allons voir comment installer Python sur différents systèmes d\'exploitation et configurer un environnement de développement.</p><ol><li>Téléchargez Python depuis le site officiel</li><li>Installez-le en suivant les instructions</li><li>Vérifiez l\'installation avec la commande <code>python --version</code></li></ol>',
                                'content_type': 'text',
                                'duration': '15 min',
                                'order': 2,
                            }
                        ]
                    },
                    {
                        'title': 'Les bases',
                        'description': 'Syntaxe et structures de contrôle',
                        'order': 2,
                        'lessons': [
                            {
                                'title': 'Variables et types de données',
                                'description': 'Les différents types de données en Python',
                                'content': '<h2>Variables et types de données en Python</h2><p>Python possède plusieurs types de données intégrés:</p><ul><li>Entiers (<code>int</code>)</li><li>Nombres à virgule flottante (<code>float</code>)</li><li>Chaînes de caractères (<code>str</code>)</li><li>Booléens (<code>bool</code>)</li><li>Listes (<code>list</code>)</li><li>Tuples (<code>tuple</code>)</li><li>Dictionnaires (<code>dict</code>)</li></ul>',
                                'content_type': 'text',
                                'duration': '20 min',
                                'order': 1,
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'HTML & CSS pour Débutants',
                'subtitle': 'Créez vos premières pages web',
                'description': 'Apprenez à créer des sites web avec HTML et CSS. Ce cours couvre les fondamentaux du développement web front-end.',
                'category': created_categories[0],  # Développement Web
                'level': 'beginner',
                'language': 'french',
                'price': 0,  # Gratuit
                'objectives': 'Comprendre la structure HTML\nStyler des pages web avec CSS\nCréer des mises en page responsives\nUtiliser les outils de développement web modernes',
                'prerequisites': 'Aucune connaissance préalable requise',
                'target_audience': 'Débutants en développement web\nDesigners souhaitant apprendre à coder\nEntrepreneurs voulant créer leur site web',
                'featured': True,
                'status': 'published',
                'created_by': admin_user,
                'sections': [
                    {
                        'title': 'Les bases du HTML',
                        'description': 'Structure et éléments HTML',
                        'order': 1,
                        'lessons': [
                            {
                                'title': 'Introduction au HTML',
                                'description': 'Comprendre ce qu\'est le HTML et son rôle dans le web',
                                'content': '<h2>Qu\'est-ce que le HTML?</h2><p>HTML (HyperText Markup Language) est le langage de balisage standard utilisé pour créer des pages web. Il décrit la structure d\'une page web et se compose d\'une série d\'éléments qui indiquent au navigateur comment afficher le contenu.</p>',
                                'content_type': 'text',
                                'duration': '12 min',
                                'order': 1,
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Marketing Digital Avancé',
                'subtitle': 'Stratégies et tactiques pour le marketing en ligne',
                'description': 'Maîtrisez les techniques avancées du marketing digital pour améliorer votre présence en ligne et augmenter votre ROI.',
                'category': created_categories[2],  # Business
                'level': 'intermediate',
                'language': 'french',
                'price': 49.99,
                'objectives': 'Élaborer une stratégie marketing complète\nOptimiser vos campagnes publicitaires\nAnalyser les données pour prendre des décisions\nUtiliser efficacement les réseaux sociaux',
                'prerequisites': 'Connaissances de base en marketing\nFamiliarité avec les réseaux sociaux',
                'target_audience': 'Marketeurs\nPropriétaires de petites entreprises\nFreelances et consultants',
                'featured': False,
                'status': 'published',
                'created_by': admin_user,
                'sections': [
                    {
                        'title': 'Stratégie de contenu',
                        'description': 'Créer du contenu qui convertit',
                        'order': 1,
                        'lessons': [
                            {
                                'title': 'Principes du marketing de contenu',
                                'description': 'Les fondamentaux d\'une stratégie de contenu efficace',
                                'content': '<h2>Le marketing de contenu</h2><p>Le marketing de contenu est une approche stratégique axée sur la création et la distribution de contenu précieux, pertinent et cohérent pour attirer et fidéliser un public clairement défini - et, finalement, pour générer des actions client rentables.</p>',
                                'content_type': 'text',
                                'duration': '25 min',
                                'order': 1,
                            }
                        ]
                    }
                ]
            },
            # Nouveaux cours
            {
                'title': 'UML - Conception et Modélisation',
                'subtitle': 'Maîtrisez la modélisation UML pour concevoir des systèmes robustes',
                'description': 'Apprenez à créer des diagrammes de classes, séquence et à modéliser des systèmes complexes avec UML.',
                'category': created_categories[4],  # Ingénierie Logicielle
                'level': 'intermediate',
                'language': 'french',
                'price': 39.99,
                'objectives': 'Comprendre les principes de la modélisation UML\nCréer des diagrammes de classes efficaces\nModéliser des interactions avec les diagrammes de séquence\nUtiliser UML dans un processus de développement logiciel',
                'prerequisites': 'Connaissances de base en programmation orientée objet',
                'target_audience': 'Développeurs\nArchitectes logiciels\nChefs de projets techniques',
                'featured': True,
                'status': 'published',
                'created_by': admin_user,
                'sections': [
                    {
                        'title': 'Introduction à UML',
                        'description': 'Comprendre les fondamentaux d\'UML',
                        'order': 1,
                        'lessons': [
                            {
                                'title': 'Qu\'est-ce que UML?',
                                'description': 'Introduction à la modélisation UML et son importance',
                                'content': '<h2>UML - Le langage de modélisation unifié</h2><p>UML (Unified Modeling Language) est un langage visuel standardisé utilisé pour spécifier, visualiser, construire et documenter les artefacts d\'un système logiciel. Il permet de modéliser des systèmes complexes de manière visuelle et compréhensible.</p>',
                                'content_type': 'text',
                                'duration': '15 min',
                                'order': 1,
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Développement Front-End moderne avec React',
                'subtitle': 'Créez des interfaces utilisateur modernes et réactives',
                'description': 'Apprenez à construire des interfaces utilisateur modernes et réactives avec React, incluant les Hooks, le routage et les meilleures pratiques de développement.',
                'category': created_categories[0],  # Développement Web
                'level': 'beginner',
                'language': 'french',
                'price': 0,  # Gratuit
                'objectives': 'Maîtriser les fondamentaux de React\nUtiliser les Hooks pour la gestion d\'état\nCréer des applications monopage avec React Router\nOrganiser efficacement votre code React',
                'prerequisites': 'Connaissances en JavaScript ES6+\nBases en HTML et CSS',
                'target_audience': 'Développeurs web souhaitant apprendre React\nDéveloppeurs front-end cherchant à se perfectionner',
                'featured': True,
                'status': 'published',
                'created_by': admin_user,
                'sections': [
                    {
                        'title': 'Introduction à React',
                        'description': 'Les fondamentaux de React',
                        'order': 1,
                        'lessons': [
                            {
                                'title': 'Premiers pas avec React',
                                'description': 'Comprendre les concepts de base de React',
                                'content': '<h2>Qu\'est-ce que React?</h2><p>React est une bibliothèque JavaScript développée par Facebook pour créer des interfaces utilisateur. Elle se base sur le concept de composants réutilisables, permettant de construire des interfaces complexes à partir d\'éléments simples.</p>',
                                'content_type': 'text',
                                'duration': '20 min',
                                'order': 1,
                            }
                        ]
                    }
                ]
            },
            {
                'title': 'Développement Back-End avec Django',
                'subtitle': 'Créez des APIs robustes et des applications web serveur',
                'description': 'Apprenez à créer des APIs robustes et des applications web serveur avec Django, le framework Python puissant et flexible pour le développement web.',
                'category': created_categories[0],  # Développement Web
                'level': 'intermediate',
                'language': 'french',
                'price': 29.99,
                'objectives': 'Comprendre l\'architecture MVT de Django\nCréer des modèles de données efficaces\nDévelopper des APIs REST avec Django Rest Framework\nSécuriser vos applications Django',
                'prerequisites': 'Connaissances de base en Python\nNotions de bases de données',
                'target_audience': 'Développeurs Python\nDéveloppeurs web cherchant à apprendre le backend\nÉtudiants en informatique',
                'featured': False,
                'status': 'published',
                'created_by': admin_user,
                'sections': [
                    {
                        'title': 'Les fondamentaux de Django',
                        'description': 'Architecture et principes de base',
                        'order': 1,
                        'lessons': [
                            {
                                'title': 'Introduction à Django',
                                'description': 'Découvrir le framework Django et son écosystème',
                                'content': '<h2>Qu\'est-ce que Django?</h2><p>Django est un framework web Python de haut niveau qui encourage un développement rapide et propre. Construit par des développeurs expérimentés, Django prend en charge de nombreuses tâches communes liées au développement web, vous permettant de vous concentrer sur l\'écriture de votre application.</p>',
                                'content_type': 'text',
                                'duration': '30 min',
                                'order': 1,
                            }
                        ]
                    }
                ]
            }
        ]
        
        # Création des cours et de leur contenu
        for course_data in courses_data:
            sections_data = course_data.pop('sections')
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                defaults={
                    **course_data,
                    'slug': slugify(course_data['title'])
                }
            )
            
            status = 'créé' if created else 'existait déjà'
            self.stdout.write(self.style.SUCCESS(f'Cours "{course.title}" {status}'))
            
            if created:
                for section_data in sections_data:
                    lessons_data = section_data.pop('lessons')
                    section = CourseSection.objects.create(
                        course=course,
                        **section_data
                    )
                    
                    self.stdout.write(self.style.SUCCESS(f'  Section "{section.title}" créée'))
                    
                    for lesson_data in lessons_data:
                        lesson = Lesson.objects.create(
                            course=course,
                            section=section,
                            **lesson_data
                        )
                        self.stdout.write(self.style.SUCCESS(f'    Leçon "{lesson.title}" créée'))
        
        self.stdout.write(self.style.SUCCESS('Création des données de démonstration terminée !')) 
from django.core.management.base import BaseCommand
from django.db import transaction
from courses.models import Course, Lesson, Quiz, Question, Answer
import random

class Command(BaseCommand):
    help = 'Creates sample quizzes for existing courses'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Force recreation of quizzes even if they exist')

    def handle(self, *args, **options):
        force = options.get('force', False)
        
        # Get all lessons that could have a quiz
        eligible_lessons = Lesson.objects.filter(content_type__in=['text', 'video'])
        
        if not eligible_lessons.exists():
            self.stdout.write(self.style.ERROR('No eligible lessons found to create quizzes'))
            return
            
        self.stdout.write(f'Found {eligible_lessons.count()} eligible lessons')
        
        quiz_count = 0
        with transaction.atomic():
            for lesson in eligible_lessons:
                # Skip if quiz already exists and not forcing recreation
                if hasattr(lesson, 'quiz') and not force:
                    self.stdout.write(f'Quiz already exists for lesson: {lesson.title}')
                    continue
                    
                # Skip some lessons randomly
                if random.random() > 0.75:  # 75% chance of creating a quiz
                    continue
                
                # Delete existing quiz if forcing recreation
                if hasattr(lesson, 'quiz') and force:
                    lesson.quiz.delete()
                    self.stdout.write(f'Deleted existing quiz for lesson: {lesson.title}')
                
                # Create quiz
                quiz = self.create_quiz(lesson)
                quiz_count += 1
                
                self.stdout.write(self.style.SUCCESS(f'Created quiz for lesson: {lesson.title}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {quiz_count} quizzes'))
    
    def create_quiz(self, lesson):
        """Create a quiz with questions and answers for a lesson"""
        course_name = lesson.course.title.lower()
        lesson_name = lesson.title.lower()
        
        # Create the quiz
        quiz = Quiz.objects.create(
            lesson=lesson,
            title=f"Quiz: {lesson.title}",
            description=f"Test your knowledge from this lesson",
            pass_percentage=70
        )
        
        # Create different questions based on the course subject
        if 'python' in course_name:
            self.create_python_questions(quiz)
        elif 'html' in course_name or 'css' in course_name or 'web' in course_name:
            self.create_web_dev_questions(quiz)
        elif 'marketing' in course_name:
            self.create_marketing_questions(quiz)
        else:
            self.create_general_questions(quiz, lesson_name)
            
        return quiz
    
    def create_python_questions(self, quiz):
        # Question 1
        q1 = Question.objects.create(
            quiz=quiz,
            text="Quel type de langage est Python?",
            explanation="Python est un langage interprété à typage dynamique, ce qui signifie que les types sont vérifiés à l'exécution.",
            order=0
        )
        Answer.objects.create(question=q1, text="Compilé et typé statiquement", is_correct=False)
        Answer.objects.create(question=q1, text="Interprété et typé dynamiquement", is_correct=True)
        Answer.objects.create(question=q1, text="Assembleur de bas niveau", is_correct=False)
        Answer.objects.create(question=q1, text="Langage de balisage", is_correct=False)
        
        # Question 2
        q2 = Question.objects.create(
            quiz=quiz,
            text="Comment définit-on une fonction en Python?",
            explanation="En Python, les fonctions sont définies avec le mot-clé 'def' suivi du nom de la fonction et des paramètres entre parenthèses.",
            order=1
        )
        Answer.objects.create(question=q2, text="function maFonction():", is_correct=False)
        Answer.objects.create(question=q2, text="def maFonction():", is_correct=True)
        Answer.objects.create(question=q2, text="function def maFonction():", is_correct=False)
        Answer.objects.create(question=q2, text="func maFonction():", is_correct=False)
        
        # Question 3
        q3 = Question.objects.create(
            quiz=quiz,
            text="Quelle est la syntaxe correcte pour une liste en compréhension?",
            explanation="Les listes en compréhension permettent de créer des listes de manière concise en Python.",
            order=2
        )
        Answer.objects.create(question=q3, text="[x*x pour x dans range(10)]", is_correct=False)
        Answer.objects.create(question=q3, text="[x*x for x in range(10)]", is_correct=True)
        Answer.objects.create(question=q3, text="[for x in range(10) return x*x]", is_correct=False)
        Answer.objects.create(question=q3, text="array(x*x for x in range(10))", is_correct=False)
        
        # Question 4
        q4 = Question.objects.create(
            quiz=quiz,
            text="Quel est le résultat de l'expression: 3 * 'abc'",
            explanation="En Python, multiplier une chaîne par un entier répète la chaîne ce nombre de fois.",
            order=3
        )
        Answer.objects.create(question=q4, text="'abcabcabc'", is_correct=True)
        Answer.objects.create(question=q4, text="'abc3'", is_correct=False)
        Answer.objects.create(question=q4, text="Error", is_correct=False)
        Answer.objects.create(question=q4, text="9", is_correct=False)
    
    def create_web_dev_questions(self, quiz):
        # Question 1
        q1 = Question.objects.create(
            quiz=quiz,
            text="À quoi sert CSS?",
            explanation="CSS (Cascading Style Sheets) est utilisé pour définir le style et la mise en page des pages web.",
            order=0
        )
        Answer.objects.create(question=q1, text="À définir la structure du contenu", is_correct=False)
        Answer.objects.create(question=q1, text="À créer des bases de données", is_correct=False)
        Answer.objects.create(question=q1, text="À définir le style et la mise en page", is_correct=True)
        Answer.objects.create(question=q1, text="À gérer le comportement interactif", is_correct=False)
        
        # Question 2
        q2 = Question.objects.create(
            quiz=quiz,
            text="Quelle balise HTML est utilisée pour créer un lien hypertexte?",
            explanation="La balise <a> avec l'attribut href est utilisée pour créer des liens hypertextes en HTML.",
            order=1
        )
        Answer.objects.create(question=q2, text="<link>", is_correct=False)
        Answer.objects.create(question=q2, text="<a>", is_correct=True)
        Answer.objects.create(question=q2, text="<href>", is_correct=False)
        Answer.objects.create(question=q2, text="<hyperlink>", is_correct=False)
        
        # Question 3
        q3 = Question.objects.create(
            quiz=quiz,
            text="Quelle propriété CSS permet de changer la couleur du texte?",
            explanation="La propriété 'color' est utilisée pour définir la couleur du texte en CSS.",
            order=2
        )
        Answer.objects.create(question=q3, text="text-color", is_correct=False)
        Answer.objects.create(question=q3, text="font-color", is_correct=False)
        Answer.objects.create(question=q3, text="color", is_correct=True)
        Answer.objects.create(question=q3, text="text-style", is_correct=False)
        
        # Question 4
        q4 = Question.objects.create(
            quiz=quiz,
            text="Quelle est la manière correcte de centrer un élément horizontalement en CSS?",
            explanation="Pour centrer un élément de bloc horizontalement, on utilise 'margin: 0 auto' ou 'text-align: center' pour du texte.",
            order=3
        )
        Answer.objects.create(question=q4, text="align: center;", is_correct=False)
        Answer.objects.create(question=q4, text="margin: 0 auto;", is_correct=True)
        Answer.objects.create(question=q4, text="position: center;", is_correct=False)
        Answer.objects.create(question=q4, text="left: 50%;", is_correct=False)
    
    def create_marketing_questions(self, quiz):
        # Question 1
        q1 = Question.objects.create(
            quiz=quiz,
            text="Qu'est-ce que le SEO?",
            explanation="Le SEO (Search Engine Optimization) est l'ensemble des techniques visant à améliorer le positionnement d'un site web dans les résultats des moteurs de recherche.",
            order=0
        )
        Answer.objects.create(question=q1, text="Security Enhancement Operations", is_correct=False)
        Answer.objects.create(question=q1, text="Search Engine Optimization", is_correct=True)
        Answer.objects.create(question=q1, text="Social Engagement Opportunities", is_correct=False)
        Answer.objects.create(question=q1, text="Software Engineering Outsourcing", is_correct=False)
        
        # Question 2
        q2 = Question.objects.create(
            quiz=quiz,
            text="Quel est le but principal d'une campagne de marketing par e-mail?",
            explanation="Le marketing par e-mail vise à établir une communication directe avec les clients ou prospects pour promouvoir des produits, services ou contenus.",
            order=1
        )
        Answer.objects.create(question=q2, text="Augmenter le trafic sur les réseaux sociaux", is_correct=False)
        Answer.objects.create(question=q2, text="Générer des liens retour (backlinks)", is_correct=False)
        Answer.objects.create(question=q2, text="Communiquer directement avec les clients/prospects", is_correct=True)
        Answer.objects.create(question=q2, text="Améliorer le classement SEO", is_correct=False)
        
        # Question 3
        q3 = Question.objects.create(
            quiz=quiz,
            text="Qu'est-ce qu'un CTA dans le marketing numérique?",
            explanation="Un CTA (Call to Action) est un élément incitatif qui pousse l'utilisateur à effectuer une action spécifique, comme cliquer sur un bouton ou remplir un formulaire.",
            order=2
        )
        Answer.objects.create(question=q3, text="Content Transfer Agreement", is_correct=False)
        Answer.objects.create(question=q3, text="Call To Action", is_correct=True)
        Answer.objects.create(question=q3, text="Creative Text Analysis", is_correct=False)
        Answer.objects.create(question=q3, text="Customer Tracking Application", is_correct=False)
        
        # Question 4
        q4 = Question.objects.create(
            quiz=quiz,
            text="Quel outil est le plus utilisé pour analyser le trafic d'un site web?",
            explanation="Google Analytics est l'un des outils d'analyse les plus utilisés pour suivre et analyser le trafic d'un site web.",
            order=3
        )
        Answer.objects.create(question=q4, text="Google AdWords", is_correct=False)
        Answer.objects.create(question=q4, text="Facebook Pixel", is_correct=False)
        Answer.objects.create(question=q4, text="Google Analytics", is_correct=True)
        Answer.objects.create(question=q4, text="Hootsuite", is_correct=False)
    
    def create_general_questions(self, quiz, lesson_name):
        """Create general questions that can fit any course topic"""
        
        # Question 1
        q1 = Question.objects.create(
            quiz=quiz,
            text="Quel est l'objectif principal de cette leçon?",
            explanation="Comprendre le contenu principal de la leçon est essentiel pour progresser dans le cours.",
            order=0
        )
        Answer.objects.create(question=q1, text=f"Présenter les concepts de base de {lesson_name}", is_correct=True)
        Answer.objects.create(question=q1, text="Discuter de sujets avancés non liés au cours", is_correct=False)
        Answer.objects.create(question=q1, text="Divertir les étudiants sans but pédagogique", is_correct=False)
        Answer.objects.create(question=q1, text="Aucun objectif particulier", is_correct=False)
        
        # Question 2
        q2 = Question.objects.create(
            quiz=quiz,
            text="Quelle est la meilleure façon d'appliquer les connaissances de cette leçon?",
            explanation="L'application pratique des connaissances est essentielle pour renforcer l'apprentissage.",
            order=1
        )
        Answer.objects.create(question=q2, text="Ne jamais les appliquer", is_correct=False)
        Answer.objects.create(question=q2, text="Les mémoriser sans les comprendre", is_correct=False)
        Answer.objects.create(question=q2, text="Les mettre en pratique sur des projets concrets", is_correct=True)
        Answer.objects.create(question=q2, text="Les oublier immédiatement après l'examen", is_correct=False)
        
        # Question 3
        q3 = Question.objects.create(
            quiz=quiz,
            text="Comment cette leçon s'intègre-t-elle dans l'ensemble du cours?",
            explanation="Comprendre comment les différentes parties d'un cours s'intègrent ensemble aide à avoir une vision globale du sujet.",
            order=2
        )
        Answer.objects.create(question=q3, text="Elle est totalement indépendante des autres leçons", is_correct=False)
        Answer.objects.create(question=q3, text="Elle constitue une base pour les leçons suivantes", is_correct=True)
        Answer.objects.create(question=q3, text="Elle n'a aucun rapport avec le reste du cours", is_correct=False)
        Answer.objects.create(question=q3, text="Elle contredit les autres leçons du cours", is_correct=False) 
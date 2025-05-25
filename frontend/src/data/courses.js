export const courses = {
  'web-dev': {
    id: 'web-dev',
    title: "Complete Web Development Bootcamp",
    description: "Master modern web development with this comprehensive course covering HTML, CSS, JavaScript, and React",
    instructor: "John Doe",
    totalDuration: "12 hours",
    level: "Beginner",
    category: "Web Development",
    thumbnail: "/images/courses/web-dev.jpg",
    price: 49.99,
    rating: 4.8,
    enrolledStudents: 1250,
    lastUpdated: "2024-03-15",
    prerequisites: ["Basic computer knowledge"],
    whatYouWillLearn: [
      "Build responsive websites using HTML5 and CSS3",
      "Master JavaScript ES6+ features",
      "Create dynamic web applications with React",
      "Implement modern web development practices"
    ],
    sections: [
      {
        id: "html-css",
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of web development",
        videos: [
          {
            id: 1,
            title: "Introduction to HTML5",
            videoId: "UB1O30fR-EE",
            duration: "15:30",
            description: "Learn the fundamentals of HTML5, including semantic elements and modern markup practices",
            resources: [
              {
                type: "pdf",
                title: "HTML5 Cheat Sheet",
                url: "/resources/html-cheatsheet.pdf"
              }
            ]
          },
          {
            id: 2,
            title: "Advanced CSS Techniques",
            videoId: "1PnVor36_40",
            duration: "20:15",
            description: "Master CSS Grid, Flexbox, and modern layout techniques",
            resources: [
              {
                type: "pdf",
                title: "CSS Grid Guide",
                url: "/resources/css-grid-guide.pdf"
              }
            ]
          }
        ]
      },
      {
        id: "javascript",
        title: "JavaScript Programming",
        description: "Master JavaScript programming language",
        videos: [
          {
            id: 3,
            title: "JavaScript ES6+ Features",
            videoId: "W6NZfCO5SIk",
            duration: "25:45",
            description: "Explore modern JavaScript features including arrow functions, destructuring, and async/await",
            resources: [
              {
                type: "pdf",
                title: "ES6+ Features Guide",
                url: "/resources/es6-guide.pdf"
              }
            ]
          }
        ]
      },
      {
        id: "react",
        title: "React Development",
        description: "Build modern web applications with React",
        videos: [
          {
            id: 4,
            title: "React Hooks and Context",
            videoId: "w7ejDZ8SWv8",
            duration: "30:20",
            description: "Deep dive into React Hooks, Context API, and state management",
            resources: [
              {
                type: "pdf",
                title: "React Hooks Guide",
                url: "/resources/react-hooks-guide.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  'python': {
    id: 'python',
    title: "Python Programming Masterclass",
    description: "Learn Python programming from basics to advanced concepts including data science and machine learning",
    instructor: "Jane Smith",
    totalDuration: "15 hours",
    level: "Intermediate",
    category: "Programming",
    thumbnail: "/images/courses/python.jpg",
    price: 59.99,
    rating: 4.9,
    enrolledStudents: 980,
    lastUpdated: "2024-03-10",
    prerequisites: ["Basic programming concepts"],
    whatYouWillLearn: [
      "Master Python programming fundamentals",
      "Work with data structures and algorithms",
      "Build data science applications",
      "Create machine learning models"
    ],
    sections: [
      {
        id: "python-basics",
        title: "Python Fundamentals",
        description: "Learn Python programming basics",
        videos: [
          {
            id: 1,
            title: "Python Fundamentals",
            videoId: "YYXdXT2l-Gg",
            duration: "18:30",
            description: "Master Python basics, data types, and control structures",
            resources: [
              {
                type: "pdf",
                title: "Python Basics Guide",
                url: "/resources/python-basics.pdf"
              }
            ]
          }
        ]
      },
      {
        id: "data-science",
        title: "Data Science with Python",
        description: "Learn data science and analysis with Python",
        videos: [
          {
            id: 2,
            title: "Data Science with Python",
            videoId: "r-uOLxNrJk8",
            duration: "35:20",
            description: "Introduction to NumPy, Pandas, and data analysis",
            resources: [
              {
                type: "pdf",
                title: "Data Science Guide",
                url: "/resources/data-science-guide.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  'design': {
    id: 'design',
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design",
    instructor: "Mike Johnson",
    totalDuration: "10 hours",
    level: "Beginner",
    category: "Design",
    thumbnail: "/images/courses/design.jpg",
    price: 39.99,
    rating: 4.7,
    enrolledStudents: 750,
    lastUpdated: "2024-03-05",
    prerequisites: ["None"],
    whatYouWillLearn: [
      "Understand design principles and theory",
      "Create user-centered designs",
      "Master wireframing and prototyping",
      "Conduct user research and testing"
    ],
    sections: [
      {
        id: "design-principles",
        title: "Design Principles",
        description: "Learn fundamental design principles",
        videos: [
          {
            id: 1,
            title: "Design Principles",
            videoId: "ZK86XQ1iFVs",
            duration: "20:30",
            description: "Understanding color theory, typography, and layout principles",
            resources: [
              {
                type: "pdf",
                title: "Design Principles Guide",
                url: "/resources/design-principles.pdf"
              }
            ]
          }
        ]
      },
      {
        id: "user-research",
        title: "User Research",
        description: "Learn user research methodologies",
        videos: [
          {
            id: 2,
            title: "User Research",
            videoId: "7Vz0byxRbsQ",
            duration: "25:15",
            description: "Conducting user interviews and creating user personas",
            resources: [
              {
                type: "pdf",
                title: "User Research Guide",
                url: "/resources/user-research-guide.pdf"
              }
            ]
          }
        ]
      }
    ]
  }
};

export const getCourseById = (courseId) => {
  return courses[courseId] || null;
};

export const getAllCourses = () => {
  return Object.values(courses);
};

export const getCoursesByCategory = (category) => {
  return Object.values(courses).filter(course => course.category === category);
}; 
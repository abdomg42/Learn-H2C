# E-Learning Platform

A modern, full-stack e-learning platform built with React and Django, featuring a responsive design and internationalization support.

## 🚀 Features

- Modern, responsive user interface built with React and Tailwind CSS
- Internationalization support (i18n)
- Interactive course management
- User authentication and authorization
- Real-time notifications using React Hot Toast
- Beautiful animations with Framer Motion
- Data visualization with Recharts
- Cross-browser compatibility

## 🛠️ Tech Stack

### Frontend
- React 19
- Tailwind CSS
- React Router DOM
- Axios for API calls
- i18next for internationalization
- Framer Motion for animations
- React Hot Toast for notifications
- Recharts for data visualization

### Backend
- Django
- SQLite Database
- RESTful API architecture

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x
- pip (Python package manager)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the development server:
   ```bash
   python manage.py runserver
   ```

## 🔧 Development

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8000`

## 📝 Scripts

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from create-react-app

## 🌐 Internationalization

The platform supports multiple languages through i18next. To add new translations:
1. Navigate to the `src/locales` directory
2. Add new language files following the existing format

## 📚 Project Structure

```
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
└── backend/
    ├── courses/
    ├── users/
    ├── config/
    └── manage.py
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


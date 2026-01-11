Student Records Management System (SRMS)

NAME: EVANS KIRWA KIPKEMOI
ADM NO: 10017-30
INSTITUTION: KENYA INSTITUTE OF SOFTWARE ENGINEERING AND PROFESSIONAL STUDIES(KISE)

Project Description
A modern web application for managing student records with a React frontend and Node.js backend using MongoDB. This system provides an efficient way to handle student data with features like CRUD operations, search, analytics, and secure authentication.

Problem Statement
Traditional student record management often involves manual processes using paper-based systems or basic spreadsheets, leading to inefficiencies, data inconsistencies, and difficulties in retrieving information. There is a need for a digital solution that allows administrators to easily add, view, edit, delete, and search student records while providing analytics and maintaining data security.

Technologies Used
Frontend
- React 19
- React Router DOM
- CSS3 with modern styling

Backend
- Node.js
- Express.js
- MongoDB with Mongoose-like operations
- JWT for authentication
- bcrypt for password hashing

Features
- User Authentication: Secure login system with JWT tokens
- Student Management: Add, view, edit, and delete student records
- Search Functionality: Search students by name, email, or course
- Analytics Dashboard: View statistics including total students, average age, and course distribution
- Settings: Change admin password
- Modern UI: Clean, responsive design with gradient themes and smooth animations
- Real-time Updates: Instant updates after CRUD operations

How to Install and Run the System

Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

Installation Steps

1. Clone the repository
   git clone <repository-url>
   cd SRMS

2. Install backend dependencies
   cd Backend
   npm install

3. Install frontend dependencies
   cd ../frontend
   npm install

4. Start MongoDB
   Make sure MongoDB is running on mongodb://localhost:27017

5. Start the backend server
   cd Backend
   npm start

6. Start the frontend development server
   cd frontend
   npm start

Usage
1. Open your browser and navigate to http://localhost:3000
2. Login with default credentials (see below)
3. Use the Dashboard to manage student records
4. View Analytics for student statistics
5. Change password in Settings

Login Credentials for Testing
- Username: admin
- Password: admin123

API Endpoints

Authentication
- POST /api/login - User login

Students
- GET /api/students - Get all students (with optional search)
- POST /api/students - Add new student
- PUT /api/students/:id - Update student
- DELETE /api/students/:id - Delete student

Settings
- PUT /api/change-password - Change admin password

Project Structure

SRMS/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── setup.sql (legacy)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Analytics.js
│   │   │   ├── Settings.js
│   │   │   ├── StudentForm.js
│   │   │   └── StudentList.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md

Database Schema

Admin Collection
{
  "_id": ObjectId,
  "username": "admin",
  "password": "hashed_password"
}

Students Collection
{
  "_id": ObjectId,
  "name": "Student Name",
  "email": "student@example.com",
  "age": 20,
  "course": "Computer Science"
}

Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation
- CORS enabled
- Unique constraints on email and username

Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request


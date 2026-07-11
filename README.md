# InterviewAI

InterviewAI is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help candidates prepare for technical and behavioral interviews. It leverages AI to analyze your resume, generate personalized interview questions, and provide actionable feedback.

## Features

- **Authentication**: Secure JWT-based user registration and login.
- **Resume Analysis**: Upload your PDF resume to receive an ATS compatibility score, skill extraction, and improvement suggestions.
- **AI-Powered Mock Interviews**: Practice with dynamically generated interview questions tailored to your profile and target role, powered by IBM Granite AI.
- **Dashboard & Analytics**: Track your performance over time, view category scores, and monitor your interview history.
- **Responsive & Themed UI**: A modern, fully responsive user interface with built-in light and dark mode support.

## Tech Stack

### Frontend
- **React.js**: UI library.
- **React Router**: Client-side routing.
- **Tailwind CSS & SCSS**: Styling and layout.
- **Framer Motion**: Animations and transitions.

### Backend
- **Node.js & Express**: Server framework.
- **MongoDB & Mongoose**: Database and object modeling.
- **JSON Web Tokens (JWT)**: Authentication.
- **IBM Granite AI**: Core intelligence for question generation and analysis.
- **pdf-parse**: For extracting text from uploaded resume PDFs.

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your system. You will also need API credentials for IBM Granite AI.

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd resume-ai
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   Navigate to the backend directory and install its dependencies.
   ```bash
   cd backend
   npm install
   ```

4. **Environment Variables**:
   Create a `.env` file in the `backend` directory and add the necessary configurations:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   # Add any required API keys for IBM Granite AI
   ```

5. **Start the Application**:
   You can run both the frontend and backend servers.
   - For the frontend (from the root directory):
     ```bash
     npm start
     ```
   - For the backend (from the `backend` directory or via custom script):
     ```bash
     npm run server
     ```

## License
This project is for educational and portfolio purposes.

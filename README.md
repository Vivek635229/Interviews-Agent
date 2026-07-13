# 🚀 InterviewAI (Resume AI)

> A full-stack AI-powered platform for intelligent resume analysis and dynamic mock interviews.

![InterviewAI Hero Image](https://via.placeholder.com/1200x600?text=InterviewAI+Hero+Image)
*(Add a real hero screenshot of your application here)*

**InterviewAI** is a comprehensive MERN stack (MongoDB, Express, React, Node.js) application tailored to help job candidates prepare for technical and behavioral interviews. By leveraging the power of AI, it provides deep resume analysis, generates dynamic and personalized mock interview questions, and offers actionable feedback to help candidates succeed.

---

## ✨ Key Features

- **🔐 Secure Authentication**: Robust JWT-based user registration and login with encrypted passwords.
- **📄 Smart Resume Analysis**: Upload PDF resumes to get an instant ATS compatibility score, automated skill extraction, and personalized improvement suggestions.
- **🤖 AI-Powered Mock Interviews**: Dynamic interview sessions featuring customized questions tailored to the user's specific profile and target job role (Powered by IBM Granite AI or similar models).
- **📊 Comprehensive Dashboard & Analytics**: Visualize performance over time, view category-based scores, and seamlessly track interview history.
- **🎨 Modern, Responsive UI**: A fully responsive interface enhanced with sleek animations (Framer Motion & GSAP) and built-in Light/Dark mode toggling.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v19)** - Next-gen UI library
- **React Router (v7)** - Client-side routing
- **Tailwind CSS & SCSS** - Utility-first styling & advanced custom styling
- **Framer Motion & GSAP** - Premium animations and layout transitions
- **Axios** - HTTP client

### Backend
- **Node.js & Express.js** - Robust server-side framework
- **MongoDB & Mongoose** - NoSQL database and ORM
- **JSON Web Tokens (JWT)** - Secure, stateless authentication
- **IBM Granite AI** - Advanced AI model for analysis and question generation
- **pdf-parse & multer** - Robust file uploading and text extraction

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)
- API Credentials for your selected AI provider (e.g., IBM Granite)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-github-repo-url>
   cd resume-ai
   ```

2. **Install frontend/root dependencies**:
   This project uses a concurrent setup to run both client and server from the root directory. Install dependencies in the root:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Configuration

Create `.env` files for necessary configurations.

1. **Backend `.env`** (Create in the `backend` directory, refer to `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-very-secure-jwt-secret>
   # Add your AI API Keys here
   ```

### Running the Application

You can start both the frontend and backend servers concurrently using the root package.json scripts.

```bash
# Starts both frontend (craco) and backend (nodemon) concurrently
npm run dev
```

Alternatively, you can run them separately:
- **Backend**: `npm run server`
- **Frontend**: `npm run client`

The application should now be running. The frontend will typically be accessible at `http://localhost:3000` and the backend API at `http://localhost:5000`.

---

## 📂 Project Structure

```text
resume-ai/
├── backend/               # Express server, MongoDB models, routes, and AI logic
│   ├── config/            # Database and environment configurations
│   ├── controllers/       # Route controllers (auth, user, resume, interview)
│   ├── middleware/        # Custom Express middlewares (auth, error handling)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Third-party integrations (AI, PDF parsing)
│   └── server.js          # Entry point for the backend
├── src/                   # React frontend application
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context for state management
│   ├── features/          # Feature-based component structure
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components (Dashboard, Login, Interview, etc.)
│   ├── services/          # API call wrappers
│   └── styles/            # Global SCSS and Tailwind directives
├── package.json           # Root package manager with concurrent scripts
└── tailwind.config.js     # Tailwind CSS configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](<your-github-repo-url>/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is intended for educational and portfolio purposes.

---

## 👤 Author

**Your Name**
* GitHub: [@yourusername](https://github.com/yourusername)
* LinkedIn: [Your Profile](https://linkedin.com/in/yourusername)

---
⭐️ If you found this project helpful, please give it a star on GitHub! ⭐️

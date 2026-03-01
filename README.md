# 💬 Real-Time Chat Application

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![Realtime](https://img.shields.io/badge/RealTime-Socket.io-black)
![Status](https://img.shields.io/badge/Status-Live-brightgreen)

A full-stack **real-time messaging application** built using the **MERN stack**.  
This project focuses on a strong backend architecture for real-time communication with a modern, responsive frontend.

---

## 👨‍💻 Development Approach

This project follows a **hybrid development methodology**:

### 🔹 Backend (Hand-Crafted)
- Express REST API
- MongoDB schema design
- JWT authentication
- Secure password hashing using Bcrypt
- Real-time communication with Socket.io

All backend logic was **written manually** to gain deep understanding of system design, security, and data flow.

### 🔹 Frontend (AI-Assisted)
- React UI built with AI assistance
- Faster prototyping to focus on backend logic and real-time features

---

## ✨ Key Features

- ⚡ Real-time messaging with Socket.io
- 🔐 Secure authentication using JWT & Bcrypt
- 👥 Private and group chats
- ✍️ Typing indicators
- 🔍 User search functionality
- 📱 Fully responsive UI (Chakra UI)

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB & Mongoose
- JSON Web Tokens (JWT)

### Frontend
- React.js (Vite)
- Chakra UI
- Axios

---

## ⚙️ Installation & Setup (Run Locally)

```bash
# 1. Clone the repository
git clone https://github.com/zcode-r/chat-app-mern.git
cd chat-app-mern

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 4. Create environment variables
# Create a .env file in the root directory and add:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# 5. Start the application
npm start

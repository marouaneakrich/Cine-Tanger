# CineTanger - Cinema Booking Experience 🎬

CineTanger is a full-stack premium cinema booking application built with **React Native (Expo)** for the mobile frontend and **Node.js (Express)** for the backend. It features seat selection, QR code generation for tickets, and a modern dark-themed UI.

## 🚀 Features

- **Movie Discovery**: Browse the latest movies with ratings and synopses.
- **Dynamic Booking**: Real-time seat selection with availability tracking.
- **Ticket System**: Automated confirmation codes and QR codes generated for every booking.
- **My Reservations**: Track and manage your movie history and upcoming tickets.
- **RESTful API**: Documented with Swagger/Scalar for easy integration.
- **CI/CD**: Automated testing and deployment pipeline to Railway.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native (Expo SDK 54)
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5
- **Icons**: Ionicons (@expo/vector-icons)
- **Animations**: Lottie React Native

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL (Production) / SQLite (Testing)
- **ORM**: Sequelize
- **Documentation**: Swagger JSDoc & Scalar
- **Testing**: Jest & Supertest

---

## 📂 Project Structure

```text
CineTanger/
├── backend/            # Express.js Server
│   ├── src/            # Controllers, Routes, Utils
│   ├── models/         # Sequelize Database Models
│   ├── tests/          # Jest Integration Tests
│   └── seeders/        # Initial Data Feeders
└── frontend/           # Expo Mobile App
    ├── app/            # Expo Router Screens
    ├── assets/         # Images, Lottie Animations
    ├── services/       # API Integration Layer
    └── store/          # Zustand Global State
```

---

## ⚙️ Backend Setup

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
DB_URL=your_postgresql_connection_string
NODE_ENV=development
```

### 3. Running the Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`. You can view the API Documentation at `http://localhost:5000/docs`.

### 4. Running Tests
```bash
npm test
```

---

## 📱 Frontend Setup

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Configure API Endpoint
Update `frontend/services/api.js` to point to your backend IP/URL.

### 3. Development
```bash
npx expo start
```

### 4. Build APK (Android)
To generate an APK for testing:
```bash
eas build -p android --profile preview
```

---

## 🚢 Deployment

The project is configured for **CI/CD** using GitHub Actions:
- **Continuous Integration**: Every push to `main` triggers a Jest test run.
- **Continuous Deployment**: Successful tests trigger an automatic deployment to **Railway**.

Check `.github/workflows/backend-cicd.yml` for the pipeline configuration.

---

## 📄 License
This project is for educational/portfolio purposes. Built by CineTanger Team.

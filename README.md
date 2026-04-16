# Adnan's Creative Portfolio — Full Stack

A human-centric, minimal portfolio built with **React**, **Vite**, and **Node.js (Express)**.

## 🚀 Quick Start (Development)

1.  **Install dependencies**:
    ```bash
    npm install
    npm run install:all
    ```
2.  **Start development servers**:
    ```bash
    npm run dev
    ```
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5001`

## 📦 Production & Deployment

The project is 100% deploy-ready. The Express server is configured to serve the frontend production build.

1.  **Build the project**:
    ```bash
    # This will build the frontend assets into frontend/dist
    cd frontend && npm run build
    ```
2.  **Start the production server**:
    ```bash
    cd backend && npm start
    ```
    - Access via `http://localhost:5001` (or the `PORT` defined in your environment).

## 📁 Structure

- `/frontend`: React + Vite UI.
- `/backend`: Node.js Express server with API routes.
- `package.json`: Root manager for the mono-repo.

## 🎨 Design System
- **Fonts**: Outfit (Display), Inter (Functional).
- **Theme**: Light/Dark (Human & Minimal aesthetic).

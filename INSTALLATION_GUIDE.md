# Installation & Setup Guide

## System Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0 or yarn >= 1.22.0
- MongoDB >= 4.0 (local or cloud)
- Modern browser (Chrome, Firefox, Safari, Edge)

## Step-by-Step Installation

### 1. Clone/Download Project

```bash
# If using git
git clone [your-repo-url] shopmate
cd shopmate
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod

# Verify connection
mongo
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to server `.env` as `MONGODB_URI`

### 3. Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your settings:
```

**Server .env Configuration:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopmate
DB_NAME=shopmate
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=5242880
```

```bash
# Start server
npm run dev

# You should see:
# ✓ MongoDB Connected
# ✓ Server running on http://localhost:5000
```

### 4. Frontend Setup

**In a new terminal:**

```bash
# Navigate to client
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file:
```

**Client .env Configuration:**
```
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev

# You should see:
# ✓ Vite v4.x.0
# ➜ Local: http://localhost:5173/
```

### 5. Verify Installation

1. Open http://localhost:5173 in browser
2. You should see the ShopMate home page
3. Try registering a new account
4. Navigate through the app

## First-Time Setup Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running
- [ ] Backend .env created and configured
- [ ] Frontend .env created and configured
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend dev server running (http://localhost:5173)
- [ ] Can access application in browser
- [ ] Can register new account

## Default Test Accounts

After setup, you can create new accounts or use this test data:

```
Email: test@example.com
Password: password123
Region: Central
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB service is started on Windows: `net start MongoDB`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in `.env` to 5001, 5002, etc.
- Or kill process using the port:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:5000 | xargs kill -9`

### CORS Error in Console
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify `CORS_ORIGIN` in server `.env`
- Should match frontend URL (http://localhost:5173)

### Module Not Found Error
```
Error: Cannot find module 'express'
```
**Solution:**
- Ensure npm install was run
- Delete node_modules and package-lock.json
- Run `npm install` again

### Build Error
```
error during build: ReferenceError: process is not defined
```
**Solution:**
- This shouldn't happen, but check import statements
- Ensure vite.config.js is correct

## Environment Variables Reference

### Server Variables
| Variable | Example | Purpose |
|----------|---------|---------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment type |
| MONGODB_URI | mongodb://localhost:27017/shopmate | Database connection |
| JWT_SECRET | my_secret_key_xyz | JWT signing key |
| JWT_EXPIRE | 7d | Token expiration |
| CORS_ORIGIN | http://localhost:5173 | Allowed frontend URL |

### Client Variables
| Variable | Example | Purpose |
|----------|---------|---------|
| VITE_API_URL | http://localhost:5000/api | Backend API URL |

## Starting the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Production Build

**Build Frontend:**
```bash
cd client
npm run build
# Creates dist/ folder
```

**Build Backend:**
```bash
cd server
npm start
```

## Quick Start Script

For Windows (create `start.bat`):
```batch
@echo off
start cmd /k "cd server && npm run dev"
start cmd /k "cd client && npm run dev"
```

For Mac/Linux (create `start.sh`):
```bash
#!/bin/bash
(cd server && npm run dev) &
(cd client && npm run dev) &
```

## Project Structure After Setup

```
shopmate/
├── server/
│   ├── node_modules/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .env.example
├── README.md
├── QUICK_START.md
└── .gitignore
```

## Next Steps

1. Explore the application
2. Create test data
3. Try all features
4. Read PROJECT_DOCUMENTATION.md
5. Customize as needed

## Getting Help

- Check error messages in console
- Review logs in terminal
- Check .env configuration
- Ensure all dependencies installed
- Review API responses in Network tab (DevTools)

---

**Happy coding! 🚀**

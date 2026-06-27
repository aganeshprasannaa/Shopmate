@echo off
REM ShopMate - Start Development Servers (Windows)
REM This batch script starts both the backend and frontend servers

title ShopMate Development Environment
cls

echo.
echo ===============================================
echo ^! ShopMate - Starting Development Servers
echo ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node --version
echo.

REM Create logs directory
if not exist "logs" mkdir logs

REM Start Backend Server
echo [INFO] Starting Backend Server...
cd server

if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    call npm install
)

start "ShopMate Backend" /D . cmd /k npm run dev

echo [OK] Backend Server started
echo [INFO] Running on: http://localhost:5000
echo.

REM Wait a moment
timeout /t 2 /nobreak

REM Start Frontend Server
cd ..
echo [INFO] Starting Frontend Server...
cd client

if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

start "ShopMate Frontend" /D . cmd /k npm run dev

echo [OK] Frontend Server started
echo [INFO] Running on: http://localhost:5173
echo.

cd ..

REM Display information
cls
echo.
echo ===============================================
echo [SUCCESS] ShopMate Development Environment Ready!
echo ===============================================
echo.
echo [WEB] Frontend: http://localhost:5173
echo [API] Backend:  http://localhost:5000
echo.
echo [DOCS] Documentation:
echo   - README.md - Complete project overview
echo   - QUICK_START.md - Fast setup guide
echo   - INSTALLATION_GUIDE.md - Installation steps
echo.
echo [LOG] Check the two terminal windows for server output
echo.
echo [INFO] Close the terminal windows to stop the servers
echo.
pause

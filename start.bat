@echo off
REM Quick Start Script for SahAI Gemini Report System (Windows)

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo  SahAI Quick Start - Gemini Report System
echo ==========================================
echo.

REM Check if GEMINI_API_KEY is configured
for /f "tokens=2 delims==" %%A in ('findstr "GEMINI_API_KEY" backend\.env') do set "API_KEY=%%A"

if "!API_KEY!"=="" (
    echo [ERROR] GEMINI_API_KEY not found or empty in backend\.env
    echo Please add your Gemini API key first.
    pause
    exit /b 1
)

echo [OK] GEMINI_API_KEY is configured
echo.

REM Start Backend
echo Starting Backend Server...
echo (Running on http://localhost:8000)
echo.

cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

if not exist "requirements.txt" (
    echo Error: requirements.txt not found
    pause
    exit /b 1
)

pip install -q -r requirements.txt 2>nul

echo Starting uvicorn...
start "SahAI Backend" python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

timeout /t 3 /nobreak

cd ..

REM Start Frontend
echo.
echo Starting Frontend Development Server...
echo (Running on http://localhost:5173)
echo.

cd frontend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install -q
)

if not exist ".env.local" (
    echo VITE_API_URL=http://localhost:8000/api > .env.local
)

echo Starting Vite...
start "SahAI Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak

cd ..

echo.
echo ==========================================
echo  System is Ready!
echo ==========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo Docs:     http://localhost:8000/docs
echo.
echo Next steps:
echo 1. Open http://localhost:5173 in your browser
echo 2. Click "Start Assessment"
echo 3. Submit a problem description
echo 4. View the Gemini-generated report with SVI score
echo.
echo To test the system:
echo   python test_gemini_system.py
echo.
pause

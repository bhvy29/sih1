#!/bin/bash
# Quick Start Script for SahAI Gemini Report System

set -e

echo "🚀 SahAI Quick Start - Gemini Report System"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend .env has GEMINI_API_KEY
if grep -q "GEMINI_API_KEY=" backend/.env; then
    KEY=$(grep "GEMINI_API_KEY=" backend/.env | cut -d= -f2)
    if [ -z "$KEY" ]; then
        echo -e "${RED}❌ Error: GEMINI_API_KEY is empty in backend/.env${NC}"
        echo "Add your Gemini API key to backend/.env"
        exit 1
    else
        echo -e "${GREEN}✅ GEMINI_API_KEY configured${NC}"
    fi
else
    echo -e "${RED}❌ Error: GEMINI_API_KEY not found in backend/.env${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}1. Starting Backend Server...${NC}"
echo "   (This will run on http://localhost:8000)"
echo ""

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate venv and install dependencies
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
fi

# Install dependencies if needed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -q -r requirements.txt
fi

# Start backend in background
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > server.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8000/api/health > /dev/null; then
        echo -e "${GREEN}✅ Backend is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

cd ..

echo ""
echo -e "${BLUE}2. Starting Frontend Development Server...${NC}"
echo "   (This will run on http://localhost:5173)"
echo ""

cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install -q
fi

# Create .env file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "VITE_API_URL=http://localhost:8000/api" > .env.local
fi

# Start frontend in background
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
sleep 3

cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ System is Ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: ${BLUE}http://localhost:5173${NC}"
echo "   Backend:  ${BLUE}http://localhost:8000${NC}"
echo "   Docs:     ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "📝 Submit an assessment:"
echo "   1. Go to http://localhost:5173"
echo "   2. Click 'Start Assessment'"
echo "   3. Fill in the problem description"
echo "   4. Click 'Submit'"
echo ""
echo "🧪 Run tests:"
echo "   python test_gemini_system.py"
echo ""
echo "📊 View dashboard:"
echo "   Go to http://localhost:5173/dashboard"
echo ""
echo "🛑 To stop:"
echo "   Press Ctrl+C"
echo ""

# Keep the script running
wait

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT

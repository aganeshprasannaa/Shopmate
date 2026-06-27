#!/bin/bash
# ShopMate - Start Development Servers
# This script starts both the backend and frontend servers

echo "🚀 ShopMate - Starting Development Servers"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Create logs directory
mkdir -p logs

# Start Backend Server
echo "📦 Starting Backend Server..."
cd server
if [ ! -d "node_modules" ]; then
    echo "   Installing backend dependencies..."
    npm install
fi
npm run dev > ../logs/server.log 2>&1 &
SERVER_PID=$!
echo "✅ Backend Server started (PID: $SERVER_PID)"
echo "   Running on: http://localhost:5000"
echo ""

# Wait a moment for backend to start
sleep 2

# Start Frontend Server
echo "🎨 Starting Frontend Server..."
cd ../client
if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm install
fi
npm run dev > ../logs/client.log 2>&1 &
CLIENT_PID=$!
echo "✅ Frontend Server started (PID: $CLIENT_PID)"
echo "   Running on: http://localhost:5173"
echo ""

# Display information
echo "=========================================="
echo "🎉 ShopMate Development Environment Ready!"
echo "=========================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:5000"
echo ""
echo "📝 Logs:"
echo "   Backend:  ../logs/server.log"
echo "   Frontend: ../logs/client.log"
echo ""
echo "⚠️  To stop both servers, run:"
echo "   kill $SERVER_PID $CLIENT_PID"
echo ""
echo "Press Ctrl+C to stop..."

# Wait for user to stop
wait

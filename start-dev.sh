#!/bin/bash

echo "🚀 Starting Personal Finance Application..."
echo ""

# Check if MongoDB is running
if ! mongosh --eval "db.version()" > /dev/null 2>&1; then
    echo "❌ MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  macOS: brew services start mongodb-community"
    echo "  Linux: sudo systemctl start mongod"
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Start backend in background
echo "🔧 Starting Backend Server..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) - Logs: backend.log"
echo ""

# Wait for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting Frontend Server..."
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID) - Logs: frontend.log"
echo ""

echo "========================================="
echo "✅ Personal Finance App is Running!"
echo "========================================="
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "📋 Backend PID: $BACKEND_PID"
echo "📋 Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop both servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or use: pkill -f 'npm run dev'"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""

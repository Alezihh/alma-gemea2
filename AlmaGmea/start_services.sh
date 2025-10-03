#!/bin/bash

# Kill any existing processes on ports 5000 and 8000
echo "Cleaning up existing processes..."
pkill -f "main.py" || true
pkill -f "tsx server" || true

# Start Flask backend in background
echo "Starting Flask backend on port 8000..."
cd backend
FLASK_PORT=8000 python main.py &
FLASK_PID=$!
cd ..

# Wait for Flask to start
echo "Waiting for Flask backend to start..."
sleep 5

# Test if Flask is responding
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✓ Flask backend is running on port 8000"
else
    echo "✗ Flask backend failed to start"
    exit 1
fi

# Start the frontend
echo "Starting Express frontend on port 5000..."
npm run dev &
FRONTEND_PID=$!

echo "Both services started!"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend PID: $FLASK_PID"

# Keep the script running
wait
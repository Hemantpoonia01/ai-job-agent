#!/bin/bash
echo "🤖 Starting AI Job Agent..."

# Start backend
echo "📡 Starting FastAPI backend on port 8000..."
cd backend
pip install -r requirements.txt -q
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 2

# Start frontend
echo "🖥️  Starting React frontend on port 3000..."
cd frontend
npm install -q
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ AI Job Agent is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

wait $BACKEND_PID $FRONTEND_PID

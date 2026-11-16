@echo off
echo Starting AI Job Agent...

echo Starting FastAPI backend on port 8000...
cd backend
pip install -r requirements.txt
start cmd /k "uvicorn main:app --reload --port 8000"
cd ..

timeout /t 3

echo Starting React frontend on port 3000...
cd frontend
npm install
start cmd /k "npm start"
cd ..

echo.
echo AI Job Agent is running!
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs

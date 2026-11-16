# 🤖 AI Job Agent

> Intelligent Job Search & Application Automation — FastAPI + React

---

## ✨ Features

| Feature | Description |
|---|---|
| **JD Analyzer** | Paste resume + job description → instant match score, matched/missing skills |
| **Resume Optimizer** | AI rewrites your resume to beat ATS filters for each job |
| **Cover Letter Generator** | Personalized cover letters with tone control |
| **Job Finder** | AI searches LinkedIn, Indeed, Glassdoor, Naukri, AngelList for matches |

---

## 🛠️ Stack

- **Backend**: FastAPI + Google Generative AI SDK
- **Frontend**: React 18 + CSS (no UI library)
- **AI**: Gemini 2.0 Flash (Google)

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Windows Command Prompt: copy .env.example .env
# Edit .env and set GEMINI_API_KEY to your Google AI Studio API key.

uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

Frontend runs at: http://localhost:3000

---

## 📁 Project Structure

```
ai-job-agent/
├── backend/
│   ├── main.py               # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── routes/
│       ├── analyze.py        # JD match scoring
│       ├── resume.py         # Resume optimization
│       ├── cover_letter.py   # Cover letter generation
│       └── jobs.py           # Job search across platforms
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── JDAnalyzer.jsx
    │   │   ├── ResumeOptimizer.jsx
    │   │   ├── CoverLetter.jsx
    │   │   └── JobFinder.jsx
    │   └── utils/
    │       ├── api.js
    │       └── helpers.js
    └── package.json
```

---

## 🔐 Environment Variables

### Backend `.env`
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your FREE API key at: https://aistudio.google.com/apikey

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:8000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze/match` | Analyze resume vs JD |
| POST | `/api/resume/optimize` | Optimize resume for ATS |
| POST | `/api/cover-letter/generate` | Generate cover letter |
| POST | `/api/jobs/find` | Find matching jobs |
| POST | `/api/jobs/scrape-status` | Platform scraper status |
| GET | `/docs` | Swagger UI |

---

## 👨‍💻 Author

**Gopi Saraswat** — [GitHub](https://github.com/GopiSarswat)

---

⭐ Star this repo if it helped you!

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import analyze, resume, cover_letter, jobs

app = FastAPI(
    title="AI Job Agent API",
    description="Intelligent Job Search & Application Automation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/analyze", tags=["JD Analyzer"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(cover_letter.router, prefix="/api/cover-letter", tags=["Cover Letter"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])

@app.get("/")
def root():
    return {"message": "AI Job Agent API is running ✅", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}

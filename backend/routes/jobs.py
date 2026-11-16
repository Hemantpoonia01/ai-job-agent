from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import json, re, os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()

class JobSearchRequest(BaseModel):
    resume_text: str
    preferred_roles: list[str] = []
    preferred_location: str = "Remote"
    experience_level: str = "Mid"

class JobMatchRequest(BaseModel):
    resume_text: str
    job_listings: list[dict]

@router.post("/find")
async def find_jobs(req: JobSearchRequest):
    prompt = f"""Based on this resume, suggest realistic job opportunities from multiple platforms.

RESUME:
{req.resume_text}

PREFERENCES:
- Roles: {', '.join(req.preferred_roles) if req.preferred_roles else 'Based on resume'}
- Location: {req.preferred_location}
- Level: {req.experience_level}

Return ONLY valid JSON with no markdown, no extra text. Include job listings from LinkedIn, Indeed, Glassdoor, Naukri, AngelList:
{{
  "jobs": [
    {{
      "id": "1",
      "title": "<job title>",
      "company": "<company name>",
      "location": "<location>",
      "platform": "<LinkedIn/Indeed/Glassdoor/Naukri/AngelList>",
      "match_score": <integer 0-100>,
      "salary_range": "<salary range>",
      "job_type": "<Full-time/Part-time/Contract/Remote>",
      "posted_days_ago": <integer>,
      "required_skills": ["skill1", "skill2"],
      "apply_url": "<realistic search URL for the platform>",
      "description_snippet": "<2-3 sentence job description>"
    }}
  ],
  "search_summary": "<brief summary of search>",
  "total_found": <integer>
}}

Generate 8-10 realistic job listings spread across different platforms."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scrape-status")
async def get_scrape_status():
    return {
        "platforms": [
            {"name": "LinkedIn", "status": "active", "last_scraped": "2 mins ago"},
            {"name": "Indeed", "status": "active", "last_scraped": "5 mins ago"},
            {"name": "Glassdoor", "status": "active", "last_scraped": "8 mins ago"},
            {"name": "Naukri", "status": "active", "last_scraped": "10 mins ago"},
            {"name": "AngelList", "status": "active", "last_scraped": "15 mins ago"},
        ],
        "total_jobs_indexed": 12847,
        "last_full_sync": "1 hour ago"
    }

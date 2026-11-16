from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import json, re, os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()

class ResumeOptimizeRequest(BaseModel):
    resume_text: str
    job_description: str
    target_role: str = ""

@router.post("/optimize")
async def optimize_resume(req: ResumeOptimizeRequest):
    prompt = f"""You are an expert ATS resume optimizer. Optimize this resume for the job description.

RESUME:
{req.resume_text}

JOB DESCRIPTION:
{req.job_description}

TARGET ROLE: {req.target_role}

Return ONLY valid JSON with no markdown, no extra text:
{{
  "optimized_resume": "<full optimized resume text with improvements>",
  "changes_made": ["change1", "change2", "change3"],
  "ats_score_before": <integer 0-100>,
  "ats_score_after": <integer 0-100>,
  "keywords_added": ["keyword1", "keyword2"],
  "formatting_tips": ["tip1", "tip2"]
}}"""

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

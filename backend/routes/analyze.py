from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import json, re, os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/match")
async def analyze_match(req: AnalyzeRequest):
    prompt = f"""Analyze this resume against the job description and return a JSON response.

RESUME:
{req.resume_text}

JOB DESCRIPTION:
{req.job_description}

Return ONLY valid JSON with this exact structure, no markdown, no extra text:
{{
  "match_score": <integer 0-100>,
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "recommendation": "<brief recommendation string>"
}}"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code fences if present
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

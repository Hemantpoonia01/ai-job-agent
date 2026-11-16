from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import json, re, os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str = ""
    applicant_name: str = ""
    tone: str = "professional"

@router.post("/generate")
async def generate_cover_letter(req: CoverLetterRequest):
    prompt = f"""Write a compelling, personalized cover letter.

RESUME:
{req.resume_text}

JOB DESCRIPTION:
{req.job_description}

COMPANY: {req.company_name}
APPLICANT NAME: {req.applicant_name}
TONE: {req.tone}

Return ONLY valid JSON with no markdown, no extra text:
{{
  "cover_letter": "<full cover letter text>",
  "subject_line": "<email subject line>",
  "key_highlights": ["highlight1", "highlight2", "highlight3"],
  "word_count": <integer>
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

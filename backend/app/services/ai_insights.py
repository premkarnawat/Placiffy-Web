
import os
import json
from groq import Groq

def generate_candidate_insights(candidate_data: dict) -> list:
    """
    Generates 2 personalized AI insights based on the candidate's profile data.
    """
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    if not groq_api_key:
        return [
            {"title": "Verification Pending", "description": "Complete your profile to unlock insights.", "color": "amber"},
            {"title": "Upload Resume", "description": "Add your resume to get matched with active jobs.", "color": "blue"}
        ]
        
    client = Groq(api_key=groq_api_key)
    
    prompt = f"""
    You are an AI Career Coach for Placify ATS. 
    Analyze the candidate data below and return EXACTLY 2 highly personalized, actionable insights to help them improve their Trust Score or Job Match Rate.
    
    Candidate Data:
    {json.dumps(candidate_data, indent=2)[:4000]}
    
    Format the response strictly as a JSON list of two objects with this structure:
    [
      {{
        "title": "Short punchy title (max 4 words)",
        "description": "One sentence explaining why and what to do.",
        "color": "amber" or "blue" or "green" or "purple"
      }}
    ]
    """
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        # Groq sometimes wraps lists in a dictionary if forced to json_object, so handle both:
        if isinstance(data, dict):
            for val in data.values():
                if isinstance(val, list): return val
            return [data]
        return data
    except Exception as e:
        print(f"AI Insights Error: {e}")
        return [
            {"title": "Add Portfolio", "description": "Candidates with portfolios are 3x more likely to be interviewed.", "color": "amber"},
            {"title": "Update Skills", "description": "Ensure your skills reflect your latest experience.", "color": "blue"}
        ]

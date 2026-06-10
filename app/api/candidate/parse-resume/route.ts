import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback for demo if no key
      return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });
    }

    const systemPrompt = `You are an expert ATS Resume Parser. Extract the candidate's details from the provided resume text into a strict JSON object. 
If a field is not found, leave it empty or null. Do not hallucinate.

Required JSON Schema:
{
  "personal": {
    "fullName": "string", "email": "string", "location": "string", "headline": "string", "summary": "string",
    "experience_years": "number", "gender": "string", "date_of_birth": "YYYY-MM-DD", "mobile_number": "string",
    "current_address": "string", "city": "string", "state": "string", "country": "string", "pincode": "string", "nationality": "string"
  },
  "preferences": {
    "current_job_role": "string", "industry": "string", "current_ctc": "number", "expected_salary": "number", 
    "notice_period": "string", "preferred_location": "string", "work_mode": "string", "employment_type": "string"
  },
  "education": [ { "institution": "string", "degree": "string", "field_of_study": "string", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "description": "string" } ],
  "experience": [ { "company_name": "string", "title": "string", "location": "string", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "is_current": boolean, "description": "string" } ],
  "skills": ["string", "string"],
  "projects": [ { "name": "string", "description": "string", "url": "string", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD" } ],
  "certifications": [ { "name": "string", "issuer": "string", "issue_date": "YYYY-MM-DD", "url": "string" } ],
  "links": [ { "platform": "string (e.g. GitHub, LinkedIn)", "url": "string" } ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Parse this resume:

${text.substring(0, 15000)}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "OpenAI API failed");
    }

    const data = await response.json();
    const parsedData = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ status: 'success', extracted_data: parsedData });

  } catch (error: any) {
    console.error('Fast Parse Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

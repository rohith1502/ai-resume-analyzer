const Groq = require('groq-sdk');

const analyzeResume = async (resumeText, jobRole, jobDescription, company) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `You are an expert ATS resume analyzer.
Analyze this resume against the job description.
Return ONLY valid JSON, no markdown, no backticks.

Job Role: ${jobRole}
Company: ${company || 'Not specified'}
Job Description: ${jobDescription}
Resume: ${resumeText}

Return exactly:
{
  "atsScore": <0-100>,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missingKeywords": ["..."],
  "suggestions": ["..."],
  "verdict": "strong|average|weak",
  "summaryFeedback": "..."
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: 'Return valid JSON only. No markdown.' },
      { role: 'user', content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  const cleaned = content.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { analyzeResume };

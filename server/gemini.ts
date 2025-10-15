// Using Gemini AI blueprint - blueprint:javascript_gemini
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume and provide a detailed JSON response.

Resume Text:
{RESUME_TEXT}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no other text):
{
  "overallScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "formatScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "keywords": {
    "present": [<array of keywords found in resume>],
    "missing": [<array of important missing keywords for the role>]
  },
  "suggestions": [
    {
      "category": "<category name>",
      "items": [<array of specific suggestions>]
    }
  ]
}

Scoring criteria:
- Overall: Comprehensive assessment
- Content: Quality of descriptions, achievements, metrics
- Keywords: Relevance and presence of industry-standard terms
- Format: Structure, readability, ATS compatibility
- Experience: Relevance and depth of work history

Provide actionable, specific suggestions for improvement.`;

export const IMPROVEMENT_PROMPT = `You are an expert resume writer. Improve the following resume content to make it more ATS-friendly and compelling.

Original Resume:
{RESUME_TEXT}

Analysis Context:
- Overall Score: {SCORE}
- Missing Keywords: {KEYWORDS}

Requirements:
1. Enhance action verbs and quantify achievements
2. Incorporate missing keywords naturally
3. Improve clarity and impact
4. Maintain factual accuracy (don't fabricate details)
5. Keep professional tone
6. Ensure ATS compatibility

Provide the improved resume text directly (no JSON, just the enhanced text).`;

export async function analyzeResume(resumeText: string) {
  try {
    const prompt = ANALYSIS_PROMPT.replace("{RESUME_TEXT}", resumeText);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const text = response.text || "";
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}

export async function improveResume(resumeText: string, score: number, missingKeywords: string[]) {
  try {
    const prompt = IMPROVEMENT_PROMPT
      .replace("{RESUME_TEXT}", resumeText)
      .replace("{SCORE}", score.toString())
      .replace("{KEYWORDS}", missingKeywords.join(", "));
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Gemini improvement error:", error);
    throw error;
  }
}

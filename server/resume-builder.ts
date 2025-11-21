import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  certifications?: string[];
  githubUsername?: string;
}

export interface GitHubProject {
  name: string;
  description: string;
  techStack: string[];
  bullets: string[];
  url?: string;
}

export interface GeneratedResume {
  resumeText: string;
  sections: {
    header: string;
    summary: string;
    skills: string;
    experience: string;
    projects: string;
    education: string;
    certifications?: string;
  };
  atsScore: number;
  optimizations: string[];
  keywords: string[];
}

export class ResumeBuilderService {
  /**
   * Generate a complete ATS-optimized resume
   */
  async generateResume(
    userProfile: UserProfile,
    jobDescription: string,
    githubProjects?: GitHubProject[]
  ): Promise<GeneratedResume> {
    const prompt = `
You are an expert ATS resume writer. Create a professional, ATS-optimized resume tailored to this job description.

JOB DESCRIPTION:
${jobDescription}

USER PROFILE:
Name: ${userProfile.name}
Email: ${userProfile.email}
Phone: ${userProfile.phone || 'Not provided'}
Location: ${userProfile.location || 'Not provided'}
Current Title: ${userProfile.title || 'Software Engineer'}

Skills: ${userProfile.skills.join(', ')}

Experience:
${userProfile.experience.map(exp => `
- ${exp.position} at ${exp.company} (${exp.duration})
  ${exp.responsibilities.join('\n  ')}
`).join('\n')}

Education:
${userProfile.education.map(edu => `
- ${edu.degree} from ${edu.institution} (${edu.year})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}
`).join('\n')}

${userProfile.certifications && userProfile.certifications.length > 0 ? `
Certifications:
${userProfile.certifications.join('\n')}
` : ''}

${githubProjects && githubProjects.length > 0 ? `
GITHUB PROJECTS (Top 3 matching this role):
${githubProjects.map((proj, idx) => `
Project ${idx + 1}: ${proj.name}
Description: ${proj.description}
Tech Stack: ${proj.techStack.join(', ')}
Achievements:
${proj.bullets.join('\n')}
URL: ${proj.url || 'N/A'}
`).join('\n')}
` : ''}

TASK:
Create a complete, ATS-optimized resume that:
1. Highlights skills and experience matching the JD
2. Uses action verbs and quantifiable achievements
3. Incorporates relevant keywords naturally
4. Includes the top 3 GitHub projects with detailed descriptions
5. Maintains professional formatting
6. Is 1-2 pages in length

Structure the resume with these sections:
- HEADER (Name, Contact Info, LinkedIn, GitHub)
- PROFESSIONAL SUMMARY (3-4 lines tailored to the role)
- TECHNICAL SKILLS (categorized: Languages, Frameworks, Tools, etc.)
- PROFESSIONAL EXPERIENCE (reverse chronological, bullet points with metrics)
- PROJECTS (Top 3 GitHub projects with detailed achievements)
- EDUCATION
- CERTIFICATIONS (if any)

Return ONLY a valid JSON object:
{
  "resumeText": "Complete resume as plain text with proper formatting",
  "sections": {
    "header": "Header section text",
    "summary": "Professional summary text",
    "skills": "Skills section text",
    "experience": "Experience section text",
    "projects": "Projects section text",
    "education": "Education section text",
    "certifications": "Certifications text (if any)"
  },
  "atsScore": 85,
  "optimizations": [
    "Added quantifiable achievements in experience",
    "Incorporated 15+ keywords from JD",
    "Used industry-standard action verbs"
  ],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

CRITICAL REQUIREMENTS:
- Use specific metrics and numbers wherever possible
- Start each bullet with strong action verbs
- Tailor content to match job description keywords
- Make GitHub projects stand out with detailed achievements
- Ensure ATS score is 80+ by following best practices
- Keep formatting simple and ATS-friendly (no tables, columns, or complex layouts)

Return ONLY the JSON object, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse resume:', response);
      throw new Error('Failed to generate resume');
    }
  }

  /**
   * Optimize an existing resume for a specific job
   */
  async optimizeResume(
    existingResume: string,
    jobDescription: string
  ): Promise<{
    optimizedResume: string;
    changes: Array<{
      section: string;
      before: string;
      after: string;
      reason: string;
    }>;
    atsScoreImprovement: { before: number; after: number };
  }> {
    const prompt = `
You are an ATS optimization expert. Improve this resume for the given job description.

CURRENT RESUME:
${existingResume}

JOB DESCRIPTION:
${jobDescription}

TASK:
1. Analyze the current resume and identify areas for improvement
2. Rewrite sections to better match the JD
3. Add missing keywords naturally
4. Improve action verbs and quantifiable achievements
5. Maintain the original structure but enhance content

Return ONLY a valid JSON object:
{
  "optimizedResume": "Complete improved resume text",
  "changes": [
    {
      "section": "Professional Summary",
      "before": "Original text excerpt",
      "after": "Improved text excerpt",
      "reason": "Why this change improves ATS score"
    }
  ],
  "atsScoreImprovement": {
    "before": 70,
    "after": 88
  }
}

Focus on:
- Keyword optimization
- Quantifiable achievements
- Action verb improvement
- Relevance to job description

Return ONLY the JSON object, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(response);
  }

  /**
   * Generate a professional summary tailored to job description
   */
  async generateSummary(
    userProfile: UserProfile,
    jobDescription: string
  ): Promise<string> {
    const prompt = `
Write a compelling 3-4 line professional summary for this person's resume.

USER INFO:
- Current Title: ${userProfile.title || 'Software Engineer'}
- Years of Experience: ${this.calculateYearsOfExperience(userProfile.experience)}
- Key Skills: ${userProfile.skills.slice(0, 5).join(', ')}
- Notable Experience: ${userProfile.experience[0]?.company || 'Various companies'}

JOB DESCRIPTION:
${jobDescription.substring(0, 500)}

Write a summary that:
1. Highlights relevant experience and skills
2. Shows alignment with the role
3. Includes key technical strengths
4. Uses industry terminology
5. Is concise and impactful (3-4 lines max)

Return ONLY the summary text, no JSON, no labels.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return result.response.text().trim();
  }

  /**
   * Extract resume data from text (for uploaded resumes)
   */
  async parseResumeText(resumeText: string): Promise<Partial<UserProfile>> {
    const prompt = `
Extract structured information from this resume.

RESUME:
${resumeText}

Return ONLY a valid JSON object:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, State",
  "title": "Current/Target Title",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "Start - End",
      "responsibilities": ["Responsibility 1", "Responsibility 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "year": "Graduation Year",
      "gpa": "GPA (if mentioned)"
    }
  ],
  "certifications": ["Cert 1", "Cert 2"]
}

Extract as much information as possible. If something is not found, use null.
Return ONLY the JSON object, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(response);
  }

  /**
   * Generate multiple resume templates (ATS, Creative, Executive)
   */
  async generateMultipleFormats(
    baseResume: GeneratedResume,
    format: 'ats' | 'creative' | 'executive'
  ): Promise<string> {
    const formatInstructions = {
      ats: 'Simple, clean, ATS-friendly format with no graphics or complex formatting',
      creative: 'Modern, visually appealing format with subtle design elements (still ATS-compatible)',
      executive: 'Professional executive format emphasizing leadership and strategic impact',
    };

    const prompt = `
Convert this resume to ${format.toUpperCase()} format.

CURRENT RESUME:
${baseResume.resumeText}

FORMAT REQUIREMENTS:
${formatInstructions[format]}

Return the reformatted resume as plain text with appropriate formatting.
Maintain all content but adjust presentation style.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return result.response.text().trim();
  }

  /**
   * Calculate years of experience from experience array
   */
  private calculateYearsOfExperience(
    experience: UserProfile['experience']
  ): string {
    if (experience.length === 0) return '0';
    
    // Simple calculation - count unique year ranges
    const years = experience.reduce((total, exp) => {
      const match = exp.duration.match(/(\d+)\s*year/i);
      return total + (match ? parseInt(match[1]) : 1);
    }, 0);

    return years > 0 ? `${years}+` : '1-2';
  }

  /**
   * Generate cover letter based on resume and job description
   */
  async generateCoverLetter(
    userProfile: UserProfile,
    jobDescription: string,
    companyName: string
  ): Promise<string> {
    const prompt = `
Write a professional cover letter for this job application.

APPLICANT INFO:
Name: ${userProfile.name}
Current Title: ${userProfile.title || 'Software Engineer'}
Key Skills: ${userProfile.skills.slice(0, 5).join(', ')}

JOB DESCRIPTION:
${jobDescription}

COMPANY: ${companyName}

Write a compelling 3-paragraph cover letter that:
1. Opens with enthusiasm and relevant qualifications
2. Highlights 2-3 specific achievements matching the role
3. Closes with a strong call to action

Keep it professional, concise (250-300 words), and personalized.
Return ONLY the cover letter text, properly formatted.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return result.response.text().trim();
  }
}

// Export singleton instance
export const resumeBuilderService = new ResumeBuilderService();
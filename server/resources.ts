import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'documentation' | 'course' | 'article' | 'stackoverflow';
  description: string;
  relevance: number; // 0-100
  platform?: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ResourceCategory {
  category: string;
  resources: Resource[];
}

export interface LearningPlan {
  jobTitle: string;
  requiredSkills: string[];
  missingSkills: string[];
  categories: ResourceCategory[];
  estimatedLearningTime: string;
  roadmap: string[];
}

export class ResourcesService {
  /**
   * Extract skills and requirements from job description
   */
  private async extractSkillsFromJD(jobDescription: string): Promise<{
    requiredSkills: string[];
    niceToHave: string[];
    tools: string[];
    frameworks: string[];
  }> {
    const prompt = `
Analyze this job description and extract ALL technical skills, tools, and frameworks mentioned.

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object:
{
  "requiredSkills": ["skill1", "skill2", ...],
  "niceToHave": ["skill1", "skill2", ...],
  "tools": ["tool1", "tool2", ...],
  "frameworks": ["framework1", "framework2", ...]
}

Be comprehensive. Include programming languages, frameworks, databases, cloud platforms, methodologies, etc.
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
   * Generate curated learning resources based on job description
   */
  async generateResources(
    jobDescription: string,
    userSkills: string[] = []
  ): Promise<LearningPlan> {
    // Extract skills from JD
    const jdSkills = await this.extractSkillsFromJD(jobDescription);
    const allRequiredSkills = [
      ...jdSkills.requiredSkills,
      ...jdSkills.tools,
      ...jdSkills.frameworks,
    ];

    // Identify skill gaps
    const missingSkills = allRequiredSkills.filter(
      skill => !userSkills.some(
        userSkill => userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    // Generate resource recommendations using Gemini
    const resourcePrompt = `
You are a career coach and learning advisor. Generate tailored learning resources for someone preparing for this job.

JOB DESCRIPTION:
${jobDescription}

USER'S CURRENT SKILLS:
${userSkills.join(', ') || 'Not provided'}

SKILLS TO LEARN:
${missingSkills.join(', ')}

TASK:
Generate a comprehensive learning plan with resources in these categories:
1. **Core Technologies** - Required programming languages and frameworks
2. **Tools & Platforms** - Development tools, cloud platforms, databases
3. **System Design & Architecture** - High-level concepts
4. **Best Practices** - Coding standards, testing, documentation
5. **Interview Preparation** - Technical interview practice

For EACH category, provide 3-5 resources with:
- Realistic resource titles (based on popular platforms)
- Resource type (video, documentation, course, article, stackoverflow)
- Platform name (YouTube, Udemy, freeCodeCamp, MDN, StackOverflow, etc.)
- Brief description (1-2 sentences)
- Relevance score (0-100)
- Estimated duration
- Difficulty level

Also provide:
- A learning roadmap (ordered list of what to learn first)
- Estimated total learning time

Return ONLY a valid JSON object:
{
  "jobTitle": "extracted job title",
  "requiredSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "categories": [
    {
      "category": "Core Technologies",
      "resources": [
        {
          "title": "Resource Title",
          "url": "https://youtube.com/placeholder",
          "type": "video",
          "description": "Brief description",
          "relevance": 95,
          "platform": "YouTube",
          "duration": "2 hours",
          "difficulty": "intermediate"
        }
      ]
    }
  ],
  "estimatedLearningTime": "4-6 weeks",
  "roadmap": ["Step 1", "Step 2", "Step 3"]
}

IMPORTANT:
- Use placeholder URLs (we'll replace them later with real links)
- Focus on popular, high-quality resources
- Prioritize free resources when possible
- Be specific about durations and difficulty
- Order resources by priority within each category

Return ONLY the JSON object, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: resourcePrompt }] }],
    });

    const response = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      const learningPlan: LearningPlan = JSON.parse(response);
      
      // Enhance URLs with real search links
      learningPlan.categories = learningPlan.categories.map(category => ({
        ...category,
        resources: category.resources.map(resource => ({
          ...resource,
          url: this.generateSearchUrl(resource),
        })),
      }));

      return learningPlan;
    } catch (error) {
      console.error('Failed to parse learning plan:', response);
      throw new Error('Failed to generate learning resources');
    }
  }

  /**
   * Generate search URLs for resources based on type and platform
   */
  private generateSearchUrl(resource: Resource): string {
    const searchTerm = encodeURIComponent(resource.title);

    switch (resource.type) {
      case 'video':
        if (resource.platform?.toLowerCase().includes('youtube')) {
          return `https://www.youtube.com/results?search_query=${searchTerm}`;
        }
        return `https://www.youtube.com/results?search_query=${searchTerm}`;

      case 'course':
        if (resource.platform?.toLowerCase().includes('udemy')) {
          return `https://www.udemy.com/courses/search/?q=${searchTerm}`;
        }
        if (resource.platform?.toLowerCase().includes('coursera')) {
          return `https://www.coursera.org/search?query=${searchTerm}`;
        }
        return `https://www.udemy.com/courses/search/?q=${searchTerm}`;

      case 'documentation':
        return `https://www.google.com/search?q=${searchTerm}+documentation`;

      case 'stackoverflow':
        return `https://stackoverflow.com/search?q=${searchTerm}`;

      case 'article':
        return `https://www.google.com/search?q=${searchTerm}+tutorial`;

      default:
        return `https://www.google.com/search?q=${searchTerm}`;
    }
  }

  /**
   * Generate interview preparation questions based on JD
   */
  async generateInterviewQuestions(
    jobDescription: string
  ): Promise<{
    technical: string[];
    behavioral: string[];
    systemDesign: string[];
  }> {
    const prompt = `
Generate interview questions for this job position.

JOB DESCRIPTION:
${jobDescription}

Create 3 categories:
1. **Technical Questions** (8-10 questions) - Coding, algorithms, specific technologies
2. **Behavioral Questions** (5-7 questions) - STAR method, past experience
3. **System Design Questions** (3-5 questions) - Architecture, scalability

Return ONLY a valid JSON object:
{
  "technical": ["Question 1?", "Question 2?"],
  "behavioral": ["Question 1?", "Question 2?"],
  "systemDesign": ["Question 1?", "Question 2?"]
}

Make questions realistic and commonly asked in interviews.
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
   * Get skill gap analysis with specific learning recommendations
   */
  async analyzeSkillGap(
    jobDescription: string,
    userSkills: string[]
  ): Promise<{
    matchScore: number;
    presentSkills: string[];
    missingSkills: string[];
    recommendations: Array<{
      skill: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
      estimatedTime: string;
    }>;
  }> {
    const jdSkills = await this.extractSkillsFromJD(jobDescription);
    const allRequiredSkills = [
      ...jdSkills.requiredSkills,
      ...jdSkills.tools,
      ...jdSkills.frameworks,
    ];

    const presentSkills = allRequiredSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const missingSkills = allRequiredSkills.filter(
      skill => !presentSkills.includes(skill)
    );

    const matchScore = Math.round(
      (presentSkills.length / allRequiredSkills.length) * 100
    );

    // Generate prioritized recommendations
    const recPrompt = `
Prioritize these missing skills for this job and provide learning recommendations.

JOB DESCRIPTION (excerpt):
${jobDescription.substring(0, 500)}

MISSING SKILLS:
${missingSkills.join(', ')}

For each skill, provide:
- Priority level (high/medium/low) based on job requirements
- Reason why it's important
- Estimated time to learn (realistic)

Return ONLY a valid JSON array:
[
  {
    "skill": "Skill Name",
    "priority": "high",
    "reason": "Brief explanation",
    "estimatedTime": "2-3 weeks"
  }
]

Return ONLY the JSON array, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: recPrompt }] }],
    });

    const response = result.response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const recommendations = JSON.parse(response);

    return {
      matchScore,
      presentSkills,
      missingSkills,
      recommendations,
    };
  }
}

// Export singleton instance
export const resourcesService = new ResourcesService();
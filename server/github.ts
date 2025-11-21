import { GoogleGenerativeAI } from '@google/generative-ai';

const GITHUB_API = 'https://api.github.com';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  languages_url: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  homepage: string | null;
}

interface LanguageData {
  [language: string]: number;
}

interface AnalyzedProject {
  name: string;
  description: string;
  techStack: string[];
  url: string;
  matchScore: number;
  relevanceReason: string;
  stars: number;
  lastUpdated: string;
}

export class GitHubService {
  private accessToken?: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  /**
   * Fetch all repositories for a given GitHub username
   */
  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `token ${this.accessToken}`;
    }

    const response = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch languages used in a repository
   */
  async getRepoLanguages(languagesUrl: string): Promise<string[]> {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `token ${this.accessToken}`;
    }

    const response = await fetch(languagesUrl, { headers });

    if (!response.ok) {
      return [];
    }

    const data: LanguageData = await response.json();
    return Object.keys(data);
  }

  /**
   * Fetch README content for a repository
   */
  async getRepoReadme(owner: string, repo: string): Promise<string | null> {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3.raw',
    };

    if (this.accessToken) {
      headers['Authorization'] = `token ${this.accessToken}`;
    }

    try {
      const response = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/readme`,
        { headers }
      );

      if (!response.ok) {
        return null;
      }

      return await response.text();
    } catch (error) {
      return null;
    }
  }

  /**
   * Analyze projects against job description using Gemini AI
   * Returns top 3 matching projects with detailed analysis
   */
  async analyzeProjectsForJob(
    username: string,
    jobDescription: string
  ): Promise<AnalyzedProject[]> {
    // Fetch all repositories
    const repos = await this.getUserRepos(username);

    if (repos.length === 0) {
      throw new Error('No repositories found for this user');
    }

    // Filter out forks and get relevant repos
    const ownRepos = repos.filter(repo => !repo.fork);

    // Enrich repository data with languages and readme
    const enrichedRepos = await Promise.all(
      ownRepos.slice(0, 20).map(async (repo) => {
        const languages = await this.getRepoLanguages(repo.languages_url);
        const readme = await this.getRepoReadme(
          username,
          repo.name
        );

        return {
          ...repo,
          languages,
          readme: readme?.substring(0, 1000) || '', // Limit readme length
        };
      })
    );

    // Use Gemini AI to analyze and rank projects
    const analysisPrompt = `
You are an expert technical recruiter. Analyze these GitHub projects and rank the TOP 3 that best match the following job description.

JOB DESCRIPTION:
${jobDescription}

GITHUB PROJECTS:
${enrichedRepos.map((repo, idx) => `
Project ${idx + 1}:
- Name: ${repo.name}
- Description: ${repo.description || 'No description'}
- Tech Stack: ${repo.languages.join(', ')}
- Topics: ${repo.topics.join(', ')}
- Stars: ${repo.stargazers_count}
- README Preview: ${repo.readme}
- URL: ${repo.html_url}
`).join('\n---\n')}

TASK:
Return ONLY a valid JSON array of the top 3 matching projects. Each project should have:
{
  "name": "project-name",
  "description": "enhanced project description (2-3 sentences)",
  "techStack": ["tech1", "tech2", "tech3"],
  "url": "github-url",
  "matchScore": 0-100,
  "relevanceReason": "why this project is relevant to the job (2-3 sentences)",
  "stars": number,
  "lastUpdated": "YYYY-MM-DD"
}

Requirements:
- Prioritize projects with technologies mentioned in the JD
- Consider project complexity, recency, and stars
- Write enhanced descriptions that highlight relevant features
- Explain match reasoning clearly
- Return exactly 3 projects, even if match scores are low

Return ONLY the JSON array, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
    });

    const response = result.response.text();
    
    // Clean response and parse JSON
    let cleanedResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      const analyzedProjects: AnalyzedProject[] = JSON.parse(cleanedResponse);
      
      // Validate and return top 3
      return analyzedProjects.slice(0, 3);
    } catch (error) {
      console.error('Failed to parse Gemini response:', cleanedResponse);
      throw new Error('Failed to analyze projects. Please try again.');
    }
  }

  /**
   * Generate enhanced project descriptions for resume inclusion
   */
  async generateProjectDescriptions(
    projects: AnalyzedProject[],
    jobDescription: string
  ): Promise<{ name: string; description: string; bullets: string[] }[]> {
    const prompt = `
You are a professional resume writer. Generate ATS-optimized project descriptions for the following projects, tailored to this job description.

JOB DESCRIPTION:
${jobDescription}

PROJECTS:
${projects.map((p, idx) => `
${idx + 1}. ${p.name}
   Tech Stack: ${p.techStack.join(', ')}
   Current Description: ${p.description}
   Relevance: ${p.relevanceReason}
`).join('\n')}

TASK:
For each project, generate:
1. A concise project title/tagline (1 line)
2. 3-4 bullet points highlighting:
   - Key technical achievements
   - Quantified results (if possible)
   - Technologies used (matching JD keywords)
   - Problem solved / impact

Use action verbs (Developed, Implemented, Engineered, Built, Designed).
Make descriptions ATS-friendly and keyword-rich.

Return ONLY a valid JSON array:
[
  {
    "name": "Project Name",
    "description": "One-line tagline",
    "bullets": [
      "• First achievement with metrics",
      "• Second achievement with tech stack",
      "• Third achievement with impact"
    ]
  }
]

Return ONLY the JSON array, no other text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response.text();
    
    let cleanedResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse project descriptions:', cleanedResponse);
      throw new Error('Failed to generate project descriptions.');
    }
  }

  /**
   * Extract tech stack and skills from GitHub profile
   */
  async extractSkillsFromGitHub(username: string): Promise<{
    languages: { [key: string]: number };
    topSkills: string[];
    totalRepos: number;
  }> {
    const repos = await this.getUserRepos(username);
    const languageCount: { [key: string]: number } = {};

    // Aggregate language usage across all repos
    for (const repo of repos.slice(0, 30)) {
      const languages = await this.getRepoLanguages(repo.languages_url);
      languages.forEach(lang => {
        languageCount[lang] = (languageCount[lang] || 0) + 1;
      });
    }

    // Sort by frequency
    const topSkills = Object.entries(languageCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([lang]) => lang);

    return {
      languages: languageCount,
      topSkills,
      totalRepos: repos.length,
    };
  }
}

// Export singleton instance
export const createGitHubService = (accessToken?: string) => 
  new GitHubService(accessToken);
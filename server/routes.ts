import { Router } from 'express';
import type { Request, Response } from 'express';
import { analyzeResume, improveResume } from './gemini';
import { storage } from './storage';
import { createGitHubService } from './github';
import { resourcesService } from './resources';
import { resumeBuilderService } from './resume-builder';

const router = Router();

// ==================== EXISTING ROUTES ====================

/**
 * POST /api/analyze
 * Analyze resume with Gemini AI
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, userId = 'mock-user' } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    // Analyze with Gemini
    const analysis = await analyzeResume(resumeText);

    // Store in database
    const analysisRecord = await storage.createAnalysis({
      userId,
      resumeText,
      ...analysis,
    });

    res.json({
      id: analysisRecord.id,
      ...analysis,
      createdAt: analysisRecord.createdAt,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

/**
 * GET /api/analysis/:id
 * Get specific analysis by ID
 */
router.get('/analysis/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const analysis = await storage.getAnalysis(id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error: any) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analyses
 * Get all analyses for a user
 */
router.get('/analyses', async (req: Request, res: Response) => {
  try {
    const { userId = 'mock-user' } = req.query;
    const analyses = await storage.getUserAnalyses(userId as string);

    res.json({
      analyses,
      total: analyses.length,
    });
  } catch (error: any) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/improve
 * Generate improved resume (quota enforced)
 */
router.post('/improve', async (req: Request, res: Response) => {
  try {
    const { resumeText, analysisId, userId = 'mock-user' } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    // Check quota
    const user = await storage.getOrCreateMockUser(userId);
    
    if (user.improvementsUsed >= user.improvementsLimit) {
      return res.status(403).json({
        error: 'Improvement quota exceeded',
        used: user.improvementsUsed,
        limit: user.improvementsLimit,
      });
    }

    // Generate improvement
    const improvedText = await improveResume(resumeText);

    // Save revision
    const revision = await storage.createRevision({
      analysisId: analysisId || 'standalone',
      userId,
      improvedText,
    });

    // Increment quota
    await storage.incrementUserQuota(userId);

    res.json({
      id: revision.id,
      improvedText,
      quotaRemaining: user.improvementsLimit - user.improvementsUsed - 1,
      createdAt: revision.createdAt,
    });
  } catch (error: any) {
    console.error('Improvement error:', error);
    res.status(500).json({ error: error.message || 'Failed to improve resume' });
  }
});

/**
 * GET /api/quota
 * Get user's improvement quota status
 */
router.get('/quota', async (req: Request, res: Response) => {
  try {
    const { userId = 'mock-user' } = req.query;
    const user = await storage.getOrCreateMockUser(userId as string);

    res.json({
      used: user.improvementsUsed,
      limit: user.improvementsLimit,
      remaining: user.improvementsLimit - user.improvementsUsed,
    });
  } catch (error: any) {
    console.error('Quota error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GITHUB INTEGRATION ROUTES ====================

/**
 * POST /api/github/repos
 * Fetch user's GitHub repositories
 */
router.post('/github/repos', async (req: Request, res: Response) => {
  try {
    const { username, accessToken } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const githubService = createGitHubService(accessToken);
    const repos = await githubService.getUserRepos(username);

    res.json({
      username,
      totalRepos: repos.length,
      repos: repos.slice(0, 20).map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        topics: repo.topics,
        updatedAt: repo.updated_at,
      })),
    });
  } catch (error: any) {
    console.error('GitHub repos fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch repositories' });
  }
});

/**
 * POST /api/github/analyze
 * Analyze GitHub projects against job description
 */
router.post('/github/analyze', async (req: Request, res: Response) => {
  try {
    const { username, jobDescription, accessToken } = req.body;

    if (!username || !jobDescription) {
      return res.status(400).json({ 
        error: 'Username and job description are required' 
      });
    }

    const githubService = createGitHubService(accessToken);
    const analyzedProjects = await githubService.analyzeProjectsForJob(
      username,
      jobDescription
    );

    res.json({
      username,
      matchedProjects: analyzedProjects,
      totalAnalyzed: analyzedProjects.length,
    });
  } catch (error: any) {
    console.error('GitHub analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze projects' });
  }
});

/**
 * POST /api/github/project-descriptions
 * Generate enhanced project descriptions for resume
 */
router.post('/github/project-descriptions', async (req: Request, res: Response) => {
  try {
    const { projects, jobDescription } = req.body;

    if (!projects || !Array.isArray(projects) || !jobDescription) {
      return res.status(400).json({ 
        error: 'Projects array and job description are required' 
      });
    }

    const githubService = createGitHubService();
    const descriptions = await githubService.generateProjectDescriptions(
      projects,
      jobDescription
    );

    res.json({ projectDescriptions: descriptions });
  } catch (error: any) {
    console.error('Project descriptions error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate project descriptions' });
  }
});

/**
 * POST /api/github/skills
 * Extract skills from GitHub profile
 */
router.post('/github/skills', async (req: Request, res: Response) => {
  try {
    const { username, accessToken } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const githubService = createGitHubService(accessToken);
    const skills = await githubService.extractSkillsFromGitHub(username);

    res.json(skills);
  } catch (error: any) {
    console.error('GitHub skills extraction error:', error);
    res.status(500).json({ error: error.message || 'Failed to extract skills' });
  }
});

// ==================== RESOURCES GENERATION ROUTES ====================

/**
 * POST /api/resources/generate
 * Generate learning resources based on job description
 */
router.post('/resources/generate', async (req: Request, res: Response) => {
  try {
    const { jobDescription, userSkills } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const learningPlan = await resourcesService.generateResources(
      jobDescription,
      userSkills || []
    );

    res.json({
      learningPlan,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Resources generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate resources' });
  }
});

/**
 * POST /api/resources/interview-questions
 * Generate interview questions based on job description
 */
router.post('/resources/interview-questions', async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const questions = await resourcesService.generateInterviewQuestions(jobDescription);

    res.json({
      questions,
      totalQuestions: 
        questions.technical.length + 
        questions.behavioral.length + 
        questions.systemDesign.length,
    });
  } catch (error: any) {
    console.error('Interview questions generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate interview questions' });
  }
});

/**
 * POST /api/resources/skill-gap
 * Analyze skill gap between user and job requirements
 */
router.post('/resources/skill-gap', async (req: Request, res: Response) => {
  try {
    const { jobDescription, userSkills } = req.body;

    if (!jobDescription || !userSkills) {
      return res.status(400).json({ 
        error: 'Job description and user skills are required' 
      });
    }

    const gapAnalysis = await resourcesService.analyzeSkillGap(
      jobDescription,
      userSkills
    );

    res.json(gapAnalysis);
  } catch (error: any) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze skill gap' });
  }
});

// ==================== AUTO RESUME BUILDER ROUTES ====================

/**
 * POST /api/resume/auto-generate
 * Auto-generate complete resume with GitHub projects
 */
router.post('/resume/auto-generate', async (req: Request, res: Response) => {
  try {
    const { userProfile, jobDescription, githubProjects } = req.body;

    if (!userProfile || !jobDescription) {
      return res.status(400).json({ 
        error: 'User profile and job description are required' 
      });
    }

    const generatedResume = await resumeBuilderService.generateResume(
      userProfile,
      jobDescription,
      githubProjects
    );

    res.json({
      resume: generatedResume,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Auto resume generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate resume' });
  }
});

/**
 * POST /api/resume/optimize
 * Optimize existing resume for specific job
 */
router.post('/resume/optimize', async (req: Request, res: Response) => {
  try {
    const { existingResume, jobDescription } = req.body;

    if (!existingResume || !jobDescription) {
      return res.status(400).json({ 
        error: 'Existing resume and job description are required' 
      });
    }

    const optimized = await resumeBuilderService.optimizeResume(
      existingResume,
      jobDescription
    );

    res.json({
      optimization: optimized,
      optimizedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Resume optimization error:', error);
    res.status(500).json({ error: error.message || 'Failed to optimize resume' });
  }
});

/**
 * POST /api/resume/summary
 * Generate professional summary
 */
router.post('/resume/summary', async (req: Request, res: Response) => {
  try {
    const { userProfile, jobDescription } = req.body;

    if (!userProfile || !jobDescription) {
      return res.status(400).json({ 
        error: 'User profile and job description are required' 
      });
    }

    const summary = await resumeBuilderService.generateSummary(
      userProfile,
      jobDescription
    );

    res.json({ summary });
  } catch (error: any) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
});

/**
 * POST /api/resume/parse
 * Parse uploaded resume text
 */
router.post('/resume/parse', async (req: Request, res: Response) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const parsedData = await resumeBuilderService.parseResumeText(resumeText);

    res.json({ parsedProfile: parsedData });
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
});

/**
 * POST /api/resume/cover-letter
 * Generate cover letter
 */
router.post('/resume/cover-letter', async (req: Request, res: Response) => {
  try {
    const { userProfile, jobDescription, companyName } = req.body;

    if (!userProfile || !jobDescription || !companyName) {
      return res.status(400).json({ 
        error: 'User profile, job description, and company name are required' 
      });
    }

    const coverLetter = await resumeBuilderService.generateCoverLetter(
      userProfile,
      jobDescription,
      companyName
    );

    res.json({ 
      coverLetter,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate cover letter' });
  }
});

/**
 * POST /api/resume/formats
 * Generate resume in different formats
 */
router.post('/resume/formats', async (req: Request, res: Response) => {
  try {
    const { baseResume, format } = req.body;

    if (!baseResume || !format) {
      return res.status(400).json({ 
        error: 'Base resume and format are required' 
      });
    }

    if (!['ats', 'creative', 'executive'].includes(format)) {
      return res.status(400).json({ 
        error: 'Format must be one of: ats, creative, executive' 
      });
    }

    const formattedResume = await resumeBuilderService.generateMultipleFormats(
      baseResume,
      format
    );

    res.json({ formattedResume, format });
  } catch (error: any) {
    console.error('Resume formatting error:', error);
    res.status(500).json({ error: error.message || 'Failed to format resume' });
  }
});

// ==================== JOB DESCRIPTION PARSING ====================

/**
 * POST /api/jd/parse
 * Parse and extract information from job description
 */
router.post('/jd/parse', async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const gapAnalysis = await resourcesService.analyzeSkillGap(
      jobDescription,
      []
    );

    res.json({
      requiredSkills: gapAnalysis.missingSkills,
      parsedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('JD parsing error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse job description' });
  }
});

// ==================== ADMIN ROUTES (MOCK) ====================

/**
 * GET /api/admin/users
 * Get all users (mock data)
 */
router.get('/admin/users', async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    res.json({ users, total: users.length });
  } catch (error: any) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/logs
 * Get audit logs (mock data)
 */
router.get('/admin/logs', async (req: Request, res: Response) => {
  try {
    // Mock audit logs
    const logs = [
      {
        id: '1',
        userId: 'mock-user',
        action: 'analyze_resume',
        timestamp: new Date().toISOString(),
        metadata: { resumeLength: 1500 },
      },
      {
        id: '2',
        userId: 'mock-user',
        action: 'improve_resume',
        timestamp: new Date().toISOString(),
        metadata: { quotaUsed: 1 },
      },
    ];
    
    res.json({ logs, total: logs.length });
  } catch (error: any) {
    console.error('Admin logs error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
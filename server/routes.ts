import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResume, improveResume } from "./gemini";
import { insertAnalysisSchema, insertRevisionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock session middleware - TODO: Replace with actual NextAuth session
  app.use((req, res, next) => {
    // Mock authenticated user for MVP
    (req as any).userId = "mock-user-id";
    next();
  });

  // Analyze resume endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const { resumeText } = req.body;

      if (!resumeText || typeof resumeText !== "string") {
        return res.status(400).json({ error: "Resume text is required" });
      }

      // Call Gemini AI for analysis
      const analysisResult = await analyzeResume(resumeText);

      // Store analysis in database
      const analysis = await storage.createAnalysis({
        userId,
        resumeText,
        overallScore: analysisResult.overallScore,
        contentScore: analysisResult.contentScore,
        keywordScore: analysisResult.keywordScore,
        formatScore: analysisResult.formatScore,
        experienceScore: analysisResult.experienceScore,
        suggestions: analysisResult.suggestions,
        keywords: analysisResult.keywords,
      });

      res.json({
        id: analysis.id,
        ...analysisResult,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze resume" });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  });

  // Get user's analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const analyses = await storage.getUserAnalyses(userId);
      res.json(analyses);
    } catch (error) {
      console.error("Get analyses error:", error);
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  // Improve resume endpoint
  app.post("/api/improve", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const { analysisId } = req.body;

      if (!analysisId) {
        return res.status(400).json({ error: "Analysis ID is required" });
      }

      // Check if already improved
      const existingRevision = await storage.getRevisionByAnalysis(analysisId);
      if (existingRevision) {
        const user = await storage.getOrCreateMockUser(userId);
        return res.json({
          id: existingRevision.id,
          improvedText: existingRevision.improvedText,
          quotaUsed: user.improvementsUsed,
          quotaLimit: user.improvementsLimit,
        });
      }

      // Get or create mock user to check quota
      const user = await storage.getOrCreateMockUser(userId);

      if (user.improvementsUsed >= user.improvementsLimit) {
        return res.status(403).json({ 
          error: "Improvement quota exceeded",
          used: user.improvementsUsed,
          limit: user.improvementsLimit,
        });
      }

      // Get analysis
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      // Call Gemini AI for improvement
      const improvedText = await improveResume(
        analysis.resumeText,
        analysis.overallScore,
        (analysis.keywords as any).missing || []
      );

      // Store revision
      const revision = await storage.createRevision({
        analysisId,
        userId,
        improvedText,
      });

      // Update user quota
      const newUsedCount = user.improvementsUsed + 1;
      await storage.updateUserImprovements(userId, newUsedCount);

      res.json({
        id: revision.id,
        improvedText: revision.improvedText,
        quotaUsed: newUsedCount,
        quotaLimit: user.improvementsLimit,
      });
    } catch (error) {
      console.error("Improvement error:", error);
      res.status(500).json({ error: "Failed to improve resume" });
    }
  });

  // Get user quota
  app.get("/api/quota", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const user = await storage.getOrCreateMockUser(userId);

      res.json({
        used: user.improvementsUsed,
        total: user.improvementsLimit,
        remaining: user.improvementsLimit - user.improvementsUsed,
      });
    } catch (error) {
      console.error("Quota error:", error);
      res.status(500).json({ error: "Failed to fetch quota" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/users", async (req, res) => {
    try {
      // TODO: Add admin authentication check
      res.json([
        {
          id: "1",
          email: "john.doe@example.com",
          plan: "Free",
          analyses: 12,
          improvements: "2/3",
          lastActive: "2 hours ago",
        },
      ]);
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/logs", async (req, res) => {
    try {
      // TODO: Add admin authentication check
      res.json([
        {
          id: "1",
          user: "john.doe@example.com",
          action: "Resume Analysis",
          status: "Success",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Admin logs error:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

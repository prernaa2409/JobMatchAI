import { type User, type InsertUser, type Analysis, type Revision } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getOrCreateMockUser(userId: string): Promise<User>;
  updateUserImprovements(userId: string, used: number): Promise<void>;
  
  createAnalysis(analysis: Omit<Analysis, "id" | "createdAt">): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getUserAnalyses(userId: string): Promise<Analysis[]>;
  
  createRevision(revision: Omit<Revision, "id" | "createdAt">): Promise<Revision>;
  getRevision(id: string): Promise<Revision | undefined>;
  getRevisionByAnalysis(analysisId: string): Promise<Revision | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analyses: Map<string, Analysis>;
  private revisions: Map<string, Revision>;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.revisions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      provider: "email",
      improvementsUsed: 0,
      improvementsLimit: 3,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getOrCreateMockUser(userId: string): Promise<User> {
    let user = this.users.get(userId);
    if (!user) {
      user = {
        id: userId,
        username: "demo_user",
        email: "demo@jobmatchai.com",
        password: "mock",
        provider: "mock",
        improvementsUsed: 0,
        improvementsLimit: 3,
        createdAt: new Date(),
      };
      this.users.set(userId, user);
    }
    return user;
  }

  async updateUserImprovements(userId: string, used: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.improvementsUsed = used;
      this.users.set(userId, user);
    }
  }

  async createAnalysis(analysis: Omit<Analysis, "id" | "createdAt">): Promise<Analysis> {
    const id = randomUUID();
    const newAnalysis: Analysis = {
      ...analysis,
      id,
      createdAt: new Date(),
    };
    this.analyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getUserAnalyses(userId: string): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter((analysis) => analysis.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createRevision(revision: Omit<Revision, "id" | "createdAt">): Promise<Revision> {
    const id = randomUUID();
    const newRevision: Revision = {
      ...revision,
      id,
      createdAt: new Date(),
    };
    this.revisions.set(id, newRevision);
    return newRevision;
  }

  async getRevision(id: string): Promise<Revision | undefined> {
    return this.revisions.get(id);
  }

  async getRevisionByAnalysis(analysisId: string): Promise<Revision | undefined> {
    return Array.from(this.revisions.values()).find(
      (revision) => revision.analysisId === analysisId
    );
  }
}

export const storage = new MemStorage();

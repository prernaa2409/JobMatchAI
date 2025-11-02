import { type User, type InsertUser, type Analysis, type Revision } from "@shared/schema";
import { db } from "./db";
import { users, analyses, revisions } from "@shared/schema";
import { and, eq } from "drizzle-orm";

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

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getOrCreateMockUser(userId: string): Promise<User> {
    let user = await this.getUser(userId);
    if (!user) {
      user = await this.createUser({
        username: "demo_user",
        email: "demo@jobmatchai.com",
        password: "mock",
      });
    }
    return user;
  }

  async updateUserImprovements(userId: string, used: number): Promise<void> {
    await db.update(users)
      .set({ improvementsUsed: used })
      .where(eq(users.id, userId));
  }

  async createAnalysis(analysis: Omit<Analysis, "id" | "createdAt">): Promise<Analysis> {
    const [result] = await db.insert(analyses)
      .values(analysis)
      .returning();
    return result;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    const result = await db.select().from(analyses).where(eq(analyses.id, id));
    return result[0];
  }

  async getUserAnalyses(userId: string): Promise<Analysis[]> {
    return db.select()
      .from(analyses)
      .where(eq(analyses.userId, userId))
      .orderBy(analyses.createdAt);
  }

  async createRevision(revision: Omit<Revision, "id" | "createdAt">): Promise<Revision> {
    const [result] = await db.insert(revisions)
      .values(revision)
      .returning();
    return result;
  }

  async getRevision(id: string): Promise<Revision | undefined> {
    const result = await db.select().from(revisions).where(eq(revisions.id, id));
    return result[0];
  }

  async getRevisionByAnalysis(analysisId: string): Promise<Revision | undefined> {
    const result = await db.select()
      .from(revisions)
      .where(eq(revisions.analysisId, analysisId))
      .limit(1);
    return result[0];
  }
}

export const storage = new PostgresStorage();

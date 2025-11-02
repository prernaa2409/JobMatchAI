export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  improvementsUsed: number;
  improvementsLimit: number;
  provider: string;
  createdAt: string;
}

export interface Analysis {
  id: string;
  userId: string;
  title: string;
  content: string;
  score: number;
  keywordMatch: number;
  formatScore: number;
  contentScore: number;
  keywords: {
    found: string[];
    missing: string[];
  };
  suggestions: {
    content: string[];
    format: string[];
    keywords: string[];
  };
  improvedContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}
import { Analysis, User } from '@/types';

const API_BASE = '/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// Auth APIs
export async function login(email: string, password: string) {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(name: string, email: string, password: string) {
  return fetchWithAuth('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function logout() {
  return fetchWithAuth('/auth/logout', { method: 'POST' });
}

export async function getUser(): Promise<User> {
  return fetchWithAuth('/auth/me');
}

// Analysis APIs
export async function analyzeResume(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/analysis`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to analyze resume');
  }

  return response.json();
}

export async function getAnalyses(): Promise<Analysis[]> {
  return fetchWithAuth('/analysis');
}

export async function getAnalysis(id: string): Promise<Analysis> {
  return fetchWithAuth(`/analysis/${id}`);
}

export async function improveResume(id: string) {
  return fetchWithAuth(`/analysis/${id}/improve`, { method: 'POST' });
}

// User APIs
export async function updateUser(data: Partial<User>) {
  return fetchWithAuth('/user', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getUserQuota() {
  return fetchWithAuth('/user/quota');
}
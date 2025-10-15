// Mock authentication utilities
// TODO: Replace with actual NextAuth.js + Firebase Auth integration

export interface User {
  id: string;
  email: string;
  username: string;
}

export function getMockUser(): User | null {
  // For MVP, return a mock authenticated user
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('mockUser');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Auto-login for MVP demo
  const mockUser: User = {
    id: 'mock-user-id',
    email: 'demo@jobmatchai.com',
    username: 'demo_user',
  };
  
  localStorage.setItem('mockUser', JSON.stringify(mockUser));
  return mockUser;
}

export function login(email: string, password: string): User {
  // Mock login - TODO: Implement actual authentication
  const user: User = {
    id: 'mock-user-' + Date.now(),
    email,
    username: email.split('@')[0],
  };
  
  localStorage.setItem('mockUser', JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem('mockUser');
  window.location.href = '/';
}

export function isAuthenticated(): boolean {
  return getMockUser() !== null;
}

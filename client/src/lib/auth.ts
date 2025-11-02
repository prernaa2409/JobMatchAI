import { z } from "zod";

export interface User {
  id: string;
  email: string;
  username: string;
}

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function login(input: LoginInput): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  return data.user;
}

export function logout(): void {
  fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  }).finally(() => {
    window.location.href = '/';
  });
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return token !== null;
}

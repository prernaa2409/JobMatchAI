import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthProps {
  mode: "login" | "signup";
}

export default function Auth({ mode }: AuthProps) {
  const [, setLocation] = useLocation();
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        if (!username) {
          throw new Error("Username is required");
        }
        await signup(email, password, username);
      } else {
        await login(email, password);
      }
      setLocation("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    };
    
  };

  const handleOAuth = async (provider: string) => {
    try {
      window.location.href = `/api/auth/${provider}`;
    } catch (err) {
      setError("OAuth login is not available yet");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <h1 className="text-center font-display text-2xl font-bold">
                {mode === "login" ? "Welcome Back" : "Get Started Free"}
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your account to continue"
                  : "Create an account to start optimizing your resume"}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleOAuth("google")}
                  data-testid="button-oauth-google"
                  className="gap-2"
                >
                  <FaGoogle className="h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuth("github")}
                  data-testid="button-oauth-github"
                  className="gap-2"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  Or continue with email
                </span>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      data-testid="input-username"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-password"
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" data-testid="button-submit-auth" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    mode === "login" ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <Link href={mode === "login" ? "/signup" : "/login"}>
                  <span className="text-primary hover:underline cursor-pointer" data-testid="link-toggle-auth">
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </span>
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

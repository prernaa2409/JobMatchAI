import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition">
        JobMatchAI
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/analyze" className="text-muted-foreground hover:text-primary transition-colors">
          Analyze
        </Link>

        {!user ? (
          <>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
            <span className="text-sm text-muted-foreground">
              Hi, {user.username}
            </span>
          </>
        )}
      </nav>
    </header>
  );
}

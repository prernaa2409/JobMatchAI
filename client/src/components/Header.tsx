import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition">
        JobMatchAI
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/analyze" className="text-gray-700 hover:text-primary">
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
            <Link href="/result" className="text-gray-700 hover:text-primary">
              Results
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

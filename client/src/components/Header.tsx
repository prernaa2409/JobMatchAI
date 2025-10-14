import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, User } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
  showAuthButtons?: boolean;
}

export default function Header({ isAuthenticated = false, showAuthButtons = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/">
          <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer" data-testid="link-home">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">JobMatchAI</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {showAuthButtons && !isAuthenticated && (
            <>
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" data-testid="button-signup">Get Started</Button>
              </Link>
            </>
          )}
          
          {isAuthenticated && (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="button-dashboard">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="icon" data-testid="button-profile">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

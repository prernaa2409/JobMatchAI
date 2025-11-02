import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Brand Logo */}
        <Link href="/">
          <h1 className="cursor-pointer font-display text-2xl font-bold text-primary">
            JobMatchAI
          </h1>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-muted-foreground hover:text-foreground transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } absolute left-0 top-full w-full flex-col items-center gap-4 border-t border-border bg-background p-6 text-center lg:static lg:flex lg:w-auto lg:flex-row lg:gap-6 lg:border-none lg:p-0 lg:text-left`}
        >
          <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
            Pricing
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition">
            About
          </Link>
          
          {/* Authenticated / Non-Authenticated Buttons */}
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full lg:w-auto">
                  Dashboard
                </Button>
              </Link>
              <Button variant="destructive" className="w-full lg:w-auto">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="w-full lg:w-auto">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full lg:w-auto">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

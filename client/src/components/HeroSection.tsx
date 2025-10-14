import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary" data-testid="badge-ai-powered">
            <Sparkles className="h-4 w-4" />
            AI-Powered Resume Optimization
          </div>
          
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight lg:text-6xl" data-testid="text-hero-title">
            Beat the ATS.{" "}
            <span className="text-primary">Land Your Dream Job.</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground lg:text-xl" data-testid="text-hero-subtitle">
            Get instant AI-powered resume analysis and optimization. 
            Our advanced algorithms help you pass Applicant Tracking Systems 
            and stand out to recruiters.
          </p>
          
          <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2" data-testid="button-get-started-hero">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/analyze">
              <Button size="lg" variant="outline" data-testid="button-analyze-now">
                Analyze Resume
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>3 Free Improvements</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Instant ATS Score</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

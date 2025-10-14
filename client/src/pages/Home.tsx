import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Download, Shield, BarChart3, FileCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header isAuthenticated={false} />
      
      <HeroSection />

      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold lg:text-4xl">
              Powerful Features for Job Seekers
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to optimize your resume and land interviews
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="Instant Analysis"
              description="Get your ATS score in seconds with our AI-powered analysis engine. No waiting, instant results."
            />
            <FeatureCard
              icon={Target}
              title="Keyword Optimization"
              description="Identify missing keywords and optimize your resume for target roles and industries."
            />
            <FeatureCard
              icon={Download}
              title="Easy Export"
              description="Download your improved resume as a professional PDF instantly, ready to send."
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your resume is processed client-side. We never store your files on our servers."
            />
            <FeatureCard
              icon={BarChart3}
              title="Detailed Insights"
              description="Get comprehensive scoring across content, keywords, format, and experience."
            />
            <FeatureCard
              icon={FileCheck}
              title="ATS Compatible"
              description="Ensure your resume passes through Applicant Tracking Systems successfully."
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold lg:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to a better resume
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-8">
            {[
              {
                step: 1,
                title: "Upload Your Resume",
                description: "Upload your current resume in PDF, DOC, or TXT format. Our system will extract and analyze the content.",
              },
              {
                step: 2,
                title: "Get AI Analysis",
                description: "Receive instant feedback on your ATS score, keyword optimization, and areas for improvement.",
              },
              {
                step: 3,
                title: "Download Improved Version",
                description: "Apply AI suggestions and download your optimized resume, ready for job applications.",
              },
            ].map((item) => (
              <Card key={item.step} className="p-6 hover-elevate transition-all">
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold lg:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of job seekers who improved their resumes with AI
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2" data-testid="button-cta-bottom">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 JobMatchAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

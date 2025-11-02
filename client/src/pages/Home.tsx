import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap, Target, Download, Shield, BarChart3, FileCheck, ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    { icon: Zap, title: "Instant Analysis", description: "Get your ATS score in seconds with our AI-powered analysis engine. No waiting, instant results." },
    { icon: Target, title: "Keyword Optimization", description: "Identify missing keywords and optimize your resume for target roles and industries." },
    { icon: Download, title: "Easy Export", description: "Download your improved resume as a professional PDF instantly, ready to send." },
    { icon: Shield, title: "Privacy First", description: "Your resume is processed client-side. We never store your files on our servers." },
    { icon: BarChart3, title: "Detailed Insights", description: "Get comprehensive scoring across content, keywords, format, and experience." },
    { icon: FileCheck, title: "ATS Compatible", description: "Ensure your resume passes through Applicant Tracking Systems successfully." }
  ];

  const steps = [
    { step: 1, title: "Upload Your Resume", description: "Upload your current resume in PDF, DOC, or TXT format. Our system will extract and analyze the content." },
    { step: 2, title: "Get AI Analysis", description: "Receive instant feedback on your ATS score, keyword optimization, and areas for improvement." },
    { step: 3, title: "Download Improved Version", description: "Apply AI suggestions and download your optimized resume, ready for job applications." }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={false} />
      <HeroSection />

      {/* Features */}
      <section className="py-20 bg-card/30" id="features">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show"
            className="mb-4 font-display text-3xl font-bold lg:text-4xl">
            Powerful Features for Job Seekers
          </motion.h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Everything you need to optimize your resume and land interviews
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <FeatureCard icon={f.icon} title={f.title} description={f.description} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" id="how-it-works">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold lg:text-4xl">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-12">Three simple steps to a better resume</p>

          <div className="mx-auto max-w-4xl space-y-8">
            {steps.map(item => (
              <motion.div key={item.step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Card className="p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                  <div className="flex gap-6 items-start text-left">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
                      aria-label={`Step ${item.step}`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <motion.div
          className="container mx-auto px-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="mb-4 font-display text-3xl font-bold lg:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of job seekers who improved their resumes with AI
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="gap-2 hover:gap-3 transition-all duration-200"
              aria-label="Get started for free"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2024 JobMatchAI. All rights reserved.
      </footer>
    </div>
  );
}

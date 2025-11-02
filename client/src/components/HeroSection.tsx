"use client";

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import aiAnimation from "../assets/ai_resume.json"; // add a lottie file to src/assets/

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      <div className="container relative mx-auto flex flex-col items-center justify-between gap-12 px-6 lg:flex-row">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-2xl text-center lg:text-left"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            data-testid="badge-ai-powered"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Resume Optimization
          </div>

          <h1
            className="mb-6 font-display text-5xl font-bold leading-tight lg:text-6xl"
            data-testid="text-hero-title"
          >
            Beat the ATS.{" "}
            <span className="text-primary">Land Your Dream Job.</span>
          </h1>

          <p
            className="mb-8 text-lg text-muted-foreground lg:text-xl"
            data-testid="text-hero-subtitle"
          >
            Get instant AI-powered resume analysis and optimization.
            Our advanced algorithms help you pass Applicant Tracking Systems
            and stand out to recruiters.
          </p>

          <div className="mb-12 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2"
                data-testid="button-get-started-hero"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/analyze">
              <Button
                size="lg"
                variant="outline"
                data-testid="button-analyze-now"
              >
                Analyze Resume
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
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
        </motion.div>

        {/* RIGHT: Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-md"
        >
          <Lottie animationData={aiAnimation} loop />
        </motion.div>
      </div>
    </section>
  );
}

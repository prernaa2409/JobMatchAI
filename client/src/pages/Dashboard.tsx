import { useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import AnalysisCard from "@/components/AnalysisCard";
import QuotaIndicator from "@/components/QuotaIndicator";
import { Button } from "@/components/ui/button";
import { FileText, Zap, TrendingUp, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  // TODO: Remove mock data - fetch from API
  const [stats] = useState({
    totalAnalyses: 24,
    improvementsUsed: 1,
    improvementsTotal: 3,
    averageScore: 78,
  });

  const [analyses] = useState([
    { id: "1", date: "2 hours ago", score: 92, title: "Senior Developer Resume" },
    { id: "2", date: "1 day ago", score: 76, title: "Product Manager Resume" },
    { id: "3", date: "3 days ago", score: 58, title: "UX Designer Resume" },
    { id: "4", date: "1 week ago", score: 85, title: "Data Analyst Resume" },
    { id: "5", date: "2 weeks ago", score: 71, title: "Marketing Manager Resume" },
    { id: "6", date: "3 weeks ago", score: 88, title: "Full Stack Developer Resume" },
  ]);

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="mb-2 font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your resume analysis overview.</p>
          </div>
          <Link href="/analyze">
            <Button className="gap-2" size="lg" data-testid="button-new-analysis">
              <Plus className="h-5 w-5" />
              New Analysis
            </Button>
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={FileText}
            label="Total Analyses"
            value={stats.totalAnalyses}
            trend="+3 this week"
          />
          <StatsCard
            icon={Zap}
            label="Improvements Left"
            value={`${stats.improvementsTotal - stats.improvementsUsed}/${stats.improvementsTotal}`}
            trend="Resets in 12 days"
          />
          <StatsCard
            icon={TrendingUp}
            label="Average Score"
            value={`${stats.averageScore}%`}
            trend="+12% from last month"
          />
          <div className="md:col-span-2 lg:col-span-1">
            <QuotaIndicator
              used={stats.improvementsUsed}
              total={stats.improvementsTotal}
              showUpgrade={false}
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Recent Analyses</h2>
          <p className="text-sm text-muted-foreground">View and manage your resume analyses</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <AnalysisCard key={analysis.id} {...analysis} />
          ))}
        </div>
      </div>
    </div>
  );
}

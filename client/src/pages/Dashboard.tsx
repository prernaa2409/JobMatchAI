import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import AnalysisCard from "@/components/AnalysisCard";
import QuotaIndicator from "@/components/QuotaIndicator";
import { Button } from "@/components/ui/button";
import { FileText, Zap, TrendingUp, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: analyses = [] } = useQuery<any[]>({
    queryKey: ["/api/analyses"],
  });

  const { data: quota } = useQuery<any>({
    queryKey: ["/api/quota"],
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const stats = useMemo(() => {
    const avgScore = analyses.length > 0
      ? Math.round(analyses.reduce((sum: number, a: any) => sum + a.overallScore, 0) / analyses.length)
      : 0;

    return {
      totalAnalyses: analyses.length,
      improvementsUsed: quota?.used || 0,
      improvementsTotal: quota?.total || 3,
      averageScore: avgScore,
    };
  }, [analyses, quota]);

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

        {analyses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">No analyses yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first resume to get started
            </p>
            <Link href="/analyze">
              <Button>Analyze Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis: any) => (
              <AnalysisCard 
                key={analysis.id} 
                id={analysis.id}
                date={formatDate(analysis.createdAt)}
                score={analysis.overallScore}
                title="Resume Analysis"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

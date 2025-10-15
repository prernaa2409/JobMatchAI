import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ScoreCircle from "@/components/ScoreCircle";
import ProgressBar from "@/components/ProgressBar";
import KeywordBadge from "@/components/KeywordBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Sparkles, Download, ArrowLeft } from "lucide-react";

export default function AnalysisDetail() {
  const [, params] = useRoute("/analysis/:id");
  const analysisId = params?.id;

  const { data: analysis, isLoading } = useQuery<any>({
    queryKey: ["/api/analysis", analysisId],
    enabled: !!analysisId,
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading || !analysis) {
    return (
      <div className="min-h-screen">
        <Header isAuthenticated={true} />
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 -ml-3" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(analysis.createdAt)}</span>
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold">Resume Analysis</h1>
          <p className="text-muted-foreground">Detailed ATS scoring and improvement suggestions</p>
        </div>

        <div className="mb-8 flex justify-center">
          <ScoreCircle score={analysis.overallScore} size="lg" />
        </div>

        <Tabs defaultValue="scores" className="mb-8">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-analysis">
            <TabsTrigger value="scores" data-testid="tab-scores">Scores</TabsTrigger>
            <TabsTrigger value="keywords" data-testid="tab-keywords">Keywords</TabsTrigger>
            <TabsTrigger value="suggestions" data-testid="tab-suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Score Breakdown</h2>
                <p className="text-sm text-muted-foreground">
                  Detailed analysis of your resume across different categories
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProgressBar label="Content Quality" value={analysis.contentScore} />
                <ProgressBar label="Keyword Match" value={analysis.keywordScore} />
                <ProgressBar label="Format Score" value={analysis.formatScore} />
                <ProgressBar label="Experience" value={analysis.experienceScore} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Keyword Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  Keywords found in your resume and suggestions for improvement
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Present Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {((analysis.keywords as any)?.present || []).map((keyword: string) => (
                      <KeywordBadge key={keyword} keyword={keyword} present={true} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {((analysis.keywords as any)?.missing || []).map((keyword: string) => (
                      <KeywordBadge key={keyword} keyword={keyword} present={false} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Improvement Suggestions</h2>
                <p className="text-sm text-muted-foreground">
                  AI-generated recommendations to boost your ATS score
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {(analysis.suggestions as any[] || []).map((section: any, idx: number) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger data-testid={`accordion-${section.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {section.category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {section.items.map((item: string, itemIdx: number) => (
                            <li key={itemIdx} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="text-primary">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 flex gap-4 border-t border-border bg-background/95 py-4 backdrop-blur">
          <Link href={`/improve?id=${analysisId}`} className="flex-1">
            <Button className="w-full gap-2" size="lg" data-testid="button-improve-resume">
              <Sparkles className="h-5 w-5" />
              Improve Resume
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2" data-testid="button-download-report">
            <Download className="h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import QuotaIndicator from "@/components/QuotaIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Improve() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const analysisId = params.get("id");

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // TODO: Remove mock data
  const [quota] = useState({ used: 1, total: 3 });
  const [originalText] = useState(
    "Senior Software Engineer with 5 years of experience. Worked on multiple projects using React and Node.js. Managed teams and delivered features."
  );
  const [improvedText] = useState(
    "Results-driven Senior Software Engineer with 5+ years of expertise in architecting scalable web applications using React, TypeScript, and Node.js. Led cross-functional teams of 8+ engineers to deliver mission-critical features, improving application performance by 40% and reducing deployment time by 60% through implementation of CI/CD pipelines and containerization with Docker and Kubernetes."
  );

  const handleGenerate = async () => {
    if (quota.used >= quota.total) return;

    setIsGenerating(true);
    // TODO: Call actual API /api/improve
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 3000);
  };

  const handleDownload = () => {
    // TODO: Implement actual PDF generation with jsPDF or html2pdf
    console.log("Downloading improved resume as PDF");
  };

  const canGenerate = quota.used < quota.total && !hasGenerated;

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href={`/analysis/${analysisId}`}>
            <Button variant="ghost" className="gap-2 -ml-3" data-testid="button-back-analysis">
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-bold">Improve Resume</h1>
          <p className="text-muted-foreground">
            Generate an AI-enhanced version of your resume with optimized content
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-semibold">Resume Comparison</h2>
                    <p className="text-sm text-muted-foreground">
                      View original and AI-improved versions side by side
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="gap-2"
                    data-testid="button-generate-improvement"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Improvement
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!hasGenerated ? (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
                    <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">No Improvement Generated Yet</p>
                    <p className="text-sm text-muted-foreground">
                      Click "Generate Improvement" to create an AI-enhanced version
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue="comparison">
                    <TabsList className="grid w-full grid-cols-3" data-testid="tabs-resume">
                      <TabsTrigger value="original" data-testid="tab-original">Original</TabsTrigger>
                      <TabsTrigger value="improved" data-testid="tab-improved">Improved</TabsTrigger>
                      <TabsTrigger value="comparison" data-testid="tab-comparison">Side by Side</TabsTrigger>
                    </TabsList>

                    <TabsContent value="original" className="mt-4">
                      <div className="rounded-lg bg-muted/50 p-6">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{originalText}</pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="improved" className="mt-4">
                      <div className="rounded-lg bg-primary/5 p-6">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{improvedText}</pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="comparison" className="mt-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">Original</p>
                          <div className="rounded-lg bg-muted/50 p-4">
                            <pre className="whitespace-pre-wrap font-sans text-sm">{originalText}</pre>
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">Improved</p>
                          <div className="rounded-lg bg-primary/5 p-4">
                            <pre className="whitespace-pre-wrap font-sans text-sm">{improvedText}</pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <QuotaIndicator used={quota.used} total={quota.total} />

            {hasGenerated && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Download Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your improved resume as PDF
                  </p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2" onClick={handleDownload} data-testid="button-download-pdf">
                    <Download className="h-5 w-5" />
                    Download as PDF
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

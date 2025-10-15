import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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

  const { data: quota } = useQuery<any>({
    queryKey: ["/api/quota"],
  });

  const { data: analysis } = useQuery<any>({
    queryKey: ["/api/analysis", analysisId],
    enabled: !!analysisId,
  });

  const [improvedText, setImprovedText] = useState("");

  const improveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to improve resume");
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      setImprovedText(data.improvedText);
      queryClient.invalidateQueries({ queryKey: ["/api/quota"] });
    },
    onError: (error: any) => {
      alert(error.message || "Failed to improve resume. Please try again.");
    },
  });

  const handleGenerate = () => {
    if (!quota || quota.used >= quota.total) return;
    improveMutation.mutate();
  };

  const handleDownload = async () => {
    if (!improvedText) return;

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      
      // Split text into lines to fit page width
      const lines = doc.splitTextToSize(improvedText, maxWidth);
      
      // Add text to PDF
      doc.setFontSize(12);
      doc.text(lines, margin, margin);
      
      // Download PDF
      doc.save(`improved-resume-${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const canGenerate = quota && quota.used < quota.total && !improvedText;
  const originalText = analysis?.resumeText || "";
  const isGenerating = improveMutation.isPending;

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
                {!improvedText ? (
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
            <QuotaIndicator used={quota?.used || 0} total={quota?.total || 3} />

            {improvedText && (
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

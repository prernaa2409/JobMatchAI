import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";

export default function Analyze() {
  const [, setLocation] = useLocation();
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) return;

    setIsAnalyzing(true);
    
    // TODO: Replace with actual API call to /api/analyze
    setTimeout(() => {
      const mockAnalysisId = Math.random().toString(36).substring(7);
      setLocation(`/analysis/${mockAnalysisId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} />

      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-display text-4xl font-bold">Analyze Your Resume</h1>
            <p className="text-lg text-muted-foreground">
              Upload your resume to get instant ATS scoring and optimization suggestions
            </p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Upload Resume</h2>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload onFileSelect={setResumeText} />

              {resumeText && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="mb-2 text-sm font-medium">Preview</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {resumeText}
                  </p>
                </div>
              )}

              <Button
                className="w-full gap-2"
                size="lg"
                disabled={!resumeText || isAnalyzing}
                onClick={handleAnalyze}
                data-testid="button-analyze-submit"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <div className="rounded-lg bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Privacy Note:</strong> Your resume is processed
                  client-side and never stored on our servers. Only the analysis results are saved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

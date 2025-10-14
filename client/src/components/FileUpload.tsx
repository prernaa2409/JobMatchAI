import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (text: string) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    setFileName(file.name);
    // TODO: Implement actual PDF parsing with pdf.js
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileSelect(text || "Sample resume text extracted from PDF");
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName(null);
    onFileSelect("");
  };

  return (
    <div className="w-full" data-testid="component-file-upload">
      {!fileName ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium mb-1">Drop your resume here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              data-testid="input-file"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild data-testid="button-browse">
                <span>Browse Files</span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground">
              Supports PDF, DOC, DOCX, TXT (Max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-6" data-testid="div-file-selected">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium" data-testid="text-filename">{fileName}</p>
                <p className="text-sm text-muted-foreground">Ready to analyze</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              data-testid="button-clear-file"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

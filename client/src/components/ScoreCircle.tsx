import { useMemo } from "react";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ScoreCircle({ score, size = "md", showLabel = true }: ScoreCircleProps) {
  const sizeClasses = {
    sm: { wrapper: "h-24 w-24", text: "text-2xl", label: "text-xs" },
    md: { wrapper: "h-32 w-32", text: "text-3xl", label: "text-sm" },
    lg: { wrapper: "h-48 w-48", text: "text-5xl", label: "text-base" },
  };

  const scoreColor = useMemo(() => {
    if (score >= 80) return "text-chart-2";
    if (score >= 60) return "text-chart-3";
    return "text-destructive";
  }, [score]);

  const strokeColor = useMemo(() => {
    if (score >= 80) return "stroke-chart-2";
    if (score >= 60) return "stroke-chart-3";
    return "stroke-destructive";
  }, [score]);

  const scoreGrade = useMemo(() => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2" data-testid="component-score-circle">
      <div className={`relative ${sizeClasses[size].wrapper}`}>
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${strokeColor}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display font-bold ${sizeClasses[size].text} ${scoreColor}`} data-testid="text-score-value">
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`font-medium ${scoreColor} ${sizeClasses[size].label}`} data-testid="text-score-grade">
          {scoreGrade}
        </span>
      )}
    </div>
  );
}

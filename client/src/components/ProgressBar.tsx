import { useMemo } from "react";

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  label, 
  value, 
  maxValue = 100, 
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = (value / maxValue) * 100;
  
  const barColor = useMemo(() => {
    if (percentage >= 80) return "bg-chart-2";
    if (percentage >= 60) return "bg-chart-3";
    return "bg-destructive";
  }, [percentage]);

  return (
    <div className="space-y-2" data-testid={`progressbar-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" data-testid={`text-progress-label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground" data-testid={`text-progress-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, FileText, Award, Target } from "lucide-react";
import { Link } from "wouter";
import ScoreCircle from "./ScoreCircle";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AnalysisCardProps {
  id: string;
  date: string;
  score: number;
  title?: string;
  keywordMatch?: number;
  formatScore?: number;
  contentScore?: number;
  fileName?: string;
}

export default function AnalysisCard({ 
  id, 
  date, 
  score, 
  title = "Resume Analysis",
  keywordMatch = 0,
  formatScore = 0,
  contentScore = 0,
  fileName
}: AnalysisCardProps) {
  const scoreColor = score >= 80 ? "bg-chart-2/20 text-chart-2" : score >= 60 ? "bg-chart-3/20 text-chart-3" : "bg-destructive/20 text-destructive";

  const metrics = [
    { label: "Keyword Match", value: keywordMatch, icon: Target },
    { label: "Format Score", value: formatScore, icon: FileText },
    { label: "Content Score", value: contentScore, icon: Award }
  ];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all" data-testid={`card-analysis-${id}`}>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold line-clamp-1 cursor-help" data-testid={`text-analysis-title-${id}`}>
                    {title}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{fileName || title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-analysis-date-${id}`}>{date}</span>
            </div>
          </div>
          <Badge className={`${scoreColor} transition-colors duration-300`} data-testid={`badge-score-${id}`}>
            <TrendingUp className="mr-1 h-3 w-3" />
            {score}%
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <ScoreCircle score={score} size="md" showLabel={false} />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <TooltipProvider key={metric.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center space-y-2 cursor-help">
                      <metric.icon className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm font-medium">{metric.value}%</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{metric.label}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">View detailed {metric.label.toLowerCase()} analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Link href={`/analysis/${id}`} className="flex-1">
            <Button variant="outline" className="w-full" data-testid={`button-view-${id}`}>
              View Details
            </Button>
          </Link>
          <Link href={`/improve?id=${id}`} className="flex-1">
            <Button className="w-full" data-testid={`button-improve-${id}`}>
              Improve
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

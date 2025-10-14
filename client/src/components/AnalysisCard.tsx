import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import ScoreCircle from "./ScoreCircle";

interface AnalysisCardProps {
  id: string;
  date: string;
  score: number;
  title?: string;
}

export default function AnalysisCard({ id, date, score, title = "Resume Analysis" }: AnalysisCardProps) {
  const scoreColor = score >= 80 ? "bg-chart-2/20 text-chart-2" : score >= 60 ? "bg-chart-3/20 text-chart-3" : "bg-destructive/20 text-destructive";

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-analysis-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="space-y-1">
          <h3 className="font-semibold" data-testid={`text-analysis-title-${id}`}>{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-analysis-date-${id}`}>{date}</span>
          </div>
        </div>
        <Badge className={scoreColor} data-testid={`badge-score-${id}`}>
          <TrendingUp className="mr-1 h-3 w-3" />
          {score}%
        </Badge>
      </CardHeader>
      
      <CardContent className="flex justify-center py-6">
        <ScoreCircle score={score} size="md" showLabel={false} />
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
  );
}

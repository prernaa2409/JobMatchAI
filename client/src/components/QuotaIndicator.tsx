import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle } from "lucide-react";

interface QuotaIndicatorProps {
  used: number;
  total: number;
  showUpgrade?: boolean;
}

export default function QuotaIndicator({ used, total, showUpgrade = true }: QuotaIndicatorProps) {
  const remaining = total - used;
  const percentage = (used / total) * 100;

  return (
    <Card data-testid="card-quota">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Improvements</h3>
          </div>
          <Badge variant={remaining > 0 ? "default" : "destructive"} data-testid="badge-quota-remaining">
            {remaining}/{total} Left
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly Usage</span>
            <span className="font-medium" data-testid="text-quota-used">{used} used</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${
                percentage >= 100 ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {remaining === 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-destructive">No improvements left</p>
              <p className="text-xs text-destructive/80">Upgrade to continue improving resumes</p>
            </div>
          </div>
        )}

        {showUpgrade && (
          <Button className="w-full" variant={remaining === 0 ? "default" : "outline"} data-testid="button-upgrade">
            Upgrade to Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

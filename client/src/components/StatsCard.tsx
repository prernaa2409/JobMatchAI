import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
}

export default function StatsCard({ icon: Icon, label, value, trend }: StatsCardProps) {
  return (
    <Card data-testid={`card-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground" data-testid={`text-stat-label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid={`text-stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-stat-trend-${label.toLowerCase().replace(/\s+/g, '-')}`}>{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}

import StatsCard from '../StatsCard';
import { FileText, Zap, TrendingUp } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <StatsCard
        icon={FileText}
        label="Total Analyses"
        value="24"
        trend="+3 this week"
      />
      <StatsCard
        icon={Zap}
        label="Improvements Left"
        value="2/3"
        trend="Resets in 12 days"
      />
      <StatsCard
        icon={TrendingUp}
        label="Average Score"
        value="78%"
        trend="+12% from last month"
      />
    </div>
  );
}

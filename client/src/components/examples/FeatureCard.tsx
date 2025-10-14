import FeatureCard from '../FeatureCard';
import { Zap, Target, Download } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <FeatureCard
        icon={Zap}
        title="Instant Analysis"
        description="Get your ATS score in seconds with our AI-powered analysis engine."
      />
      <FeatureCard
        icon={Target}
        title="Keyword Optimization"
        description="Identify missing keywords and optimize your resume for target roles."
      />
      <FeatureCard
        icon={Download}
        title="Easy Export"
        description="Download your improved resume as a professional PDF instantly."
      />
    </div>
  );
}

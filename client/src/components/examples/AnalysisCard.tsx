import AnalysisCard from '../AnalysisCard';

export default function AnalysisCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <AnalysisCard 
        id="1" 
        date="2 hours ago" 
        score={92} 
        title="Senior Developer Resume"
      />
      <AnalysisCard 
        id="2" 
        date="1 day ago" 
        score={76} 
        title="Product Manager Resume"
      />
      <AnalysisCard 
        id="3" 
        date="3 days ago" 
        score={58} 
        title="UX Designer Resume"
      />
    </div>
  );
}

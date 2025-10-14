import KeywordBadge from '../KeywordBadge';

export default function KeywordBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2 p-6">
      <KeywordBadge keyword="React" present={true} />
      <KeywordBadge keyword="TypeScript" present={true} />
      <KeywordBadge keyword="Node.js" present={false} />
      <KeywordBadge keyword="Docker" present={false} />
      <KeywordBadge keyword="AWS" present={true} />
      <KeywordBadge keyword="GraphQL" present={false} />
    </div>
  );
}

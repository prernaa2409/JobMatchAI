import QuotaIndicator from '../QuotaIndicator';

export default function QuotaIndicatorExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl">
      <QuotaIndicator used={1} total={3} />
      <QuotaIndicator used={3} total={3} />
    </div>
  );
}

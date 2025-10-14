import ScoreCircle from '../ScoreCircle';

export default function ScoreCircleExample() {
  return (
    <div className="flex flex-wrap gap-12 p-8 items-center justify-center">
      <ScoreCircle score={92} size="lg" />
      <ScoreCircle score={75} size="md" />
      <ScoreCircle score={58} size="sm" />
    </div>
  );
}

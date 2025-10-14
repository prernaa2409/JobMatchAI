import ProgressBar from '../ProgressBar';

export default function ProgressBarExample() {
  return (
    <div className="space-y-6 p-6 max-w-md">
      <ProgressBar label="Content Quality" value={85} />
      <ProgressBar label="Keyword Match" value={72} />
      <ProgressBar label="Format Score" value={55} />
      <ProgressBar label="Experience" value={90} />
    </div>
  );
}

import Header from '../Header';

export default function HeaderExample() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Public Header (Not Authenticated)</p>
        <Header isAuthenticated={false} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Authenticated Header</p>
        <Header isAuthenticated={true} />
      </div>
    </div>
  );
}

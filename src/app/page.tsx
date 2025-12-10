export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Tool<span className="text-primary">radar</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, compare, and review the best software tools.
            Community-driven ratings you can trust.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <a
              href="/tools"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Browse Tools
            </a>
            <a
              href="/trending"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Trending
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

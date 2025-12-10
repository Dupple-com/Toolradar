import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              Tool<span className="text-primary">radar</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Community-driven tool discovery platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools" className="hover:text-foreground">All Tools</Link></li>
              <li><Link href="/trending" className="hover:text-foreground">Trending</Link></li>
              <li><Link href="/categories" className="hover:text-foreground">Categories</Link></li>
              <li><Link href="/compare" className="hover:text-foreground">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Companies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/company/submit" className="hover:text-foreground">Submit Tool</Link></li>
              <li><Link href="/company" className="hover:text-foreground">Company Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Toolradar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

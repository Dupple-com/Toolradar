import Link from "next/link";
import { RadarLogo } from "@/components/ui/radar-logo";

// Popular categories for SEO footer links - must match database slugs
const POPULAR_CATEGORIES = [
  { name: "Project Management", slug: "project-management" },
  { name: "Developer Tools", slug: "developer-tools" },
  { name: "Marketing", slug: "marketing" },
  { name: "Design", slug: "design" },
  { name: "Communication", slug: "communication" },
  { name: "Analytics", slug: "analytics" },
  { name: "Productivity", slug: "productivity" },
  { name: "AI & Automation", slug: "ai-automation" },
];

// Popular "Best of" pages - must match database slugs
const BEST_OF_PAGES = [
  { name: "Best Project Management", slug: "project-management" },
  { name: "Best Marketing Tools", slug: "marketing" },
  { name: "Best Design Software", slug: "design" },
  { name: "Best Developer Tools", slug: "developer-tools" },
  { name: "Best AI Tools", slug: "ai-automation" },
  { name: "Best Analytics Tools", slug: "analytics" },
];

// Tools for use cases
const USE_CASE_PAGES = [
  { name: "Tools for Startups", slug: "startups" },
  { name: "Tools for Enterprises", slug: "enterprises" },
  { name: "Tools for Freelancers", slug: "freelancers" },
  { name: "Tools for Teams", slug: "teams" },
  { name: "Tools for Students", slug: "students" },
  { name: "Tools for Remote Work", slug: "remote" },
];

// Popular comparisons
const POPULAR_COMPARISONS = [
  { name: "Slack vs Teams", slug: "slack-vs-microsoft-teams" },
  { name: "Notion vs Asana", slug: "notion-vs-asana" },
  { name: "Figma vs Adobe XD", slug: "figma-vs-adobe-xd" },
  { name: "GitHub vs GitLab", slug: "github-vs-gitlab" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* SEO Links Section */}
        <div className="mb-12 pb-12 border-b border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Popular Categories */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Categories</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {POPULAR_CATEGORIES.slice(0, 6).map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/categories/${cat.slug}`} className="hover:text-white transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors text-primary">
                    All categories →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Best of Lists */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Best Software</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {BEST_OF_PAGES.slice(0, 5).map((page) => (
                  <li key={page.slug}>
                    <Link href={`/best/${page.slug}`} className="hover:text-white transition-colors">
                      {page.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/best" className="hover:text-white transition-colors text-primary">
                    All best lists →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools for Use Cases */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Tools For</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {USE_CASE_PAGES.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/tools/for/${page.slug}`} className="hover:text-white transition-colors">
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Comparisons */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Compare</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {POPULAR_COMPARISONS.map((comp) => (
                  <li key={comp.slug}>
                    <Link href={`/compare/${comp.slug}`} className="hover:text-white transition-colors">
                      {comp.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/compare" className="hover:text-white transition-colors text-primary">
                    All comparisons →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Browse by Pricing */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">By Pricing</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/tools/free" className="hover:text-white transition-colors">
                    Free Tools
                  </Link>
                </li>
                <li>
                  <Link href="/tools/freemium" className="hover:text-white transition-colors">
                    Freemium Tools
                  </Link>
                </li>
                <li>
                  <Link href="/tools/paid" className="hover:text-white transition-colors">
                    Paid Software
                  </Link>
                </li>
                <li>
                  <Link href="/alternatives" className="hover:text-white transition-colors">
                    Alternatives
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Discover</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/trending" className="hover:text-white transition-colors">
                    Trending Tools
                  </Link>
                </li>
                <li>
                  <Link href="/review" className="hover:text-white transition-colors">
                    Write a Review
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className="hover:text-white transition-colors">
                    Submit Your Tool
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-white transition-colors text-primary">
                    Browse all tools →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <RadarLogo className="w-9 h-9" color="white" />
              <span className="font-normal text-xl" style={{ fontFamily: '"Funnel Display", sans-serif' }}>Toolradar</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The community-driven platform for discovering and reviewing the best software tools for your business.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Browse</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/tools" className="hover:text-white transition-colors">All Tools</Link></li>
              <li><Link href="/trending" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Companies</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/vendors" className="hover:text-white transition-colors">List Your Product</Link></li>
              <li><Link href="/company" className="hover:text-white transition-colors">Company Dashboard</Link></li>
              <li><Link href="/company/badges" className="hover:text-white transition-colors">Badges & Widgets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Toolradar. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

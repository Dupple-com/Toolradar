import Link from "next/link";
import { RadarLogo } from "@/components/ui/radar-logo";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <RadarLogo className="w-9 h-9" color="white" />
              <span className="font-bold text-xl">Toolradar</span>
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

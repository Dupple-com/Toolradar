"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for tools, categories, or features..."
          className="w-full pl-14 pr-32 py-4 text-lg bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 text-slate-900"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
        >
          Search
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
        <span>Popular:</span>
        <button type="button" onClick={() => router.push('/search?q=AI')} className="hover:text-slate-600 transition-colors">AI</button>
        <span>·</span>
        <button type="button" onClick={() => router.push('/search?q=productivity')} className="hover:text-slate-600 transition-colors">Productivity</button>
        <span>·</span>
        <button type="button" onClick={() => router.push('/search?q=design')} className="hover:text-slate-600 transition-colors">Design</button>
        <span>·</span>
        <button type="button" onClick={() => router.push('/search?q=marketing')} className="hover:text-slate-600 transition-colors">Marketing</button>
      </div>
    </form>
  );
}

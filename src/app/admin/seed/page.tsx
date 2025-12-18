"use client";

import { useState } from "react";

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const runSeed = async () => {
    if (!confirm("Run the seed? This will create/update tools and categories.")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Database Seed</h1>
        <p className="text-muted-foreground">Populate the database with mainstream tools</p>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-4">
        <div>
          <h2 className="font-semibold mb-2">What this does:</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Creates 20 categories (Project Management, AI, Design, etc.)</li>
            <li>Creates 40+ mainstream tools (Notion, Slack, Figma, etc.)</li>
            <li>Creates companies for each tool (unclaimed, ready to be claimed)</li>
            <li>Updates existing tools with new logos and sets status to published</li>
          </ul>
        </div>

        <button
          onClick={runSeed}
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Running seed..." : "Run Seed"}
        </button>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {result.success ? (
              <p>{result.message}</p>
            ) : (
              <p>Error: {result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

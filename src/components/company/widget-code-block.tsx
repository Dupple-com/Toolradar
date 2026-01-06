"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface WidgetCodeBlockProps {
  toolSlug: string;
  toolName: string;
}

export function WidgetCodeBlock({ toolSlug, toolName }: WidgetCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<"default" | "dark" | "blue" | "minimal">("default");

  const styleParam = style === "default" ? "" : `?style=${style}`;
  const code = `<a href="https://toolradar.com/tools/${toolSlug}" target="_blank" rel="noopener">
  <img src="https://toolradar.com/api/widget/${toolSlug}${styleParam}" alt="${toolName} on Toolradar" width="160" height="56" />
</a>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Style Selector */}
      <div className="flex gap-2">
        {(["default", "dark", "blue", "minimal"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              style === s
                ? "bg-primary text-white border-primary"
                : "bg-white hover:bg-muted border-gray-200"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>

      {copied && (
        <p className="text-sm text-green-600">Copied to clipboard!</p>
      )}
    </div>
  );
}

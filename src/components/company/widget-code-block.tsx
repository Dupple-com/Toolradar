"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface WidgetCodeBlockProps {
  toolSlug: string;
  toolName: string;
}

const formats = {
  badge: { width: 150, height: 160, label: "Badge" },
  bar: { width: 280, height: 60, label: "Horizontal" },
  compact: { width: 120, height: 120, label: "Compact" },
  minimal: { width: 160, height: 40, label: "Minimal" },
};

export function WidgetCodeBlock({ toolSlug, toolName }: WidgetCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<keyof typeof formats>("badge");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const f = formats[format];
  const params = new URLSearchParams();
  params.set("format", format);
  if (theme === "dark") params.set("theme", "dark");

  const code = `<a href="https://toolradar.com/tools/${toolSlug}" target="_blank" rel="noopener">
  <img src="https://toolradar.com/api/widget/${toolSlug}?${params.toString()}" alt="${toolName} on Toolradar" width="${f.width}" height="${f.height}" />
</a>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Format Selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(formats) as Array<keyof typeof formats>).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              format === f
                ? "bg-primary text-white border-primary"
                : "bg-white hover:bg-muted border-gray-200"
            }`}
          >
            {formats[f].label}
          </button>
        ))}
        <span className="border-l mx-2" />
        {(["light", "dark"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              theme === t
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white hover:bg-muted border-gray-200"
            }`}
          >
            {t === "light" ? "Light" : "Dark"}
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

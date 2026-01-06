"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BadgeCardProps {
  badge: {
    type: string;
    year: number;
    toolSlug: string;
    toolName: string;
  };
  info: {
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
  };
}

export function BadgeCard({ badge, info }: BadgeCardProps) {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<"default" | "compact" | "dark">("default");

  const Icon = info.icon;

  const badgeUrl = `https://toolradar.com/api/badge/${badge.toolSlug}?type=${badge.type}&year=${badge.year}${style !== "default" ? `&style=${style}` : ""}`;
  const toolUrl = `https://toolradar.com/tools/${badge.toolSlug}`;

  const embedCode = `<a href="${toolUrl}" target="_blank" rel="noopener">
  <img src="${badgeUrl}" alt="${badge.toolName} - ${info.label} ${badge.year}" />
</a>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border p-4 ${info.bgColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white shadow-sm`}>
            <Icon className={`w-5 h-5 ${info.color}`} />
          </div>
          <div>
            <p className="font-semibold">{info.label}</p>
            <p className="text-xs text-muted-foreground">{badge.year}</p>
          </div>
        </div>
        <a
          href={toolUrl}
          target="_blank"
          rel="noopener"
          className="text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Badge Preview */}
      <div className="bg-white rounded-lg p-3 mb-4 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeUrl}
          alt={`${badge.toolName} - ${info.label}`}
          className="max-h-24"
        />
      </div>

      {/* Style Selector */}
      <div className="flex gap-2 mb-3">
        {(["default", "compact", "dark"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              style === s
                ? "bg-white border-gray-300 font-medium"
                : "bg-transparent border-transparent hover:bg-white/50"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Embed Code
          </>
        )}
      </button>
    </div>
  );
}

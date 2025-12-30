"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToolLogoProps {
  src: string | null;
  name: string;
  className?: string;
}

// Generate a consistent color based on name
function getColorFromName(name: string): string {
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-emerald-500 to-emerald-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-cyan-500 to-cyan-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "bg-gradient-to-br from-rose-500 to-rose-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Extract domain from various logo URL formats
function extractDomain(src: string): string | null {
  // Clearbit: https://logo.clearbit.com/domain.com
  const clearbitMatch = src.match(/logo\.clearbit\.com\/([^/?]+)/);
  if (clearbitMatch) return clearbitMatch[1];

  // Google favicon: https://www.google.com/s2/favicons?domain=domain.com
  const googleMatch = src.match(/domain=([^&]+)/);
  if (googleMatch) return googleMatch[1];

  // Simple Icons or other CDN - try to extract from URL
  try {
    const url = new URL(src);
    // If it's a CDN, the domain might be in the path
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart.includes('.')) return lastPart;
    }
  } catch {}

  return null;
}

function Fallback({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-white font-semibold",
        getColorFromName(name),
        className
      )}
    >
      <span className="text-lg">{name[0]?.toUpperCase()}</span>
    </div>
  );
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  const [fallbackLevel, setFallbackLevel] = useState(0);
  // 0 = original src, 1 = unavatar, 2 = letter fallback

  // No src = show letter fallback
  if (!src) {
    return <Fallback name={name} className={className} />;
  }

  // All fallbacks failed = show letter fallback
  if (fallbackLevel >= 2) {
    return <Fallback name={name} className={className} />;
  }

  // Determine current image URL
  let currentSrc = src;
  if (fallbackLevel === 1) {
    const domain = extractDomain(src);
    if (domain) {
      currentSrc = `https://unavatar.io/${domain}?fallback=false`;
    } else {
      // Can't extract domain, skip to letter fallback
      return <Fallback name={name} className={className} />;
    }
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-white",
        className
      )}
    >
      <img
        src={currentSrc}
        alt={name}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={() => setFallbackLevel((prev) => prev + 1)}
      />
    </div>
  );
}

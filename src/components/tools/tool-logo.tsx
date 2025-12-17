"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolLogoProps {
  src: string | null;
  name: string;
  className?: string;
}

// Generate a consistent color based on name
function getColorFromName(name: string): string {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-emerald-500 to-emerald-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
    "from-rose-500 to-rose-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fallback = (
    <div
      className={cn(
        "bg-gradient-to-br flex items-center justify-center text-white font-semibold",
        getColorFromName(name),
        className
      )}
    >
      <span className="text-lg">{name[0].toUpperCase()}</span>
    </div>
  );

  if (!src || error) {
    return fallback;
  }

  return (
    <div className={cn("relative bg-white flex items-center justify-center overflow-hidden", className)}>
      {!loaded && (
        <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center text-white font-semibold", getColorFromName(name))}>
          <span className="text-lg">{name[0].toUpperCase()}</span>
        </div>
      )}
      <img
        src={src}
        alt={name}
        className={cn("w-full h-full object-contain p-1", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

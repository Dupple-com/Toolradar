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
  const [hasError, setHasError] = useState(false);

  // No src or error loading = show fallback
  if (!src || hasError) {
    return <Fallback name={name} className={className} />;
  }

  // With src = show image with white background
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-white",
        className
      )}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

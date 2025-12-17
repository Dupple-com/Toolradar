"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolLogoProps {
  src: string | null;
  name: string;
  className?: string;
}

export function ToolLogo({ src, name, className }: ToolLogoProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-inner",
          className
        )}
      >
        {name[0].toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("bg-white flex items-center justify-center overflow-hidden p-1.5 border border-slate-100", className)}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}

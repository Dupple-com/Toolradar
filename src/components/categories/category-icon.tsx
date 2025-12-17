"use client";

import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Folder } from "lucide-react";

interface CategoryIconProps {
  icon?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function CategoryIcon({ icon, size = "md", className = "" }: CategoryIconProps) {
  if (!icon) {
    return <Folder className={`${sizeClasses[size]} ${className}`} />;
  }

  // Check if it's an emoji (not a valid Lucide icon name - icons are lowercase with dashes)
  const isLucideIcon = /^[a-z0-9-]+$/.test(icon);

  if (!isLucideIcon) {
    // It's an emoji or other non-icon text
    return <span className={className}>{icon}</span>;
  }

  // It's a Lucide icon name
  return (
    <DynamicIcon
      name={icon}
      className={`${sizeClasses[size]} ${className}`}
      fallback={<Folder className={`${sizeClasses[size]} ${className}`} />}
    />
  );
}

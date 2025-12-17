"use client";

import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import { memo } from "react";

interface DynamicIconProps extends Omit<LucideProps, "ref"> {
  name: string;
  fallback?: React.ReactNode;
}

const iconCache = new Map<string, React.ComponentType<LucideProps>>();

function DynamicIconComponent({ name, fallback, ...props }: DynamicIconProps) {
  // Convert kebab-case to the format expected by lucide
  const iconName = name as keyof typeof dynamicIconImports;

  if (!dynamicIconImports[iconName]) {
    // Return fallback or a default icon
    return fallback ? <>{fallback}</> : <span className="w-5 h-5" />;
  }

  // Check cache first
  let Icon = iconCache.get(name);

  if (!Icon) {
    Icon = dynamic(dynamicIconImports[iconName], {
      loading: () => <span className="w-5 h-5 animate-pulse bg-muted rounded" />,
    });
    iconCache.set(name, Icon);
  }

  return <Icon {...props} />;
}

export const DynamicIcon = memo(DynamicIconComponent);

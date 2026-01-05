"use client";

import { ExternalLink } from "lucide-react";

interface TrackedLinkProps {
  toolId: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export function TrackedLink({ toolId, href, className, children }: TrackedLinkProps) {
  const handleClick = () => {
    // Track the click
    fetch("/api/analytics/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId }),
    }).catch(() => {
      // Silently fail
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children || (
        <>
          Visit Website <ExternalLink size={16} />
        </>
      )}
    </a>
  );
}

"use client";

import { useEffect } from "react";

interface ComparisonTrackerProps {
  toolIds: string[];
}

export function ComparisonTracker({ toolIds }: ComparisonTrackerProps) {
  useEffect(() => {
    // Only track once per page load
    const trackComparison = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "comparison", toolIds }),
        });
      } catch {
        // Silently fail - tracking shouldn't break the page
      }
    };

    if (toolIds.length >= 2) {
      trackComparison();
    }
  }, [toolIds]);

  return null;
}

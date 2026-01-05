"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  toolId: string;
}

export function ViewTracker({ toolId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return;
    tracked.current = true;

    // Track the view
    fetch("/api/analytics/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the page
    });
  }, [toolId]);

  return null;
}

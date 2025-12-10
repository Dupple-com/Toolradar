"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VoteButtonProps {
  toolId: string;
  initialVotes: number;
}

export function VoteButton({ toolId, initialVotes }: VoteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId }),
    });

    if (res.ok) {
      const data = await res.json();
      setVotes(data.votes);
      setHasVoted(data.voted);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      className={`flex flex-col items-center px-4 py-3 rounded-xl border transition ${
        hasVoted
          ? "bg-primary/10 border-primary text-primary"
          : "hover:bg-muted"
      }`}
    >
      <svg
        className={`w-5 h-5 ${hasVoted ? "fill-current" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      <span className="font-bold text-lg">{votes}</span>
      <span className="text-xs text-muted-foreground">votes</span>
    </button>
  );
}

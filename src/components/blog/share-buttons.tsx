"use client";

import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Link2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      items.push({ id, text, level });
    }

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  // Only show h2 headings for cleaner TOC
  const mainHeadings = headings.filter(h => h.level === 2);

  return (
    <nav className="bg-white rounded-xl border p-5">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
        <List className="w-4 h-4" />
        Table of Contents
      </h3>
      <ul className="space-y-1 text-sm">
        {mainHeadings.map(({ id, text }, index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`flex items-start gap-2 py-1.5 px-2 rounded-md transition-colors ${
                activeId === id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className={`flex-shrink-0 w-5 h-5 rounded text-xs flex items-center justify-center ${
                activeId === id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              }`}>
                {index + 1}
              </span>
              <span className="line-clamp-2">{text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

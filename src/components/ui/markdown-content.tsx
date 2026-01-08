"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Pre-process content to convert inline list patterns to proper markdown
function preprocessMarkdown(content: string): string {
  // Convert inline lists like " - **Item**:" to proper markdown lists
  let processed = content
    // Add line breaks before list items that are inline
    .replace(/([.!?:]) - \*\*/g, '$1\n\n- **')
    // Also handle cases without punctuation before
    .replace(/([a-z]) - \*\*/g, '$1\n\n- **')
    // Handle numbered list patterns inline
    .replace(/([.!?:]) (\d+)\. /g, '$1\n\n$2. ')
    // Ensure double line breaks for paragraph separation
    .replace(/\n\n\n+/g, '\n\n');

  return processed;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  const processedContent = preprocessMarkdown(content);

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => (
            <p className="text-muted-foreground mb-4 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li>{children}</li>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline">{children}</a>
          ),
          h3: ({ children }) => (
            <h3 className="font-semibold text-foreground mt-4 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-medium text-foreground mt-3 mb-2">{children}</h4>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Simplified version for single paragraphs (FAQ answers, etc.)
export function MarkdownParagraph({ content, className = "" }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <span className={className}>{children}</span>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-primary hover:underline">{children}</a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

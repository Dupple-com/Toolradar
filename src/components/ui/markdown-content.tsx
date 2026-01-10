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
            <p className="text-gray-700 mb-5 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">{children}</a>
          ),
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mt-10 mb-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2">{children}</h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">{children}</blockquote>
          ),
          hr: () => (
            <div className="my-10 flex items-center justify-center">
              <div className="w-16 h-1 bg-gray-200 rounded-full" />
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse rounded-lg overflow-hidden">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">{children}</td>
          ),
        }}
      >
        {processedContent}
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

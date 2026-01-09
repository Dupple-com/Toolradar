import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import { BlogPost, BlogCategory } from "@prisma/client";

interface BlogPostCardProps {
  post: BlogPost & { category: BlogCategory | null };
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-xl border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
        {post.featuredImage ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary/30" />
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {post.category && (
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 w-fit"
              style={{
                backgroundColor: `${post.category.color || '#3b82f6'}15`,
                color: post.category.color || '#3b82f6'
              }}
            >
              {post.category.name}
            </span>
          )}

          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t">
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min
              </span>
            )}
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

import Link from "next/link";
import { BlogCategory } from "@prisma/client";

interface BlogCategoryBadgeProps {
  category: BlogCategory;
  count?: number;
  active?: boolean;
}

export function BlogCategoryBadge({ category, count, active }: BlogCategoryBadgeProps) {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-white border hover:border-primary hover:text-primary"
      }`}
      style={
        active
          ? {}
          : {
              borderColor: `${category.color || '#e2e8f0'}50`,
            }
      }
    >
      <span>{category.name}</span>
      {count !== undefined && (
        <span className={`text-xs ${active ? "text-white/70" : "text-muted-foreground"}`}>
          ({count})
        </span>
      )}
    </Link>
  );
}

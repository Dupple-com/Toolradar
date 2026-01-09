import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { ArrowLeft, Tag } from "lucide-react";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogCategoryBadge } from "@/components/blog/blog-category-badge";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.blogCategory.findMany({
      select: { slug: true },
    });
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    // Return empty array if DB is unavailable during build
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Articles | Toolradar Blog`,
    description: category.description || `Browse all ${category.name} articles on Toolradar Blog. Expert insights and guides.`,
    openGraph: {
      title: `${category.name} | Toolradar Blog`,
      description: category.description || `${category.name} articles and guides`,
      url: `https://toolradar.com/blog/category/${category.slug}`,
      siteName: "Toolradar",
      type: "website",
    },
    alternates: {
      canonical: `https://toolradar.com/blog/category/${category.slug}`,
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const [category, allCategories] = await Promise.all([
    prisma.blogCategory.findUnique({
      where: { slug: params.slug },
      include: {
        posts: {
          where: { status: "published" },
          orderBy: { publishedAt: "desc" },
          include: { category: true },
        },
        _count: { select: { posts: { where: { status: "published" } } } },
      },
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: { where: { status: "published" } } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!category) notFound();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: category.name, url: `/blog/category/${category.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All articles
            </Link>

            <div className="flex items-center gap-3 mb-4">
              {category.color && (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Tag className="w-6 h-6" style={{ color: category.color }} />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{category.name}</h1>
                <p className="text-muted-foreground mt-1">
                  {category._count.posts} article{category._count.posts !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {category.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mt-4">
                {category.description}
              </p>
            )}
          </div>
        </section>

        {/* Other Categories */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="px-4 py-2 bg-white border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              All Posts
            </Link>
            {allCategories.map((cat) => (
              <BlogCategoryBadge
                key={cat.id}
                category={cat}
                count={cat._count.posts}
                active={cat.id === category.id}
              />
            ))}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          {category.posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <Tag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No articles yet</h3>
              <p className="text-muted-foreground mb-4">
                Check back soon for articles in this category.
              </p>
              <Link href="/blog" className="text-primary font-medium hover:underline">
                Browse all articles
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

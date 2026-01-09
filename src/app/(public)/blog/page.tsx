import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { BookOpen, TrendingUp, Clock, ArrowRight, Tag } from "lucide-react";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogCategoryBadge } from "@/components/blog/blog-category-badge";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Software Insights, Guides & Trends | Toolradar",
  description: "Discover the latest insights, guides, and trends in software. Expert articles on productivity tools, AI, SaaS, and technology to help you make better software decisions.",
  keywords: "software blog, SaaS insights, productivity tips, AI tools, technology trends, software reviews",
  openGraph: {
    title: "Toolradar Blog | Software Insights & Trends",
    description: "Expert articles on productivity tools, AI, SaaS, and technology trends.",
    url: "https://toolradar.com/blog",
    siteName: "Toolradar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolradar Blog",
    description: "Software insights, guides & trends",
  },
  alternates: {
    canonical: "https://toolradar.com/blog",
  },
};

export default async function BlogPage() {
  const [posts, categories, featuredPost] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 12,
      include: { category: true },
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: { where: { status: "published" } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.blogPost.findFirst({
      where: { status: "published" },
      orderBy: { views: "desc" },
      include: { category: true },
    }),
  ]);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Toolradar Blog",
    description: "Software insights, guides, and trends from Toolradar",
    url: "https://toolradar.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Toolradar",
      url: "https://toolradar.com",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://toolradar.com/blog/${post.slug}`,
      datePublished: post.publishedAt?.toISOString(),
      description: post.excerpt,
    })),
  };

  const regularPosts = featuredPost
    ? posts.filter(p => p.id !== featuredPost.id)
    : posts;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={blogJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">Blog</h1>
                <p className="text-muted-foreground mt-1">
                  Software insights, guides & trends
                </p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mt-4">
              Stay ahead with the latest articles on productivity tools, AI innovations,
              SaaS trends, and expert guides to help you choose the right software.
            </p>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Browse by topic</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <BlogCategoryBadge
                  key={category.id}
                  category={category}
                  count={category._count.posts}
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Post */}
        {featuredPost && (
          <section className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Featured</span>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPost.featuredImage ? (
                    <div className="aspect-[16/9] md:aspect-auto md:h-full relative overflow-hidden">
                      <img
                        src={featuredPost.featuredImage}
                        alt={featuredPost.featuredImageAlt || featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] md:aspect-auto md:h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    {featuredPost.category && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 w-fit"
                        style={{
                          backgroundColor: `${featuredPost.category.color || '#3b82f6'}15`,
                          color: featuredPost.category.color || '#3b82f6'
                        }}
                      >
                        {featuredPost.category.name}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {featuredPost.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readingTime} min read
                        </span>
                      )}
                      {featuredPost.publishedAt && (
                        <span>
                          {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-primary font-medium">
                      Read article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Recent Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Latest Articles</h2>
          </div>

          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No articles yet</h3>
              <p className="text-muted-foreground">
                Check back soon for the latest software insights and guides.
              </p>
            </div>
          )}
        </section>

      </div>
    </>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { Clock, Calendar, ArrowLeft, Share2, ChevronRight, User, Tag } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    // Return empty array if DB is unavailable during build
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!post) return { title: "Post Not Found" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title: `${title} | Toolradar Blog`,
    description,
    keywords: post.tags.join(", "),
    authors: post.authorName ? [{ name: post.authorName }] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      url: `https://toolradar.com/blog/${post.slug}`,
      siteName: "Toolradar",
      images: post.featuredImage
        ? [{ url: post.featuredImage, alt: post.featuredImageAlt || title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `https://toolradar.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: "published" },
    include: { category: true },
  });

  if (!post) notFound();

  // Get related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "published",
      id: { not: post.id },
      OR: [
        { categoryId: post.categoryId },
        { tags: { hasSome: post.tags } },
      ],
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  // Increment view count
  prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => {}); // Fire and forget

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category ? [{ name: post.category.name, url: `/blog/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.authorName
      ? {
          "@type": "Person",
          name: post.authorName,
        }
      : {
          "@type": "Organization",
          name: "Toolradar",
        },
    publisher: {
      "@type": "Organization",
      name: "Toolradar",
      url: "https://toolradar.com",
      logo: {
        "@type": "ImageObject",
        url: "https://toolradar.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://toolradar.com/blog/${post.slug}`,
    },
    wordCount: post.wordCount,
    articleSection: post.category?.name,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />

      <article className="min-h-screen">
        {/* Hero */}
        <header className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-2">
              <Link href="/blog" className="hover:text-primary transition flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Blog
              </Link>
              {post.category && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Link
                    href={`/blog/category/${post.category.slug}`}
                    className="hover:text-primary transition"
                  >
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>

            {/* Category badge */}
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{
                  backgroundColor: `${post.category.color || '#3b82f6'}15`,
                  color: post.category.color || '#3b82f6'
                }}
              >
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.authorName && (
                <div className="flex items-center gap-2">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <span className="font-medium text-foreground">{post.authorName}</span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
              {post.readingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="max-w-5xl mx-auto px-4 pb-8">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <div className="min-w-0">
              <div className="bg-white rounded-2xl border p-6 md:p-10">
                <MarkdownContent content={post.content} className="prose prose-lg max-w-none" />
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 p-6 bg-white rounded-xl border">
                <div className="flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share this article
                  </span>
                  <ShareButtons
                    url={`https://toolradar.com/blog/${post.slug}`}
                    title={post.title}
                  />
                </div>
              </div>

              {/* Author bio */}
              {post.authorName && post.authorBio && (
                <div className="mt-8 p-6 bg-white rounded-xl border">
                  <div className="flex items-start gap-4">
                    {post.authorImage ? (
                      <img
                        src={post.authorImage}
                        alt={post.authorName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Written by</p>
                      <h3 className="font-semibold text-lg">{post.authorName}</h3>
                      <p className="text-muted-foreground mt-2">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <TableOfContents content={post.content} />

                {/* Related Tools */}
                {post.relatedTools.length > 0 && (
                  <div className="bg-white rounded-xl border p-5">
                    <h3 className="font-semibold mb-4">Tools mentioned</h3>
                    <div className="space-y-2">
                      {post.relatedTools.map((toolSlug) => (
                        <Link
                          key={toolSlug}
                          href={`/tools/${toolSlug}`}
                          className="block px-3 py-2 rounded-lg hover:bg-muted transition text-sm"
                        >
                          {toolSlug}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}

      </article>
    </>
  );
}

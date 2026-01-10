import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Clock, Calendar, ArrowLeft, ChevronRight } from "lucide-react";

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
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Toolradar Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: "published" },
    include: { category: true },
  });

  if (!post) notFound();

  return (
    <article className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
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

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border p-6 md:p-10">
          <p>Content length: {post.content?.length || 0} characters</p>
        </div>
      </div>
    </article>
  );
}

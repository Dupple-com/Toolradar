import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

// GET: List blog posts (public for published, admin for all)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "published";
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Only admins can see non-published posts
  if (status !== "published") {
    const authResult = await requireAdmin();
    if ("error" in authResult) return authResult.error;
  }

  const where: any = {};
  if (status !== "all") where.status = status;
  if (category) where.category = { slug: category };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: offset,
      include: { category: true },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({ posts, total, limit, offset });
}

// POST: Create new blog post (admin only)
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const body = await request.json();
  const {
    title,
    slug,
    excerpt,
    content,
    metaTitle,
    metaDescription,
    featuredImage,
    featuredImageAlt,
    categoryId,
    tags,
    authorName,
    authorBio,
    authorImage,
    status,
    publishedAt,
    relatedTools,
  } = body;

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "Slug already exists" },
      { status: 400 }
    );
  }

  // Calculate reading time
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      featuredImage,
      featuredImageAlt,
      categoryId,
      tags: tags || [],
      readingTime,
      wordCount,
      authorName,
      authorBio,
      authorImage,
      status: status || "draft",
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      relatedTools: relatedTools || [],
    },
    include: { category: true },
  });

  return NextResponse.json(post, { status: 201 });
}

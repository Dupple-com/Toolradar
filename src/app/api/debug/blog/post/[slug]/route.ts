import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found", slug: params.slug });
    }

    // Test the related posts query
    let relatedPostsError: string | null = null;
    let relatedPosts: { id: string; title: string; slug: string }[] = [];
    try {
      const orConditions = [];
      if (post.categoryId) {
        orConditions.push({ categoryId: post.categoryId });
      }
      if (post.tags && post.tags.length > 0) {
        orConditions.push({ tags: { hasSome: post.tags } });
      }

      if (orConditions.length > 0) {
        relatedPosts = await prisma.blogPost.findMany({
          where: {
            status: "published",
            id: { not: post.id },
            OR: orConditions,
          },
          take: 3,
          orderBy: { publishedAt: "desc" },
          select: { id: true, title: true, slug: true },
        });
      }
    } catch (e) {
      relatedPostsError = String(e);
    }

    return NextResponse.json({
      found: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        categoryId: post.categoryId,
        category: post.category,
        tags: post.tags,
        tagsType: typeof post.tags,
        tagsIsArray: Array.isArray(post.tags),
        relatedTools: post.relatedTools,
        relatedToolsType: typeof post.relatedTools,
        relatedToolsIsArray: Array.isArray(post.relatedTools),
        contentLength: post.content?.length || 0,
        contentPreview: post.content?.substring(0, 200) || null,
        featuredImage: post.featuredImage,
        publishedAt: post.publishedAt,
        excerpt: post.excerpt,
        readingTime: post.readingTime,
        wordCount: post.wordCount,
      },
      relatedPosts,
      relatedPostsError,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
      stack: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}

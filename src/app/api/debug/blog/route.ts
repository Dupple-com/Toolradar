import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get ALL posts (including drafts) for debugging
    const allPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        externalSource: true,
      },
    });

    // Replicate exact query from blog page
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

    const regularPosts = featuredPost
      ? posts.filter(p => p.id !== featuredPost.id)
      : posts;

    return NextResponse.json({
      allPostsCount: allPosts.length,
      allPosts,
      publishedCount: posts.length,
      categoriesCount: categories.length,
      featuredPost: featuredPost ? { id: featuredPost.id, title: featuredPost.title, slug: featuredPost.slug } : null,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Webhook secret for verification
const WEBHOOK_SECRET = process.env.OUTRANK_WEBHOOK_SECRET;

// Helper to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to count words
function countWords(content: string): number {
  return content.trim().split(/\s+/).length;
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization");
    const providedSecret = authHeader?.replace("Bearer ", "");

    if (WEBHOOK_SECRET && providedSecret !== WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Log incoming webhook for debugging
    console.log("Outrank webhook received:", JSON.stringify(body, null, 2));

    // Extract fields from Outrank payload
    // Outrank typically sends: title, content, excerpt/description, category, tags, image
    const {
      title,
      content,
      excerpt,
      description, // Alternative field name
      category,
      tags,
      image,
      imageAlt,
      author,
      authorBio,
      authorImage,
      slug: providedSlug,
      metaTitle,
      metaDescription,
      externalId,
      status: providedStatus,
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = providedSlug || generateSlug(title);

    // Check if post already exists (by externalId or slug)
    let existingPost = null;
    if (externalId) {
      existingPost = await prisma.blogPost.findFirst({
        where: { externalId, externalSource: "outrank" },
      });
    }
    if (!existingPost) {
      existingPost = await prisma.blogPost.findUnique({
        where: { slug },
      });
    }

    // Handle category
    let categoryId: string | null = null;
    if (category) {
      const categorySlug = generateSlug(category);
      let blogCategory = await prisma.blogCategory.findUnique({
        where: { slug: categorySlug },
      });

      if (!blogCategory) {
        // Create category if it doesn't exist
        blogCategory = await prisma.blogCategory.create({
          data: {
            name: category,
            slug: categorySlug,
          },
        });
      }
      categoryId = blogCategory.id;
    }

    // Parse tags
    const parsedTags: string[] = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t: string) => t.trim())
      : [];

    // Calculate metadata
    const readingTime = calculateReadingTime(content);
    const wordCount = countWords(content);

    // Determine status (default to draft for review)
    const status = providedStatus === "published" ? "published" : "draft";
    const publishedAt = status === "published" ? new Date() : null;

    // Post data
    const postData = {
      title,
      slug,
      excerpt: excerpt || description || title,
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || description,
      featuredImage: image || null,
      featuredImageAlt: imageAlt || title,
      categoryId,
      tags: parsedTags,
      readingTime,
      wordCount,
      authorName: author || null,
      authorBio: authorBio || null,
      authorImage: authorImage || null,
      status,
      publishedAt,
      externalSource: "outrank",
      externalId: externalId || null,
    };

    let post;
    if (existingPost) {
      // Update existing post
      post = await prisma.blogPost.update({
        where: { id: existingPost.id },
        data: postData,
      });
      console.log(`Updated blog post: ${post.slug}`);
    } else {
      // Create new post
      post = await prisma.blogPost.create({
        data: postData,
      });
      console.log(`Created blog post: ${post.slug}`);
    }

    return NextResponse.json({
      success: true,
      action: existingPost ? "updated" : "created",
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        status: post.status,
        url: `https://toolradar.com/blog/${post.slug}`,
      },
    });
  } catch (error) {
    console.error("Outrank webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support GET for webhook verification (some services ping the endpoint)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Toolradar Blog Webhook",
    accepts: ["POST"],
  });
}

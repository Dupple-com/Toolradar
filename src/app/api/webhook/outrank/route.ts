import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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
    const rawBody = await request.json();

    // Log incoming webhook for debugging
    console.log("Outrank webhook received:", JSON.stringify(rawBody, null, 2));

    // Handle test/ping requests
    if (rawBody.test === true || rawBody.type === "test" || rawBody.event === "test") {
      return NextResponse.json({
        success: true,
        message: "Webhook test successful",
        received: rawBody,
      });
    }

    // Outrank format: { event_type: "publish_articles", data: { articles: [...] } }
    const articles = rawBody?.data?.articles;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      console.log("No articles array found. Keys received:", Object.keys(rawBody));
      return NextResponse.json({
        success: true,
        message: "Webhook received but no articles to process",
        received: Object.keys(rawBody),
        dataKeys: rawBody?.data ? Object.keys(rawBody.data) : null,
      });
    }

    console.log(`Processing ${articles.length} article(s)`);
    const results = [];

    for (const article of articles) {
      try {
        // Extract fields from Outrank article format
        const articleTitle = article.title;
        const articleContent = article.content_markdown || article.content_html;
        const excerpt = article.meta_description || "";
        const tags = Array.isArray(article.tags) ? article.tags : [];
        const image = article.image_url || null;
        const providedSlug = article.slug;
        const externalId = article.id;

        console.log("Processing article:", { title: articleTitle, hasContent: !!articleContent });

        if (!articleTitle || !articleContent) {
          console.log("Skipping article - missing title or content");
          results.push({ skipped: true, reason: "missing title or content" });
          continue;
        }

        // Generate slug
        const slug = providedSlug || generateSlug(articleTitle);

        // Check if post already exists
        let existingPost = await prisma.blogPost.findFirst({
          where: { externalId, externalSource: "outrank" },
        });
        if (!existingPost) {
          existingPost = await prisma.blogPost.findUnique({
            where: { slug },
          });
        }

        // Calculate metadata
        const readingTime = calculateReadingTime(articleContent);
        const wordCount = countWords(articleContent);

        // Post data - publish directly
        const postData = {
          title: articleTitle,
          slug,
          excerpt: excerpt || articleTitle.substring(0, 200),
          content: articleContent,
          metaTitle: articleTitle,
          metaDescription: excerpt || null,
          featuredImage: image,
          featuredImageAlt: articleTitle,
          categoryId: null,
          tags,
          readingTime,
          wordCount,
          authorName: null,
          authorBio: null,
          authorImage: null,
          status: "published",
          publishedAt: new Date(),
          externalSource: "outrank",
          externalId: externalId || null,
        };

        let post;
        if (existingPost) {
          post = await prisma.blogPost.update({
            where: { id: existingPost.id },
            data: postData,
          });
          console.log(`Updated blog post: ${post.slug}`);
        } else {
          post = await prisma.blogPost.create({
            data: postData,
          });
          console.log(`Created blog post: ${post.slug}`);
        }

        results.push({
          action: existingPost ? "updated" : "created",
          id: post.id,
          slug: post.slug,
          title: post.title,
          url: `https://toolradar.com/blog/${post.slug}`,
        });

        // Revalidate
        revalidatePath("/blog");
        revalidatePath(`/blog/${post.slug}`);

      } catch (articleError) {
        console.error("Error processing article:", articleError);
        results.push({ error: String(articleError) });
      }
    }

    console.log("Webhook processing complete:", results);

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });

  } catch (error) {
    console.error("Outrank webhook error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Toolradar Blog Webhook",
    accepts: ["POST"],
    format: "Outrank: { data: { articles: [...] } }",
  });
}

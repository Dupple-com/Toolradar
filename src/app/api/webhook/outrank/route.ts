import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    // Log all headers for debugging
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log("Webhook headers:", JSON.stringify(allHeaders));

    // Temporarily disabled auth for debugging
    // const authHeader = request.headers.get("authorization");
    // const providedSecret = authHeader?.replace("Bearer ", "");
    // if (WEBHOOK_SECRET && providedSecret !== WEBHOOK_SECRET) {
    //   console.error("Invalid webhook secret");
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const rawBody = await request.json();

    // Log incoming webhook for debugging
    console.log("Outrank webhook received:", JSON.stringify(rawBody, null, 2));

    // Handle test/ping requests from Outrank
    if (rawBody.test === true || rawBody.type === "test" || rawBody.event === "test") {
      return NextResponse.json({
        success: true,
        message: "Webhook test successful",
        received: rawBody,
      });
    }

    // Outrank might nest the article data under different keys
    // Try to extract the actual article data (only if it's an object, not a string)
    const body =
      (typeof rawBody.article === "object" && rawBody.article) ||
      (typeof rawBody.data === "object" && rawBody.data) ||
      (typeof rawBody.post === "object" && rawBody.post) ||
      rawBody;

    console.log("Extracted body keys:", Object.keys(body));

    // Extract fields from Outrank payload
    // Outrank sends articles with various field names
    const {
      title,
      headline, // Common alternative
      name, // Common alternative
      article_title, // Outrank specific (snake_case)
      content,
      content_markdown, // Outrank specific
      content_html, // Outrank specific
      body: bodyContent,
      html,
      excerpt,
      description,
      meta_description, // Outrank specific (snake_case)
      summary,
      category,
      tags,
      keywords,
      image,
      featuredImage: featuredImg,
      featured_image, // Outrank specific (snake_case)
      imageAlt,
      image_alt, // Outrank specific (snake_case)
      author,
      authorName: authorNameAlt,
      author_name, // Outrank specific (snake_case)
      authorBio,
      author_bio, // Outrank specific (snake_case)
      authorImage,
      author_image, // Outrank specific (snake_case)
      slug: providedSlug,
      metaTitle,
      meta_title, // Outrank specific (snake_case)
      seoTitle,
      seo_title, // Outrank specific (snake_case)
      metaDescription,
      seoDescription,
      seo_description, // Outrank specific (snake_case)
      externalId,
      external_id, // Outrank specific (snake_case)
      id: externalIdAlt,
      article_id, // Outrank specific
      status: providedStatus,
    } = body;

    // Use first available value for content (prefer markdown for better formatting)
    const articleContent = content_markdown || content || bodyContent || content_html || html;
    const articleTitle = title || headline || name || article_title || meta_title || metaTitle || seo_title || seoTitle;

    // Log what we found for debugging
    console.log("Parsed article data:", {
      hasTitle: !!articleTitle,
      titleValue: articleTitle?.substring(0, 50),
      hasContent: !!articleContent,
      contentLength: articleContent?.length,
      fieldsReceived: Object.keys(body),
    });

    // Validate required fields - be lenient, return success even without content for testing
    if (!articleTitle || !articleContent) {
      // If no title/content but we got data, it might be a test or different event
      console.log("Missing required fields:", {
        hasTitle: !!articleTitle,
        hasContent: !!articleContent,
        bodyKeys: Object.keys(body),
        rawBodyKeys: Object.keys(rawBody),
      });
      return NextResponse.json({
        success: true,
        message: "Webhook received but no article data to process",
        hint: "Send title and content fields to create a blog post",
        received: Object.keys(body),
        rawReceived: Object.keys(rawBody),
        debug: {
          titleFound: articleTitle || null,
          contentFound: articleContent ? `${articleContent.length} chars` : null,
        },
      });
    }

    // Generate slug if not provided
    const slug = providedSlug || generateSlug(articleTitle);

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

    // Parse tags (support multiple field names)
    const tagSource = tags || keywords;
    const parsedTags: string[] = Array.isArray(tagSource)
      ? tagSource
      : typeof tagSource === "string"
      ? tagSource.split(",").map((t: string) => t.trim())
      : [];

    // Calculate metadata
    const readingTime = calculateReadingTime(articleContent);
    const wordCount = countWords(articleContent);

    // Determine status (default to draft for review)
    const status = providedStatus === "published" ? "published" : "draft";
    const publishedAt = status === "published" ? new Date() : null;

    // Post data
    const postData = {
      title: articleTitle,
      slug,
      excerpt: excerpt || description || meta_description || summary || articleTitle.substring(0, 200),
      content: articleContent,
      metaTitle: meta_title || metaTitle || seo_title || seoTitle || articleTitle,
      metaDescription: meta_description || metaDescription || seo_description || seoDescription || excerpt || description || summary,
      featuredImage: image || featuredImg || featured_image || null,
      featuredImageAlt: imageAlt || image_alt || articleTitle,
      categoryId,
      tags: parsedTags,
      readingTime,
      wordCount,
      authorName: author || authorNameAlt || author_name || null,
      authorBio: authorBio || author_bio || null,
      authorImage: authorImage || author_image || null,
      status,
      publishedAt,
      externalSource: "outrank",
      externalId: externalId || external_id || externalIdAlt || article_id || null,
    };

    console.log("Attempting to save post with data:", {
      title: postData.title,
      slug: postData.slug,
      status: postData.status,
      contentLength: postData.content.length,
      hasCategory: !!postData.categoryId,
    });

    let post;
    try {
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
    } catch (dbError) {
      console.error("Database error while saving post:", dbError);
      throw dbError;
    }

    // Revalidate blog pages to show the new/updated post immediately
    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      if (post.categoryId) {
        // Also revalidate the category page if applicable
        const category = await prisma.blogCategory.findUnique({
          where: { id: post.categoryId },
          select: { slug: true },
        });
        if (category) {
          revalidatePath(`/blog/category/${category.slug}`);
        }
      }
      console.log("Revalidated blog paths");
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError);
      // Don't fail the webhook if revalidation fails
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

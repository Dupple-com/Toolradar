import { Metadata } from "next";

const SITE_NAME = "Toolradar";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolradar.com";
const DEFAULT_DESCRIPTION = "Discover and compare the best software tools. Real reviews from professionals, community-driven insights to help you make the right choice.";

interface SEOParams {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords = [],
}: SEOParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-default.png`;

  return {
    title: title === SITE_NAME ? title : `${title} | ${SITE_NAME}`,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@toolradar",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// Tool page metadata
export function generateToolMetadata(tool: {
  name: string;
  tagline: string;
  slug: string;
  logo?: string | null;
  description?: string;
  pricing?: string;
  communityScore?: number | null;
  reviewCount?: number;
}): Metadata {
  const title = `${tool.name} - ${tool.tagline}`;
  const description = tool.description
    ? tool.description.slice(0, 160)
    : `${tool.name}: ${tool.tagline}. Read reviews, compare features, and find alternatives on Toolradar.`;

  const keywords = [
    tool.name,
    `${tool.name} review`,
    `${tool.name} alternatives`,
    `${tool.name} pricing`,
    tool.pricing || "software",
  ];

  return generateMetadata({
    title: tool.name,
    description,
    path: `/tools/${tool.slug}`,
    image: tool.logo || undefined,
    type: "article",
    keywords,
  });
}

// Category page metadata
export function generateCategoryMetadata(category: {
  name: string;
  slug: string;
  description?: string | null;
  toolCount?: number;
}): Metadata {
  const title = `Best ${category.name} Software`;
  const description =
    category.description ||
    `Discover the best ${category.name.toLowerCase()} tools. Compare ${category.toolCount || "top"} products with real user reviews on Toolradar.`;

  const keywords = [
    `${category.name} software`,
    `best ${category.name} tools`,
    `${category.name} comparison`,
    `top ${category.name} apps`,
  ];

  return generateMetadata({
    title,
    description,
    path: `/categories/${category.slug}`,
    keywords,
  });
}

// Company page metadata
export function generateCompanyMetadata(company: {
  name: string;
  slug: string;
  description?: string | null;
  toolCount?: number;
}): Metadata {
  const title = `${company.name} Products & Reviews`;
  const description =
    company.description ||
    `Explore ${company.name}'s software products. Read reviews and compare ${company.toolCount || ""} tools on Toolradar.`;

  return generateMetadata({
    title,
    description,
    path: `/companies/${company.slug}`,
  });
}

// JSON-LD Structured Data Types
export interface ToolJsonLd {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  review?: Array<{
    "@type": "Review";
    author: { "@type": "Person"; name: string };
    reviewRating: { "@type": "Rating"; ratingValue: number };
    reviewBody: string;
  }>;
}

export function generateToolJsonLd(tool: {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  website: string;
  pricing: string;
  communityScore?: number | null;
  reviewCount?: number;
  categories?: Array<{ category: { name: string } }>;
  reviews?: Array<{
    overallRating: number;
    title: string;
    user: { name: string | null };
  }>;
}): ToolJsonLd {
  const jsonLd: ToolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description || tool.tagline,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: tool.categories?.[0]?.category.name || "Software",
    operatingSystem: "Web",
  };

  // Add pricing
  if (tool.pricing === "free") {
    jsonLd.offers = {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    };
  }

  // Add aggregate rating
  if (tool.communityScore && tool.reviewCount && tool.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(tool.communityScore * 10) / 10,
      reviewCount: tool.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add reviews
  if (tool.reviews && tool.reviews.length > 0) {
    jsonLd.review = tool.reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.user.name || "Anonymous" },
      reviewRating: { "@type": "Rating", ratingValue: review.overallRating },
      reviewBody: review.title,
    }));
  }

  return jsonLd;
}

// Breadcrumb JSON-LD
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

// Organization JSON-LD (for homepage)
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [
      "https://twitter.com/toolradar",
      "https://linkedin.com/company/toolradar",
    ],
  };
}

// Website JSON-LD with SearchAction
export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// FAQ JSON-LD
export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

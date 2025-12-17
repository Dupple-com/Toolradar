import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY,
});

export const toolsIndex = client.index("tools");

export interface MeilisearchTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string | null;
  website: string;
  pricing: string;
  status: string;
  editorialScore: number | null;
  communityScore: number | null;
  upvotes: number;
  weeklyUpvotes: number;
  createdAt: number;
  categoryIds: string[];
  categoryNames: string[];
  categorySlugs: string[];
}

export async function initMeilisearch() {
  try {
    await toolsIndex.updateSettings({
      searchableAttributes: ["name", "tagline", "description", "categoryNames"],
      filterableAttributes: ["pricing", "categoryIds", "categorySlugs", "status"],
      sortableAttributes: ["editorialScore", "communityScore", "upvotes", "weeklyUpvotes", "createdAt"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
        "editorialScore:desc",
      ],
    });
    console.log("Meilisearch index configured");
    return { success: true };
  } catch (error) {
    console.error("Meilisearch init error:", error);
    return { success: false, error };
  }
}

export async function indexTool(tool: {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo?: string | null;
  website: string;
  pricing: string;
  status: string;
  editorialScore?: number | null;
  communityScore?: number | null;
  upvotes?: number;
  weeklyUpvotes?: number;
  createdAt: Date;
  categories?: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}) {
  const doc: MeilisearchTool = {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    tagline: tool.tagline,
    description: tool.description,
    logo: tool.logo || null,
    website: tool.website,
    pricing: tool.pricing,
    status: tool.status,
    editorialScore: tool.editorialScore || null,
    communityScore: tool.communityScore || null,
    upvotes: tool.upvotes || 0,
    weeklyUpvotes: tool.weeklyUpvotes || 0,
    createdAt: tool.createdAt.getTime(),
    categoryIds: tool.categories?.map((c) => c.category.id) || [],
    categoryNames: tool.categories?.map((c) => c.category.name) || [],
    categorySlugs: tool.categories?.map((c) => c.category.slug) || [],
  };

  await toolsIndex.addDocuments([doc]);
}

export async function indexTools(tools: Parameters<typeof indexTool>[0][]) {
  const docs: MeilisearchTool[] = tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    tagline: tool.tagline,
    description: tool.description,
    logo: tool.logo || null,
    website: tool.website,
    pricing: tool.pricing,
    status: tool.status,
    editorialScore: tool.editorialScore || null,
    communityScore: tool.communityScore || null,
    upvotes: tool.upvotes || 0,
    weeklyUpvotes: tool.weeklyUpvotes || 0,
    createdAt: tool.createdAt.getTime(),
    categoryIds: tool.categories?.map((c) => c.category.id) || [],
    categoryNames: tool.categories?.map((c) => c.category.name) || [],
    categorySlugs: tool.categories?.map((c) => c.category.slug) || [],
  }));

  await toolsIndex.addDocuments(docs);
}

export async function removeTool(toolId: string) {
  await toolsIndex.deleteDocument(toolId);
}

export async function searchTools(query: string, options?: {
  filters?: string;
  sort?: string[];
  limit?: number;
  offset?: number;
}) {
  return toolsIndex.search(query, {
    filter: options?.filters,
    sort: options?.sort,
    limit: options?.limit || 20,
    offset: options?.offset || 0,
  });
}

export async function clearIndex() {
  await toolsIndex.deleteAllDocuments();
}

export async function getIndexStats() {
  return toolsIndex.getStats();
}

export default client;

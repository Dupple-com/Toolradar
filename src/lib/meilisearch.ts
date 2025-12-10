import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY,
});

export const toolsIndex = client.index("tools");

export async function initMeilisearch() {
  try {
    await toolsIndex.updateSettings({
      searchableAttributes: ["name", "tagline", "description"],
      filterableAttributes: ["pricing", "status", "categoryIds"],
      sortableAttributes: ["upvotes", "communityScore", "editorialScore", "createdAt"],
      rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
    });
    console.log("Meilisearch initialized");
  } catch (error) {
    console.error("Meilisearch init error:", error);
  }
}

export async function indexTool(tool: {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  pricing: string;
  status: string;
  logo: string | null;
  upvotes: number;
  communityScore: number | null;
  editorialScore: number | null;
  categoryIds?: string[];
  createdAt: Date;
}) {
  await toolsIndex.addDocuments([
    {
      ...tool,
      createdAt: tool.createdAt.getTime(),
    },
  ]);
}

export async function removeTool(id: string) {
  await toolsIndex.deleteDocument(id);
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

export { client as meilisearchClient };

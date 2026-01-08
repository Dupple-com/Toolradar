// Profile completion criteria with weights
export interface CompletionCriteria {
  name: string;
  completed: boolean;
  weight: number;
  tip: string;
}

export interface ProfileCompletionResult {
  score: number;
  criteria: CompletionCriteria[];
  nextAction?: string;
}

export function calculateToolProfileCompletion(tool: {
  logo?: string | null;
  features?: string[];
  pros?: string[];
  cons?: string[];
  tldr?: string[];
  pricing?: string;
  pricingDetails?: unknown;
  faqs?: unknown;
  categories?: unknown[];
}): ProfileCompletionResult {
  // For free products, pricing details are considered complete
  const hasPricingDetails = tool.pricing === "free" || !!tool.pricingDetails;

  const criteria: CompletionCriteria[] = [
    {
      name: "Logo",
      completed: !!tool.logo,
      weight: 15,
      tip: "Add a professional logo to increase trust",
    },
    {
      name: "Features",
      completed: (tool.features?.length ?? 0) >= 3,
      weight: 15,
      tip: "List at least 3 key features",
    },
    {
      name: "Pros",
      completed: (tool.pros?.length ?? 0) >= 2,
      weight: 10,
      tip: "Add at least 2 pros to help users compare",
    },
    {
      name: "Cons",
      completed: (tool.cons?.length ?? 0) >= 2,
      weight: 10,
      tip: "Transparency about cons builds trust",
    },
    {
      name: "TL;DR",
      completed: (tool.tldr?.length ?? 0) >= 3,
      weight: 15,
      tip: "Add 3 bullet points summarizing your tool",
    },
    {
      name: "Pricing Details",
      completed: hasPricingDetails,
      weight: 10,
      tip: tool.pricing === "free" ? "Free products are auto-completed" : "Add pricing tiers and details",
    },
    {
      name: "FAQs",
      completed: Array.isArray(tool.faqs) && tool.faqs.length >= 2,
      weight: 15,
      tip: "Add at least 2 FAQs to answer common questions",
    },
    {
      name: "Categories",
      completed: (tool.categories?.length ?? 0) >= 1,
      weight: 10,
      tip: "Add categories to improve discoverability",
    },
  ];

  const score = criteria
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.weight, 0);

  const nextAction = criteria.find((c) => !c.completed)?.tip;

  return { score, criteria, nextAction };
}

import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbJsonLd, generateFaqJsonLd } from "@/lib/seo";
import { ToolLogo } from "@/components/tools/tool-logo";
import { KeyTakeaways } from "@/components/seo/key-takeaways";
import { Users, Building2, Rocket, Briefcase, GraduationCap, Home, Star, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Define criteria interface
interface UseCaseCriteria {
  pricing?: string[];
  minScore?: number;
  categories?: string[];
}

interface UseCaseConfig {
  title: string;
  description: string;
  icon: typeof Rocket;
  criteria: UseCaseCriteria;
  keywords: string[];
}

// Define use cases with their criteria
const USE_CASES: Record<string, UseCaseConfig> = {
  startups: {
    title: "Startups",
    description: "Best software tools for startups and early-stage companies",
    icon: Rocket,
    criteria: { pricing: ["free", "freemium"] },
    keywords: ["startup tools", "tools for startups", "startup software", "free tools for startups"],
  },
  enterprises: {
    title: "Enterprises",
    description: "Enterprise-grade software solutions for large organizations",
    icon: Building2,
    criteria: { pricing: ["paid", "freemium"], minScore: 80 },
    keywords: ["enterprise software", "enterprise tools", "corporate software", "business tools"],
  },
  freelancers: {
    title: "Freelancers",
    description: "Essential tools for independent professionals and consultants",
    icon: Briefcase,
    criteria: { pricing: ["free", "freemium"] },
    keywords: ["freelancer tools", "tools for freelancers", "solo business tools", "independent professional software"],
  },
  teams: {
    title: "Teams",
    description: "Collaboration and productivity tools for teams of all sizes",
    icon: Users,
    criteria: { categories: ["communication", "project-management", "productivity"] },
    keywords: ["team tools", "collaboration software", "team productivity", "team management tools"],
  },
  students: {
    title: "Students",
    description: "Free and affordable tools for students and educators",
    icon: GraduationCap,
    criteria: { pricing: ["free"] },
    keywords: ["student tools", "free software for students", "educational tools", "student discounts"],
  },
  remote: {
    title: "Remote Work",
    description: "Essential tools for remote teams and distributed workforces",
    icon: Home,
    criteria: { categories: ["communication", "productivity", "project-management"] },
    keywords: ["remote work tools", "work from home software", "distributed team tools", "remote collaboration"],
  },
};

const USE_CASE_KEYS = Object.keys(USE_CASES);
type UseCase = keyof typeof USE_CASES;

export async function generateStaticParams() {
  return USE_CASE_KEYS.map((usecase) => ({ usecase }));
}

export async function generateMetadata({ params }: { params: { usecase: string } }): Promise<Metadata> {
  const useCase = USE_CASES[params.usecase];
  if (!useCase) return { title: "Not found" };

  const year = new Date().getFullYear();
  const title = `Best Tools for ${useCase.title} ${year}`;
  const description = `${useCase.description}. Discover top-rated software solutions perfect for ${useCase.title.toLowerCase()} in ${year}.`;

  return {
    title: `${title} | Toolradar`,
    description,
    keywords: useCase.keywords.join(", "),
    openGraph: {
      title,
      description,
      url: `https://toolradar.com/tools/for/${params.usecase}`,
      siteName: "Toolradar",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://toolradar.com/tools/for/${params.usecase}`,
    },
  };
}

export default async function UseCasePage({ params }: { params: { usecase: string } }) {
  const useCase = USE_CASES[params.usecase];

  if (!useCase) {
    notFound();
  }

  const { criteria } = useCase;
  const year = new Date().getFullYear();

  // Build query based on criteria
  const whereClause: Record<string, unknown> = {
    status: "published",
  };

  if (criteria.pricing) {
    whereClause.pricing = { in: criteria.pricing };
  }

  if (criteria.minScore) {
    whereClause.editorialScore = { gte: criteria.minScore };
  }

  if (criteria.categories) {
    whereClause.categories = {
      some: {
        category: {
          slug: { in: criteria.categories },
        },
      },
    };
  }

  const tools = await prisma.tool.findMany({
    where: whereClause,
    include: {
      categories: {
        include: { category: { select: { name: true, slug: true } } },
        take: 1,
      },
      _count: { select: { reviews: true } },
    },
    orderBy: { editorialScore: "desc" },
    take: 30,
  });

  if (tools.length === 0) {
    notFound();
  }

  const Icon = useCase.icon;
  const freeTools = tools.filter(t => t.pricing === "free" || t.pricing === "freemium");

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: `For ${useCase.title}`, url: `/tools/for/${params.usecase}` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best Tools for ${useCase.title} ${year}`,
    description: useCase.description,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://toolradar.com/tools/${tool.slug}`,
    })),
  };

  const faqJsonLd = generateFaqJsonLd([
    {
      question: `What are the best tools for ${useCase.title.toLowerCase()} in ${year}?`,
      answer: `Top tools for ${useCase.title.toLowerCase()} include ${tools.slice(0, 5).map(t => t.name).join(", ")}. These are selected based on features, pricing, and user reviews suitable for ${useCase.title.toLowerCase()}.`,
    },
    {
      question: `Are there free tools for ${useCase.title.toLowerCase()}?`,
      answer: freeTools.length > 0
        ? `Yes! ${freeTools.slice(0, 3).map(t => t.name).join(", ")} offer free plans perfect for ${useCase.title.toLowerCase()}. ${freeTools.length} tools in our list have free or freemium options.`
        : `Most professional tools require payment, but many offer free trials suitable for ${useCase.title.toLowerCase()}.`,
    },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/tools" className="hover:text-foreground transition">Tools</Link>
              <span>/</span>
              <span className="text-foreground">For {useCase.title}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  Best Tools for {useCase.title}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl">
              {useCase.description}. We've curated {tools.length} tools specifically suited for {useCase.title.toLowerCase()}.
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <KeyTakeaways
            category={`${useCase.title} Use`}
            topTool={{
              name: tools[0]?.name || "",
              editorialScore: tools[0]?.editorialScore,
            }}
            totalTools={tools.length}
            freeToolsCount={freeTools.length}
            avgScore={tools.reduce((sum, t) => sum + (t.editorialScore || 0), 0) / tools.length}
          />
        </div>

        {/* Tools Grid */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <article
                key={tool.id}
                className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {index < 3 && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        index === 0 ? "bg-yellow-100 text-yellow-700" :
                        index === 1 ? "bg-gray-100 text-gray-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {index + 1}
                      </div>
                    )}
                    <ToolLogo src={tool.logo} name={tool.name} className="w-12 h-12 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link href={`/tools/${tool.slug}`} className="group">
                        <h2 className="font-semibold group-hover:text-primary transition truncate">
                          {tool.name}
                        </h2>
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">{tool.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 text-xs">
                    <span className={`px-2 py-0.5 rounded ${
                      tool.pricing === "free" ? "bg-green-100 text-green-700" :
                      tool.pricing === "freemium" ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                    </span>
                    {tool.editorialScore && tool.editorialScore > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-3 h-3" />
                        {tool.editorialScore}/100
                      </span>
                    )}
                    {tool.categories[0] && (
                      <Link
                        href={`/categories/${tool.categories[0].category.slug}`}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {tool.categories[0].category.name}
                      </Link>
                    )}
                  </div>

                  <Link
                    href={`/tools/${tool.slug}`}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Other Use Cases */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-lg font-bold mb-4">Explore Other Use Cases</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(USE_CASES).filter(([key]) => key !== params.usecase).map(([key, uc]) => {
              const UCIcon = uc.icon;
              return (
                <Link
                  key={key}
                  href={`/tools/for/${key}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm hover:border-primary transition"
                >
                  <UCIcon className="w-4 h-4 text-muted-foreground" />
                  Tools for {uc.title}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

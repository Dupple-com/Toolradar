import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ToolEditForm } from "@/components/company/tool-edit-form";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const company = await getActiveCompany(user.id);

  if (!company?.verifiedAt) {
    redirect("/company/setup");
  }

  // Get the tool and verify it belongs to this company
  const tool = await prisma.tool.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  if (!tool) {
    notFound();
  }

  if (tool.companyId !== company.id) {
    redirect("/company");
  }

  // Get all categories for the form
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/company"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit {tool.name}</h1>
            <p className="text-muted-foreground">
              Update your tool's information and content
            </p>
          </div>
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          target="_blank"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          View public page
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <ToolEditForm
        tool={{
          id: tool.id,
          name: tool.name,
          tagline: tool.tagline,
          description: tool.description,
          website: tool.website,
          logo: tool.logo,
          pricing: tool.pricing,
          pricingDetails: tool.pricingDetails as {
            hasFreeTrial?: boolean;
            freeTrialDays?: number;
            tiers?: { name: string; price: number | string; period?: string; features: string[] }[];
          } | null,
          tldr: tool.tldr,
          features: tool.features,
          pros: tool.pros,
          cons: tool.cons,
          faqs: tool.faqs as { question: string; answer: string }[] | null,
          categoryIds: tool.categories.map((c) => c.categoryId),
        }}
        categories={categories}
      />
    </div>
  );
}

import { getCurrentUser } from "@/lib/auth-utils";
import { getActiveCompany } from "@/lib/company-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Code, Copy, ExternalLink } from "lucide-react";
import { WidgetCodeBlock } from "@/components/company/widget-code-block";

export default async function CompanyWidgetPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company = await getActiveCompany(user.id);

  if (!company?.verifiedAt) {
    redirect("/company/setup");
  }

  const tools = await prisma.tool.findMany({
    where: { companyId: company.id, status: "published" },
    select: {
      id: true,
      name: true,
      slug: true,
      editorialScore: true,
      communityScore: true,
      reviewCount: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Embeddable Widget</h1>
        <p className="text-muted-foreground">
          Display your Toolradar rating on your website
        </p>
      </div>

      {tools.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center text-muted-foreground">
          No published tools yet. Submit and publish a tool to get your widget.
        </div>
      ) : (
        <div className="space-y-8">
          {tools.map((tool) => {
            const score = tool.editorialScore || Math.round((tool.communityScore || 0) * 20);

            return (
              <div key={tool.id} className="bg-card rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4">{tool.name}</h2>

                {/* Preview */}
                <div className="mb-6 space-y-6">
                  {/* Badge Format */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Badge</h3>
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="bg-gray-100 rounded-xl p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=badge&v=11`} alt={`${tool.name}`} width={150} height={160} />
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=badge&theme=dark&v=11`} alt={`${tool.name}`} width={150} height={160} />
                      </div>
                    </div>
                  </div>

                  {/* Bar Format */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Horizontal</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-xl p-4 inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=bar&v=10`} alt={`${tool.name}`} width={280} height={60} />
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=bar&theme=dark&v=10`} alt={`${tool.name}`} width={280} height={60} />
                      </div>
                    </div>
                  </div>

                  {/* Compact Format */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Compact</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-gray-100 rounded-xl p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=compact&v=10`} alt={`${tool.name}`} width={120} height={120} />
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=compact&theme=dark&v=10`} alt={`${tool.name}`} width={120} height={120} />
                      </div>
                    </div>
                  </div>

                  {/* Minimal Format */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Minimal</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-gray-100 rounded-xl p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=minimal&v=10`} alt={`${tool.name}`} width={160} height={40} />
                      </div>
                      <div className="bg-slate-900 rounded-xl p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://toolradar.com/api/widget/${tool.slug}?format=minimal&theme=dark&v=10`} alt={`${tool.name}`} width={160} height={40} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embed Code */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Embed Code
                  </h3>
                  <WidgetCodeBlock
                    toolSlug={tool.slug}
                    toolName={tool.name}
                  />
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t flex items-center gap-6 text-sm text-muted-foreground">
                  <span>Score: <strong className="text-foreground">{score}/100</strong></span>
                  <span>Reviews: <strong className="text-foreground">{tool.reviewCount}</strong></span>
                  <a
                    href={`/tools/${tool.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    View page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <h3 className="font-semibold mb-3">Why add the widget?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Build trust with visitors by showing verified reviews
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Increase conversions with social proof
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Widget updates automatically as you get new reviews
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Dofollow backlink to boost your SEO
          </li>
        </ul>
      </div>
    </div>
  );
}

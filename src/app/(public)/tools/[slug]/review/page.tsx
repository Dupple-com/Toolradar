import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/reviews/review-form";

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireAuth();

  const tool = await prisma.tool.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, logo: true },
  });

  if (!tool) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        {tool.logo ? (
          <img src={tool.logo} alt="" className="w-16 h-16 rounded-xl" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {tool.name[0]}
          </div>
        )}
        <div>
          <p className="text-muted-foreground">Write a review for</p>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
        </div>
      </div>

      <ReviewForm toolId={tool.id} toolSlug={tool.slug} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { ReviewForm } from "@/components/reviews/review-form";
import Link from "next/link";

export default async function NewReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireAuth();

  const tool = await prisma.tool.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  if (!tool) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href={`/tools/${tool.slug}`} className="text-primary hover:underline text-sm">
        ← Back to {tool.name}
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-8">Write a Review for {tool.name}</h1>
      <ReviewForm toolId={tool.id} toolSlug={tool.slug} />
    </div>
  );
}

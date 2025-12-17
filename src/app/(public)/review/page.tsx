import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReviewPageClient } from "@/components/reviews/review-page-client";

export const metadata = {
  title: "Leave a Review - Toolradar",
  description: "Share your experience with software tools and help others make better decisions.",
};

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: { tool?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/review");
  }

  // Get popular tools for suggestions
  const popularTools = await prisma.tool.findMany({
    where: { status: "published" },
    orderBy: { reviewCount: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      tagline: true,
    },
  });

  // If tool is pre-selected via query param
  let selectedTool = null;
  if (searchParams.tool) {
    selectedTool = await prisma.tool.findUnique({
      where: { slug: searchParams.tool },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        tagline: true,
        website: true,
      },
    });
  }

  // Check if user already reviewed this tool
  let existingReview = null;
  if (selectedTool) {
    existingReview = await prisma.review.findFirst({
      where: {
        toolId: selectedTool.id,
        userId: session.user.id,
      },
      select: { id: true },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-3">Leave a Review</h1>
          <p className="text-lg text-muted-foreground">
            Share your honest experience to help others make better software decisions.
            All reviews are verified and moderated.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <ReviewPageClient
          popularTools={popularTools}
          selectedTool={selectedTool}
          existingReview={existingReview}
          userEmail={session.user.email || ""}
        />
      </section>

      {/* Trust indicators */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Why reviews matter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">Verified Reviews</p>
              <p className="text-muted-foreground mt-1">
                We verify reviewers through email and LinkedIn to ensure authenticity.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="font-medium">Moderated Content</p>
              <p className="text-muted-foreground mt-1">
                Every review is checked before publishing to maintain quality.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium">Help the Community</p>
              <p className="text-muted-foreground mt-1">
                Your insights help thousands of users find the right tools.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [toolCount, reviewCount, pendingReviews, submissionCount] = await Promise.all([
    prisma.tool.count(),
    prisma.review.count(),
    prisma.review.count({ where: { status: "pending" } }),
    prisma.submission.count({ where: { status: "pending" } }),
  ]);

  const stats = [
    { label: "Total Tools", value: toolCount, href: "/admin/tools" },
    { label: "Total Reviews", value: reviewCount, href: "/admin/reviews" },
    { label: "Pending Reviews", value: pendingReviews, href: "/admin/reviews?status=pending", highlight: pendingReviews > 0 },
    { label: "Pending Submissions", value: submissionCount, href: "/admin/submissions", highlight: submissionCount > 0 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`p-6 bg-card rounded-xl border hover:border-primary transition ${
              stat.highlight ? "border-orange-500" : ""
            }`}
          >
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.highlight ? "text-orange-500" : ""}`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/tools/new" className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center hover:bg-primary/90">
              Add New Tool
            </Link>
            <Link href="/admin/totd" className="block px-4 py-2 border rounded-lg text-center hover:bg-muted">
              Select Tool of the Day
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

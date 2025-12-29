import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Force dynamic rendering - admin pages should never be static
export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: { include: { category: true } },
      _count: { select: { reviews: true, votes: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tools</h1>
        <Link
          href="/admin/tools/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Add Tool
        </Link>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Tool</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Score</th>
              <th className="text-left px-4 py-3 font-medium">Reviews</th>
              <th className="text-left px-4 py-3 font-medium">Votes</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {tool.logo && (
                      <img src={tool.logo} alt={`${tool.name} logo`} className="w-8 h-8 rounded" />
                    )}
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">{tool.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tool.status === "published" ? "bg-green-100 text-green-700" :
                    tool.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {tool.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {tool.editorialScore ? `${tool.editorialScore}/100` : "-"}
                </td>
                <td className="px-4 py-3">{tool._count.reviews}</td>
                <td className="px-4 py-3">{tool._count.votes}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/tools/${tool.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No tools yet. Add your first tool to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

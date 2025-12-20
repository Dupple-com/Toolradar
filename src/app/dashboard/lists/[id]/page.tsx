import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Globe, Trash2 } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { DeleteListButton } from "@/components/dashboard/delete-list-button";
import { RemoveFromListButton } from "@/components/dashboard/remove-from-list-button";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const list = await prisma.list.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      tools: {
        include: {
          tool: {
            include: {
              _count: { select: { reviews: true } },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!list) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/lists"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            <ArrowLeft size={14} />
            Back to lists
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{list.name}</h1>
            {list.public ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <Globe size={12} />
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                <Lock size={12} />
                Private
              </span>
            )}
          </div>
          {list.description && (
            <p className="text-slate-500 mt-1">{list.description}</p>
          )}
        </div>
        <DeleteListButton listId={list.id} listName={list.name} />
      </div>

      {list.tools.length > 0 ? (
        <div className="grid gap-3">
          {list.tools.map((listTool) => (
            <div key={listTool.id} className="relative group">
              <ToolCard
                tool={{
                  ...listTool.tool,
                  reviewCount: listTool.tool._count.reviews,
                }}
              />
              <RemoveFromListButton
                listId={list.id}
                toolId={listTool.toolId}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-slate-600 font-medium">This list is empty</p>
          <p className="text-sm text-slate-500 mt-1">
            Add tools to this list from any tool page
          </p>
          <Link
            href="/tools"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Browse tools →
          </Link>
        </div>
      )}
    </div>
  );
}

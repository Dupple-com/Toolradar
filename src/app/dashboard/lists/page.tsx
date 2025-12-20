import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import Link from "next/link";
import { Plus, Lock, Globe, ChevronRight } from "lucide-react";
import { CreateListButton } from "@/components/dashboard/create-list-button";

export default async function ListsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const lists = await prisma.list.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { tools: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Lists</h1>
        <CreateListButton />
      </div>

      {lists.length > 0 ? (
        <div className="grid gap-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/dashboard/lists/${list.id}`}
              className="flex items-center justify-between p-4 bg-card rounded-xl border hover:border-slate-300 hover:bg-slate-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  {list.public ? (
                    <Globe size={18} className="text-slate-500" />
                  ) : (
                    <Lock size={18} className="text-slate-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{list.name}</h3>
                  <p className="text-sm text-slate-500">
                    {list._count.tools} tool{list._count.tools !== 1 ? "s" : ""}
                    {list.public && " · Public"}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No lists yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Create your first list to organize tools
          </p>
        </div>
      )}
    </div>
  );
}

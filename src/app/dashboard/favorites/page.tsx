import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { ToolCard } from "@/components/tools/tool-card";

export default async function FavoritesPage() {
  const user = await requireAuth();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { tool: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Favorites</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <ToolCard key={fav.id} tool={fav.tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground mb-4">No favorites yet</p>
          <a href="/tools" className="text-primary hover:underline">
            Browse tools →
          </a>
        </div>
      )}
    </div>
  );
}

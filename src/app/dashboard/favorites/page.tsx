import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { ToolCard } from "@/components/tools/tool-card";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { tool: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Favorites</h1>

      {favorites.length > 0 ? (
        <div className="grid gap-4">
          {favorites.map((fav) => (
            <ToolCard key={fav.id} tool={fav.tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground">No favorites yet.</p>
          <a href="/tools" className="text-primary hover:underline">
            Browse tools →
          </a>
        </div>
      )}
    </div>
  );
}

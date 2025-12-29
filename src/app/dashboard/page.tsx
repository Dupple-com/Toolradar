import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [favoritesCount, listsCount, reviewsCount] = await Promise.all([
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.list.count({ where: { userId: user.id } }),
    prisma.review.count({ where: { userId: user.id } }),
  ]);

  const recentFavorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { tool: { select: { name: true, slug: true, logo: true } } },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Favorites", value: favoritesCount, href: "/dashboard/favorites" },
          { label: "Lists", value: listsCount, href: "/dashboard/lists" },
          { label: "Reviews", value: reviewsCount, href: "/dashboard/reviews" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card rounded-xl border p-6 hover:border-primary transition"
          >
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {recentFavorites.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4">Recent Favorites</h2>
          <div className="grid grid-cols-2 gap-4">
            {recentFavorites.map((fav) => (
              <Link
                key={fav.id}
                href={`/tools/${fav.tool.slug}`}
                className="flex items-center gap-3 bg-card rounded-xl border p-4 hover:border-primary transition"
              >
                {fav.tool.logo ? (
                  <img src={fav.tool.logo} alt={`${fav.tool.name} logo`} className="w-10 h-10 rounded" />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold">
                    {fav.tool.name[0]}
                  </div>
                )}
                <span className="font-medium">{fav.tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

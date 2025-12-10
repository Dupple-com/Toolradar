import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();

  const [favorites, reviews, lists, votes] = await Promise.all([
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.review.count({ where: { userId: user.id } }),
    prisma.list.count({ where: { userId: user.id } }),
    prisma.vote.count({ where: { userId: user.id } }),
  ]);

  const stats = [
    { label: "Favorites", value: favorites, href: "/dashboard/favorites" },
    { label: "Reviews", value: reviews, href: "/dashboard/reviews" },
    { label: "Lists", value: lists, href: "/dashboard/lists" },
    { label: "Votes", value: votes, href: "#" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your activity overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card rounded-xl border p-6 hover:border-primary/50 transition"
          >
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

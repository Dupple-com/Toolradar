import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      username: true,
      bio: true,
      emailNewTools: true,
      emailWeeklyDigest: true,
      nameChangedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsForm
        user={dbUser!}
        nameChangedAt={dbUser?.nameChangedAt?.toISOString() || null}
      />
    </div>
  );
}

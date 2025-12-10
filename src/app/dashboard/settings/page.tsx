import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      username: true,
      bio: true,
      linkedinUrl: true,
      emailNewTools: true,
      emailWeeklyDigest: true,
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsForm user={dbUser!} />
    </div>
  );
}

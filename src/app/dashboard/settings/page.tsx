import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { ConnectedAccounts } from "@/components/dashboard/connected-accounts";
import { NotificationSettings } from "@/components/dashboard/notification-settings";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      username: true,
      bio: true,
      role: true,
      emailNewTools: true,
      emailWeeklyDigest: true,
      nameChangedAt: true,
      notificationPrefs: true,
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });

  const connectedProviders = dbUser?.accounts.map((a) => a.provider) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsForm
        user={dbUser!}
        nameChangedAt={dbUser?.nameChangedAt?.toISOString() || null}
      />
      <NotificationSettings
        currentPrefs={dbUser?.notificationPrefs as any}
        isAdmin={dbUser?.role === "admin"}
      />
      <ConnectedAccounts connectedProviders={connectedProviders} />
    </div>
  );
}

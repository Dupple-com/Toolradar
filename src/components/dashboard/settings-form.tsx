"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Info } from "lucide-react";
import { toast } from "sonner";

const DAYS_BETWEEN_NAME_CHANGES = 30;

interface SettingsFormProps {
  user: {
    name: string | null;
    username: string | null;
    bio: string | null;
    emailNewTools: boolean;
    emailWeeklyDigest: boolean;
  };
  nameChangedAt: string | null;
}

export function SettingsForm({ user, nameChangedAt }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
  });

  // Calculate if name change is allowed
  const getNameChangeInfo = () => {
    if (!nameChangedAt) return { canChange: true, daysRemaining: 0 };

    const daysSinceLastChange = Math.floor(
      (Date.now() - new Date(nameChangedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const canChange = daysSinceLastChange >= DAYS_BETWEEN_NAME_CHANGES;
    const daysRemaining = Math.max(0, DAYS_BETWEEN_NAME_CHANGES - daysSinceLastChange);

    return { canChange, daysRemaining };
  };

  const { canChange: canChangeName, daysRemaining } = getNameChangeInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    const res = await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Error saving settings");
      setIsLoading(false);
      return;
    }

    router.refresh();
    setIsLoading(false);
    setIsSaved(true);

    // Reset saved state after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border p-6">
      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={!canChangeName}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:bg-muted disabled:cursor-not-allowed"
        />
        {!canChangeName && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Info size={12} />
            You can change your name in {daysRemaining} days
          </p>
        )}
        {canChangeName && nameChangedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            You can change your name once every 30 days
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          Username
          <Lock size={12} className="text-muted-foreground" />
        </label>
        <input
          type="text"
          value={user.username || ""}
          disabled
          placeholder="@username"
          className="w-full px-4 py-2 border rounded-lg bg-muted cursor-not-allowed text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Username cannot be changed. Contact support if needed.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isSaved}
        className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
          isSaved
            ? "bg-green-500 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        } disabled:opacity-90`}
      >
        {isLoading ? (
          "Saving..."
        ) : isSaved ? (
          <>
            <Check size={16} />
            Saved!
          </>
        ) : (
          "Save Settings"
        )}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface SettingsFormProps {
  user: {
    name: string | null;
    username: string | null;
    bio: string | null;
    emailNewTools: boolean;
    emailWeeklyDigest: boolean;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    emailNewTools: user.emailNewTools,
    emailWeeklyDigest: user.emailWeeklyDigest,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

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
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="@username"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
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

      <div className="space-y-3">
        <h3 className="font-medium">Email Notifications</h3>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.emailNewTools}
            onChange={(e) => setFormData({ ...formData, emailNewTools: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">New tools in my categories</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.emailWeeklyDigest}
            onChange={(e) => setFormData({ ...formData, emailWeeklyDigest: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Weekly digest</span>
        </label>
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

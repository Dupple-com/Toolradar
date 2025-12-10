"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  user: {
    name: string | null;
    username: string | null;
    bio: string | null;
    linkedinUrl: string | null;
    emailNewTools: boolean;
    emailWeeklyDigest: boolean;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    bio: user.bio || "",
    linkedinUrl: user.linkedinUrl || "",
    emailNewTools: user.emailNewTools,
    emailWeeklyDigest: user.emailWeeklyDigest,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    router.refresh();
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
        <input
          type="url"
          value={formData.linkedinUrl}
          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Email Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.emailNewTools}
              onChange={(e) => setFormData({ ...formData, emailNewTools: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Notify me about new tools I might like</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.emailWeeklyDigest}
              onChange={(e) => setFormData({ ...formData, emailWeeklyDigest: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Weekly digest of trending tools</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

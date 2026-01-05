"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, Check } from "lucide-react";

interface NotificationPrefs {
  new_review: boolean;
  review_reply: boolean;
  submission_approved: boolean;
  submission_rejected: boolean;
  analytics_digest: boolean; // Bi-weekly analytics report
  new_submission: boolean; // Admin only
  new_claim: boolean; // Admin only
}

const defaultPrefs: NotificationPrefs = {
  new_review: true,
  review_reply: true,
  submission_approved: true,
  submission_rejected: true,
  analytics_digest: true,
  new_submission: true,
  new_claim: true,
};

const notificationTypes = [
  {
    key: "new_review",
    label: "New reviews",
    description: "When someone leaves a review on your tools",
    forCompany: true,
  },
  {
    key: "review_reply",
    label: "Review replies",
    description: "When someone replies to your review",
    forUser: true,
  },
  {
    key: "submission_approved",
    label: "Submission approved",
    description: "When your tool submission is approved",
    forCompany: true,
  },
  {
    key: "submission_rejected",
    label: "Submission rejected",
    description: "When your tool submission is rejected",
    forCompany: true,
  },
  {
    key: "analytics_digest",
    label: "Analytics digest",
    description: "Bi-weekly report of your tools' performance",
    forCompany: true,
  },
];

const adminNotificationTypes = [
  {
    key: "new_submission",
    label: "New submissions",
    description: "When a new tool is submitted for review",
  },
  {
    key: "new_claim",
    label: "New claims",
    description: "When someone requests to claim a company",
  },
];

interface NotificationSettingsProps {
  currentPrefs: NotificationPrefs | null;
  isAdmin: boolean;
}

export function NotificationSettings({ currentPrefs, isAdmin }: NotificationSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    ...defaultPrefs,
    ...currentPrefs,
  });

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/notification-prefs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (res.ok) {
        setIsSaved(true);
        router.refresh();
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        toast.error("Failed to save preferences");
      }
    } catch {
      toast.error("An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground">Choose which notifications you receive</p>
        </div>
      </div>

      <div className="space-y-4">
        {notificationTypes.map((type) => (
          <label
            key={type.key}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={prefs[type.key as keyof NotificationPrefs]}
              onChange={() => handleToggle(type.key as keyof NotificationPrefs)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{type.label}</p>
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </div>
          </label>
        ))}

        {isAdmin && (
          <>
            <div className="border-t pt-4 mt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Admin Notifications
              </p>
              {adminNotificationTypes.map((type) => (
                <label
                  key={type.key}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={prefs[type.key as keyof NotificationPrefs]}
                    onChange={() => handleToggle(type.key as keyof NotificationPrefs)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleSave}
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
          "Save Preferences"
        )}
      </button>
    </div>
  );
}

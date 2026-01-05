"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

interface VerifyFormProps {
  domain: string;
  token: string;
  existingEmail?: string | null;
}

export function VerifyForm({ domain, token, existingEmail }: VerifyFormProps) {
  const [email, setEmail] = useState(existingEmail || "");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(!!existingEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (emailDomain !== domain.toLowerCase()) {
      toast.error(`Email must be from @${domain}`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/company/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (res.ok) {
        setEmailSent(true);
        toast.success("Verification email sent!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send email");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/company/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (res.ok) {
        toast.success("Verification email resent!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to resend email");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Check your inbox</h3>
        <p className="text-muted-foreground mb-4">
          We sent a verification link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Check your spam folder if you don&apos;t see it.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Resend email"}
          </button>
          <span className="text-muted-foreground">•</span>
          <button
            onClick={() => setEmailSent(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Use different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Work Email *
        </label>
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={`you@${domain}`}
            className="flex-1 px-4 py-3 border rounded-l-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="px-6 py-3 bg-primary text-white rounded-r-xl hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Must be an email ending with @{domain}
        </p>
      </div>
    </form>
  );
}

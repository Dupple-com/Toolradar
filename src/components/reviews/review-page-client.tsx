"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { ToolSelector } from "./tool-selector";
import { ReviewRatingSection } from "./review-rating-section";
import { ReviewWrittenSection } from "./review-written-section";
import { ReviewVerificationSection } from "./review-verification-section";
import { LoadingButton } from "@/components/ui/loading-button";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  tagline: string;
  website?: string;
}

interface ReviewPageClientProps {
  popularTools: Tool[];
  selectedTool: Tool | null;
  existingReview: { id: string } | null;
  userEmail: string;
}

export function ReviewPageClient({
  popularTools,
  selectedTool: initialTool,
  existingReview,
  userEmail,
}: ReviewPageClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<"select" | "review">(initialTool ? "review" : "select");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(initialTool);
  const [isLoading, setIsLoading] = useState(false);

  // Review form state
  const [formData, setFormData] = useState({
    // Ratings
    overallRating: 0,
    easeOfUse: 0,
    valueForMoney: 0,
    features: 0,
    customerSupport: 0,
    recommendScore: 0,
    // Written
    title: "",
    pros: "",
    cons: "",
    useCases: "",
    // Verification
    usageDuration: "",
    companySize: "",
    userRole: "",
    linkedinUrl: "",
  });

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setStep("review");
    router.push(`/review?tool=${tool.slug}`, { scroll: false });
  };

  const handleChangeTool = () => {
    setSelectedTool(null);
    setStep("select");
    router.push("/review");
  };

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.overallRating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Please provide a review title");
      return;
    }
    if (!formData.pros.trim() || !formData.cons.trim()) {
      toast.error("Please fill in both pros and cons");
      return;
    }
    if (!formData.usageDuration) {
      toast.error("Please select how long you've used this tool");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          toolId: selectedTool?.id,
        }),
      });

      if (res.ok) {
        toast.success("Review submitted! It will be published after moderation.");
        router.push(`/tools/${selectedTool?.slug}?review=submitted`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Error submitting review");
      }
    } catch {
      toast.error("Error submitting review");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Select Tool
  if (step === "select") {
    return <ToolSelector tools={popularTools} onSelect={handleSelectTool} />;
  }

  // Already reviewed this tool
  if (existingReview) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">You already reviewed this tool</h2>
        <p className="text-muted-foreground mb-6">
          You can only submit one review per tool. Would you like to review a different tool?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleChangeTool}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            Review Another Tool
          </button>
          <Link
            href={`/tools/${selectedTool?.slug}`}
            className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 font-medium"
          >
            View Tool
          </Link>
        </div>
      </div>
    );
  }

  // Step 2: Write Review
  return (
    <div className="space-y-6">
      {/* Selected Tool Header */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedTool?.logo ? (
              <img src={selectedTool.logo} alt="" className="w-14 h-14 rounded-xl" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                {selectedTool?.name[0]}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg">{selectedTool?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedTool?.tagline}</p>
            </div>
          </div>
          <button onClick={handleChangeTool} className="text-sm text-primary hover:underline">
            Change
          </button>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ReviewRatingSection
          data={{
            overallRating: formData.overallRating,
            easeOfUse: formData.easeOfUse,
            valueForMoney: formData.valueForMoney,
            features: formData.features,
            customerSupport: formData.customerSupport,
            recommendScore: formData.recommendScore,
          }}
          onChange={(field, value) => updateField(field, value)}
        />

        <ReviewWrittenSection
          data={{
            title: formData.title,
            pros: formData.pros,
            cons: formData.cons,
            useCases: formData.useCases,
          }}
          onChange={(field, value) => updateField(field, value)}
        />

        <ReviewVerificationSection
          data={{
            usageDuration: formData.usageDuration,
            companySize: formData.companySize,
            userRole: formData.userRole,
            linkedinUrl: formData.linkedinUrl,
          }}
          onChange={(field, value) => updateField(field, value)}
          userEmail={userEmail}
        />

        {/* Submit */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-3 mb-6">
            <input type="checkbox" id="terms" required className="mt-1" />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I confirm this review is based on my genuine experience. I understand that fake
              reviews may be removed and my account may be suspended.
            </label>
          </div>

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting..."
            className="w-full py-4 text-lg"
            size="lg"
          >
            Submit Review
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}

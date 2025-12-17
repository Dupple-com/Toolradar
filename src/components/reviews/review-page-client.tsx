"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Review form state
  const [formData, setFormData] = useState({
    overallRating: 0,
    easeOfUse: 0,
    valueForMoney: 0,
    features: 0,
    customerSupport: 0,
    title: "",
    pros: "",
    cons: "",
    useCases: "",
    // Verification fields
    usageDuration: "",
    companySize: "",
    userRole: "",
    recommendScore: 0,
    linkedinUrl: "",
  });

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return popularTools;
    const q = searchQuery.toLowerCase();
    return popularTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline?.toLowerCase().includes(q)
    );
  }, [popularTools, searchQuery]);

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setStep("review");
    router.push(`/review?tool=${tool.slug}`, { scroll: false });
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

  const RatingInput = ({
    label,
    name,
    value,
    required = false,
  }: {
    label: string;
    name: keyof typeof formData;
    value: number;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, [name]: star })}
            className={`text-3xl transition hover:scale-110 ${
              star <= value ? "text-yellow-400" : "text-gray-200"
            }`}
          >
            ★
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground self-center">
            {value}/5
          </span>
        )}
      </div>
    </div>
  );

  // Step 1: Select Tool
  if (step === "select") {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Which tool would you like to review?</h2>

          {/* Search */}
          <div className="relative mb-6">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a tool..."
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-lg"
              autoFocus
            />
          </div>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className="flex items-center gap-4 p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition text-left group"
              >
                {tool.logo ? (
                  <img src={tool.logo} alt="" className="w-12 h-12 rounded-xl flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {tool.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium group-hover:text-primary transition">{tool.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{tool.tagline}</p>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-primary transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tools found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Write Review
  if (existingReview) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">You already reviewed this tool</h2>
        <p className="text-muted-foreground mb-6">
          You can only submit one review per tool. Would you like to review a different tool?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setSelectedTool(null);
              setStep("select");
              router.push("/review");
            }}
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

  return (
    <div className="space-y-6">
      {/* Selected Tool */}
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
          <button
            onClick={() => {
              setSelectedTool(null);
              setStep("select");
              router.push("/review");
            }}
            className="text-sm text-primary hover:underline"
          >
            Change
          </button>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ratings Section */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-6">Rate your experience</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RatingInput label="Overall Rating" name="overallRating" value={formData.overallRating} required />
            <RatingInput label="Ease of Use" name="easeOfUse" value={formData.easeOfUse} />
            <RatingInput label="Value for Money" name="valueForMoney" value={formData.valueForMoney} />
            <RatingInput label="Features" name="features" value={formData.features} />
            <RatingInput label="Customer Support" name="customerSupport" value={formData.customerSupport} />
          </div>

          {/* NPS-style question */}
          <div className="mt-6 pt-6 border-t">
            <label className="block text-sm font-medium mb-3">
              How likely are you to recommend this tool? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData({ ...formData, recommendScore: n })}
                  className={`w-10 h-10 rounded-lg font-medium transition ${
                    formData.recommendScore === n
                      ? n <= 6
                        ? "bg-red-500 text-white"
                        : n <= 8
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
          </div>
        </div>

        {/* Written Review */}
        <div className="bg-white rounded-xl border p-6 space-y-5">
          <h3 className="font-semibold">Write your review</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Summarize your experience in one sentence"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What do you like best? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
              rows={4}
              placeholder="What are the best features? What problems does it solve for you?"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              minLength={50}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.pros.length} characters (minimum 50)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What do you dislike? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
              rows={4}
              placeholder="What could be improved? Any limitations or frustrations?"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              minLength={50}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.cons.length} characters (minimum 50)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              How do you use this tool?
              <span className="text-muted-foreground font-normal"> (Optional)</span>
            </label>
            <textarea
              value={formData.useCases}
              onChange={(e) => setFormData({ ...formData, useCases: e.target.value })}
              rows={3}
              placeholder="Describe your workflow and use cases"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            />
          </div>
        </div>

        {/* Verification Section */}
        <div className="bg-white rounded-xl border p-6 space-y-5">
          <div>
            <h3 className="font-semibold">Help us verify your review</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This information helps us ensure review authenticity. Verified reviews get a badge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                How long have you used this tool? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.usageDuration}
                onChange={(e) => setFormData({ ...formData, usageDuration: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="less_than_month">Less than 1 month</option>
                <option value="1_6_months">1-6 months</option>
                <option value="6_12_months">6-12 months</option>
                <option value="1_2_years">1-2 years</option>
                <option value="more_than_2_years">More than 2 years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company size
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="self_employed">Self-employed</option>
                <option value="1_10">1-10 employees</option>
                <option value="11_50">11-50 employees</option>
                <option value="51_200">51-200 employees</option>
                <option value="201_1000">201-1000 employees</option>
                <option value="1000_plus">1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your role
              </label>
              <select
                value={formData.userRole}
                onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="founder">Founder / CEO</option>
                <option value="executive">Executive (C-suite, VP)</option>
                <option value="manager">Manager / Team Lead</option>
                <option value="individual">Individual Contributor</option>
                <option value="freelancer">Freelancer / Consultant</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                LinkedIn Profile
                <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">+Verified badge</span>
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-1">Your email: {userEmail}</p>
            <p className="text-blue-700">
              We use your email to verify your identity. Work emails matching the tool&apos;s domain
              will receive additional verification.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I confirm this review is based on my genuine experience. I understand that
              fake reviews may be removed and my account may be suspended.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 font-semibold text-lg transition"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}

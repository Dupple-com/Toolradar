"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  ListChecks,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Wand2,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface ToolEditFormProps {
  tool: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    website: string;
    logo: string | null;
    pricing: string;
    tldr: string[];
    features: string[];
    pros: string[];
    cons: string[];
    faqs: FAQ[] | null;
    categoryIds: string[];
  };
  categories: { id: string; name: string }[];
}

export function ToolEditForm({ tool, categories }: ToolEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Basic info
  const [name, setName] = useState(tool.name);
  const [tagline, setTagline] = useState(tool.tagline);
  const [description, setDescription] = useState(tool.description);
  const [website, setWebsite] = useState(tool.website);
  const [logo, setLogo] = useState(tool.logo || "");
  const [pricing, setPricing] = useState(tool.pricing);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(tool.categoryIds);

  // Rich content
  const [tldr, setTldr] = useState<string[]>(
    tool.tldr.length > 0 ? tool.tldr : ["", "", ""]
  );
  const [features, setFeatures] = useState<string[]>(
    tool.features.length > 0 ? tool.features : [""]
  );
  const [pros, setPros] = useState<string[]>(
    tool.pros.length > 0 ? tool.pros : [""]
  );
  const [cons, setCons] = useState<string[]>(
    tool.cons.length > 0 ? tool.cons : [""]
  );
  const [faqs, setFaqs] = useState<FAQ[]>(
    tool.faqs && tool.faqs.length > 0
      ? tool.faqs
      : [{ question: "", answer: "" }]
  );

  const handleAiAutofill = async () => {
    if (!website) {
      toast.error("Please enter a website URL first");
      return;
    }

    setIsAiLoading(true);
    toast.info("Analyzing website... This may take a moment.");

    try {
      const res = await fetch("/api/ai/autofill-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: website,
          categories: categories.map((c) => c.name),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze website");
      }

      // Update form fields with AI-generated content
      if (data.data.tagline) setTagline(data.data.tagline);
      if (data.data.description) setDescription(data.data.description);
      if (data.data.pricing) setPricing(data.data.pricing);
      if (data.data.tldr?.length) setTldr(data.data.tldr.slice(0, 3));
      if (data.data.features?.length) setFeatures(data.data.features);
      if (data.data.pros?.length) setPros(data.data.pros);
      if (data.data.cons?.length) setCons(data.data.cons);
      if (data.data.faqs?.length) setFaqs(data.data.faqs);

      // Match suggested categories
      if (data.data.suggestedCategories?.length) {
        const matchedIds = categories
          .filter((c) =>
            data.data.suggestedCategories.some(
              (sc: string) => sc.toLowerCase() === c.name.toLowerCase()
            )
          )
          .map((c) => c.id);
        if (matchedIds.length) {
          setSelectedCategories(matchedIds);
        }
      }

      toast.success(`Analyzed ${data.pagesAnalyzed?.length || 1} pages successfully!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyze website");
    }

    setIsAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/company/tools/${tool.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          description,
          website,
          logo: logo || null,
          pricing,
          categoryIds: selectedCategories,
          tldr: tldr.filter((t) => t.trim()),
          features: features.filter((f) => f.trim()),
          pros: pros.filter((p) => p.trim()),
          cons: cons.filter((c) => c.trim()),
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        }),
      });

      if (res.ok) {
        toast.success("Tool updated successfully!");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update tool");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  const addArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const updateArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const removeArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info Section */}
      <section className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Basic Information</h2>
          <button
            type="button"
            onClick={handleAiAutofill}
            disabled={isAiLoading || !website}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Auto-fill with AI
              </>
            )}
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tool Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Website URL *
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline *</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
              placeholder="A short, catchy description"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Detailed description of your tool..."
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pricing</label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id]
                    );
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    selectedCategories.includes(cat.id)
                      ? "bg-primary text-white border-primary"
                      : "bg-white hover:bg-muted border-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TL;DR Section */}
      <section className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">TL;DR</h2>
            <p className="text-sm text-muted-foreground">
              3 key points that summarize your tool
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {tldr.map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                {index + 1}
              </div>
              <input
                type="text"
                value={point}
                onChange={(e) =>
                  setTldr((prev) =>
                    prev.map((p, i) => (i === index ? e.target.value : p))
                  )
                }
                placeholder={`Key point ${index + 1}`}
                className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <ListChecks className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Features</h2>
            <p className="text-sm text-muted-foreground">
              List the main features of your tool
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={feature}
                onChange={(e) => updateArrayItem(setFeatures, index, e.target.value)}
                placeholder="Feature..."
                className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(setFeatures, index)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem(setFeatures)}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add feature
          </button>
        </div>
      </section>

      {/* Pros & Cons Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros */}
        <section className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Pros</h2>
              <p className="text-sm text-muted-foreground">
                What makes your tool great
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {pros.map((pro, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => updateArrayItem(setPros, index, e.target.value)}
                  placeholder="Pro..."
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                {pros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setPros, index)}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setPros)}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add pro
            </button>
          </div>
        </section>

        {/* Cons */}
        <section className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-100">
              <ThumbsDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Cons</h2>
              <p className="text-sm text-muted-foreground">
                Be honest about limitations
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {cons.map((con, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => updateArrayItem(setCons, index, e.target.value)}
                  placeholder="Con..."
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                {cons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setCons, index)}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(setCons)}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add con
            </button>
          </div>
        </section>
      </div>

      {/* FAQs Section */}
      <section className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-100">
            <HelpCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">FAQs</h2>
            <p className="text-sm text-muted-foreground">
              Common questions about your tool
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 bg-muted/50 rounded-xl space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-medium text-muted-foreground mt-2.5">
                  Q:
                </span>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    setFaqs((prev) =>
                      prev.map((f, i) =>
                        i === index ? { ...f, question: e.target.value } : f
                      )
                    )
                  }
                  placeholder="Question..."
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                />
                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFaqs((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm font-medium text-muted-foreground mt-2.5">
                  A:
                </span>
                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    setFaqs((prev) =>
                      prev.map((f, i) =>
                        i === index ? { ...f, answer: e.target.value } : f
                      )
                    )
                  }
                  placeholder="Answer..."
                  rows={2}
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white resize-none"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaqs((prev) => [...prev, { question: "", answer: "" }])}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
}

"use client";

interface WrittenData {
  title: string;
  pros: string;
  cons: string;
  useCases: string;
}

interface ReviewWrittenSectionProps {
  data: WrittenData;
  onChange: (field: keyof WrittenData, value: string) => void;
}

/**
 * Written review section for the review form.
 * Collects title, pros, cons, and use cases.
 */
export function ReviewWrittenSection({ data, onChange }: ReviewWrittenSectionProps) {
  const inputClassName =
    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";
  const textareaClassName = `${inputClassName} resize-none`;

  return (
    <div className="bg-white rounded-xl border p-6 space-y-5">
      <h3 className="font-semibold">Write your review</h3>

      <div>
        <label className="block text-sm font-medium mb-2">
          Review Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Summarize your experience in one sentence"
          className={inputClassName}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground mt-1">{data.title.length}/100</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          What do you like best? <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.pros}
          onChange={(e) => onChange("pros", e.target.value)}
          rows={4}
          placeholder="What are the best features? What problems does it solve for you?"
          className={textareaClassName}
          minLength={50}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {data.pros.length} characters (minimum 50)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          What do you dislike? <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.cons}
          onChange={(e) => onChange("cons", e.target.value)}
          rows={4}
          placeholder="What could be improved? Any limitations or frustrations?"
          className={textareaClassName}
          minLength={50}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {data.cons.length} characters (minimum 50)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          How do you use this tool?
          <span className="text-muted-foreground font-normal"> (Optional)</span>
        </label>
        <textarea
          value={data.useCases}
          onChange={(e) => onChange("useCases", e.target.value)}
          rows={3}
          placeholder="Describe your workflow and use cases"
          className={textareaClassName}
        />
      </div>
    </div>
  );
}

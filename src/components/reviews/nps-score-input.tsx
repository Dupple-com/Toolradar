"use client";

interface NpsScoreInputProps {
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}

/**
 * Net Promoter Score input component.
 * Displays a 1-10 scale with color-coded buttons.
 */
export function NpsScoreInput({ value, onChange, required = false }: NpsScoreInputProps) {
  return (
    <div className="mt-6 pt-6 border-t">
      <label className="block text-sm font-medium mb-3">
        How likely are you to recommend this tool?{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-lg font-medium transition ${
              value === n
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
  );
}

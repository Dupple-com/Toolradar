"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  required?: boolean;
}

/**
 * An interactive star rating input component.
 *
 * @example
 * <RatingInput
 *   value={rating}
 *   onChange={setRating}
 *   label="Overall Rating"
 * />
 */
export function RatingInput({
  value,
  onChange,
  label,
  size = "md",
  disabled = false,
  required = false,
}: RatingInputProps) {
  const sizes = {
    sm: "text-xl gap-1",
    md: "text-2xl gap-1.5",
    lg: "text-3xl gap-2",
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={cn("flex", sizes[size])}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            className={cn(
              "transition hover:scale-110 focus:outline-none focus:scale-110",
              star <= value ? "text-yellow-400" : "text-gray-200",
              disabled && "cursor-not-allowed opacity-50 hover:scale-100"
            )}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

interface RatingDisplayProps {
  value: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

/**
 * A static star rating display component.
 *
 * @example
 * <RatingDisplay value={4.5} showValue />
 */
export function RatingDisplay({
  value,
  size = "sm",
  showValue = false,
  className,
}: RatingDisplayProps) {
  const sizes = {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 24,
  };

  const starSize = sizes[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star;
          const partial = !filled && value > star - 1;
          const percentage = partial ? (value - (star - 1)) * 100 : 0;

          return (
            <div key={star} className="relative" style={{ width: starSize, height: starSize }}>
              <Star
                size={starSize}
                className="text-slate-200"
                fill="currentColor"
              />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : `${percentage}%` }}
                >
                  <Star
                    size={starSize}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}

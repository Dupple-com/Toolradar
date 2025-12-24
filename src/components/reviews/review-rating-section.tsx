"use client";

import { RatingInput } from "@/components/ui/rating-input";
import { NpsScoreInput } from "./nps-score-input";

interface RatingData {
  overallRating: number;
  easeOfUse: number;
  valueForMoney: number;
  features: number;
  customerSupport: number;
  recommendScore: number;
}

interface ReviewRatingSectionProps {
  data: RatingData;
  onChange: (field: keyof RatingData, value: number) => void;
}

/**
 * Rating section for the review form.
 * Includes star ratings for various aspects and NPS score.
 */
export function ReviewRatingSection({ data, onChange }: ReviewRatingSectionProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold mb-6">Rate your experience</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <RatingInput
          label="Overall Rating"
          value={data.overallRating}
          onChange={(v) => onChange("overallRating", v)}
          required
          size="lg"
        />
        <RatingInput
          label="Ease of Use"
          value={data.easeOfUse}
          onChange={(v) => onChange("easeOfUse", v)}
          size="lg"
        />
        <RatingInput
          label="Value for Money"
          value={data.valueForMoney}
          onChange={(v) => onChange("valueForMoney", v)}
          size="lg"
        />
        <RatingInput
          label="Features"
          value={data.features}
          onChange={(v) => onChange("features", v)}
          size="lg"
        />
        <RatingInput
          label="Customer Support"
          value={data.customerSupport}
          onChange={(v) => onChange("customerSupport", v)}
          size="lg"
        />
      </div>

      <NpsScoreInput
        value={data.recommendScore}
        onChange={(v) => onChange("recommendScore", v)}
        required
      />
    </div>
  );
}

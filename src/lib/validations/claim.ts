import { z } from "zod";

/**
 * Validation schema for company claim requests.
 */
export const claimSchema = z
  .object({
    companyId: z.string().min(1, "Company is required"),
    workEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
    jobTitle: z.string().max(100, "Job title must be less than 100 characters").optional(),
    linkedinUrl: z
      .string()
      .url("Invalid LinkedIn URL")
      .refine(
        (url) => !url || url.includes("linkedin.com"),
        "Must be a LinkedIn URL"
      )
      .optional()
      .or(z.literal("")),
    additionalNotes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
  })
  .refine(
    (data) => data.workEmail || data.linkedinUrl,
    {
      message: "Either work email or LinkedIn profile is required",
      path: ["workEmail"],
    }
  );

export type ClaimInput = z.infer<typeof claimSchema>;

/**
 * Validation schema for claim moderation (admin).
 */
export const claimModerationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().max(500).optional(),
});

export type ClaimModerationInput = z.infer<typeof claimModerationSchema>;

import { z } from "zod";

/**
 * Validation schema for review submission.
 */
export const reviewSchema = z.object({
  toolId: z.string().min(1, "Tool is required"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  pros: z
    .string()
    .min(10, "Pros must be at least 10 characters")
    .max(1000, "Pros must be less than 1000 characters"),
  cons: z
    .string()
    .min(10, "Cons must be at least 10 characters")
    .max(1000, "Cons must be less than 1000 characters"),
  overallRating: z
    .number()
    .int()
    .min(1, "Overall rating is required")
    .max(5, "Rating must be between 1 and 5"),
  easeOfUse: z
    .number()
    .int()
    .min(1, "Ease of use rating is required")
    .max(5, "Rating must be between 1 and 5"),
  valueForMoney: z
    .number()
    .int()
    .min(1, "Value for money rating is required")
    .max(5, "Rating must be between 1 and 5"),
  features: z
    .number()
    .int()
    .min(1, "Features rating is required")
    .max(5, "Rating must be between 1 and 5"),
  useCases: z.string().max(500, "Use cases must be less than 500 characters").optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

/**
 * Validation schema for review reply.
 */
export const reviewReplySchema = z.object({
  content: z
    .string()
    .min(5, "Reply must be at least 5 characters")
    .max(1000, "Reply must be less than 1000 characters"),
});

export type ReviewReplyInput = z.infer<typeof reviewReplySchema>;

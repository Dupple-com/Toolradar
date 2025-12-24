import { z } from "zod";

/**
 * Validation schema for tool submission.
 */
export const toolSubmissionSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(200, "Tagline must be less than 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be less than 5000 characters"),
  website: z.string().url("Invalid website URL"),
  pricing: z.enum(["free", "freemium", "paid"], {
    errorMap: () => ({ message: "Invalid pricing option" }),
  }),
  categoryId: z.string().min(1, "Category is required"),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
});

export type ToolSubmissionInput = z.infer<typeof toolSubmissionSchema>;

/**
 * Validation schema for admin tool creation/update.
 */
export const toolAdminSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  tagline: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  website: z.string().url(),
  pricing: z.enum(["free", "freemium", "paid"]),
  status: z.enum(["draft", "published", "archived"]).optional(),
  editorialScore: z.number().int().min(0).max(100).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export type ToolAdminInput = z.infer<typeof toolAdminSchema>;

/**
 * Validation schema for tool search/filter params.
 */
export const toolSearchSchema = z.object({
  q: z.string().max(200).optional(),
  pricing: z.enum(["all", "free", "freemium", "paid"]).optional(),
  category: z.string().max(100).optional(),
  sort: z.enum(["score", "reviews", "trending", "recent"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type ToolSearchParams = z.infer<typeof toolSearchSchema>;

/**
 * Application Constants
 *
 * Centralized configuration values to avoid magic numbers
 * and ensure consistency across the codebase.
 */

// =============================================================================
// Revalidation (ISR)
// =============================================================================

/** Default revalidation interval in seconds (1 hour) */
export const REVALIDATE_DEFAULT = 3600;

/** Revalidation interval for trending data (30 minutes) */
export const REVALIDATE_TRENDING = 1800;

/** Revalidation interval for frequently changing data (5 minutes) */
export const REVALIDATE_FREQUENT = 300;

// =============================================================================
// Pagination
// =============================================================================

/** Default number of items per page */
export const ITEMS_PER_PAGE = 20;

/** Maximum items per page for API requests */
export const MAX_ITEMS_PER_PAGE = 100;

/** Number of tools to show on homepage sections */
export const HOMEPAGE_TOOLS_COUNT = 6;

/** Number of tools to show in category pages */
export const CATEGORY_TOOLS_COUNT = 50;

/** Number of tools to show in search results */
export const SEARCH_RESULTS_LIMIT = 20;

/** Number of tools for command palette search */
export const COMMAND_SEARCH_LIMIT = 6;

// =============================================================================
// Static Generation
// =============================================================================

/** Max number of tools to pre-render at build time */
export const STATIC_TOOLS_LIMIT = 100;

/** Max number of categories to pre-render */
export const STATIC_CATEGORIES_LIMIT = 100;

/** Max number of companies to pre-render */
export const STATIC_COMPANIES_LIMIT = 100;

/** Max number of comparison pages to pre-render */
export const STATIC_COMPARISONS_LIMIT = 50;

// =============================================================================
// User Settings
// =============================================================================

/** Number of days between allowed name changes */
export const DAYS_BETWEEN_NAME_CHANGES = 30;

/** Maximum pending claims per user */
export const MAX_PENDING_CLAIMS = 3;

// =============================================================================
// Content Limits
// =============================================================================

/** Maximum length for tool names */
export const MAX_TOOL_NAME_LENGTH = 100;

/** Maximum length for taglines */
export const MAX_TAGLINE_LENGTH = 200;

/** Maximum length for descriptions */
export const MAX_DESCRIPTION_LENGTH = 5000;

/** Minimum length for review text */
export const MIN_REVIEW_LENGTH = 10;

/** Maximum length for review text */
export const MAX_REVIEW_LENGTH = 1000;

// =============================================================================
// Scoring
// =============================================================================

/** Maximum editorial score */
export const MAX_EDITORIAL_SCORE = 100;

/** Maximum rating (stars) */
export const MAX_RATING = 5;

// =============================================================================
// Cache Control
// =============================================================================

/** Cache duration for search results (5 minutes) */
export const CACHE_SEARCH_SECONDS = 300;

/** Cache duration for badge scripts (1 day) */
export const CACHE_BADGE_SECONDS = 86400;

/** Stale-while-revalidate for search (1 hour) */
export const SWR_SEARCH_SECONDS = 3600;

/** Stale-while-revalidate for badge (1 week) */
export const SWR_BADGE_SECONDS = 604800;

// =============================================================================
// Pricing Types
// =============================================================================

export const PRICING_TYPES = ["free", "freemium", "paid"] as const;
export type PricingType = (typeof PRICING_TYPES)[number];

// =============================================================================
// Tool Status
// =============================================================================

export const TOOL_STATUSES = ["draft", "published", "archived"] as const;
export type ToolStatus = (typeof TOOL_STATUSES)[number];

// =============================================================================
// Review Status
// =============================================================================

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

// =============================================================================
// Claim Status
// =============================================================================

export const CLAIM_STATUSES = ["pending", "approved", "rejected"] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

import { NextResponse } from "next/server";

/**
 * API Response Helpers
 *
 * Standardized response utilities for consistent API responses.
 */

interface SuccessOptions {
  status?: number;
  headers?: Record<string, string>;
}

interface ErrorDetails {
  field?: string;
  code?: string;
}

/**
 * Create a success JSON response.
 *
 * @example
 * return successResponse({ user: { id: 1, name: "John" } });
 * return successResponse({ created: true }, { status: 201 });
 */
export function successResponse<T>(data: T, options: SuccessOptions = {}) {
  const { status = 200, headers = {} } = options;
  return NextResponse.json(data, { status, headers });
}

/**
 * Create an error JSON response.
 *
 * @example
 * return errorResponse("Invalid input", 400);
 * return errorResponse("Not found", 404, { field: "id" });
 */
export function errorResponse(
  message: string,
  status = 400,
  details?: ErrorDetails
) {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Create a 401 Unauthorized response.
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, 401);
}

/**
 * Create a 403 Forbidden response.
 */
export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, 403);
}

/**
 * Create a 404 Not Found response.
 */
export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Create a 500 Internal Server Error response.
 */
export function serverErrorResponse(message = "Internal server error") {
  return errorResponse(message, 500);
}

/**
 * Create a cached success response.
 *
 * @example
 * return cachedResponse(data, 3600); // Cache for 1 hour
 */
export function cachedResponse<T>(
  data: T,
  maxAge: number,
  staleWhileRevalidate?: number
) {
  const cacheControl = staleWhileRevalidate
    ? `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    : `public, s-maxage=${maxAge}`;

  return successResponse(data, {
    headers: { "Cache-Control": cacheControl },
  });
}

/**
 * Parse and validate request JSON body.
 * Returns [data, null] on success, [null, error response] on failure.
 *
 * @example
 * const [body, error] = await parseBody<{ name: string }>(request);
 * if (error) return error;
 * // body is typed as { name: string }
 */
export async function parseBody<T>(
  request: Request
): Promise<[T, null] | [null, NextResponse]> {
  try {
    const body = await request.json();
    return [body as T, null];
  } catch {
    return [null, errorResponse("Invalid JSON body", 400)];
  }
}

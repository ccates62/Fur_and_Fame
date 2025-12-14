/**
 * URL Utilities
 * Centralized functions for getting base URLs and constructing absolute URLs
 */

/**
 * Get the base URL for the application
 * Uses environment variable in production, localhost in development
 */
export function getBaseUrl(): string {
  // In production, use the configured base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // In development, use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Fallback to production domain
  return "https://www.furandfame.com";
}

/**
 * Get the full URL for a path
 * @param path - The path to append (e.g., "/create", "/variants")
 * @returns Full URL including domain
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get the site URL (alias for getBaseUrl for consistency)
 */
export function getSiteUrl(): string {
  return getBaseUrl();
}

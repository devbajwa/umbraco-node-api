// Tiny Helpers

// The routeToSlug function is designed to clean up a given route path by removing any leading or trailing forward slashes (/), effectively converting a full path into a clean "slug" "/e-commerce-platform/" to cleaned Path will be: "e-commerce-platform"
export function routeToSlug(routePath = "") {
  return routePath.replace(/^\/+|\/+$/g, "");
}

export function mediaUrl(relativeUrl = "") {
  const CMS_BASE = process.env.CMS_BASE;
  if (!relativeUrl) return "";
  return relativeUrl.startsWith("http")
    ? relativeUrl
    : `${CMS_BASE}${relativeUrl}`;
}

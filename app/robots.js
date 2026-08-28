// SEO robots rules — allow public routes, disallow /admin and /api.
// TODO: Point sitemap to the deployed domain and disallow admin/api paths.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
  };
}

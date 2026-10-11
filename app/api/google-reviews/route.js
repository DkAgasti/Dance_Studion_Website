// GET /api/google-reviews — proxies the studio's live Google reviews from
// Featurable (https://featurable.com) so the homepage widget can render its
// own custom UI instead of Featurable's embed script. Server-side only,
// since Featurable's API has no CORS headers for direct browser fetches.
const WIDGET_ID = "002a38a4-0435-4bba-af5b-9bd2f464f4d8";
const FEATURABLE_URL = `https://api.featurable.com/v1/widgets/${WIDGET_ID}`;

export async function GET() {
  try {
    const res = await fetch(FEATURABLE_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Featurable API responded ${res.status}`);
    const data = await res.json();

    return Response.json({
      averageRating: data.averageRating ?? null,
      totalReviewCount: data.totalReviewCount ?? null,
      profileUrl: data.profileUrl ?? null,
      reviews: (data.reviews ?? []).map((r) => ({
        id: r.reviewId,
        name: r.reviewer?.displayName ?? "Google user",
        avatarUrl: r.reviewer?.profilePhotoUrl ?? null,
        rating: r.starRating ?? 5,
        text: r.comment ?? "",
        createTime: r.createTime ?? null,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return Response.json(
      { averageRating: null, totalReviewCount: null, profileUrl: null, reviews: [] },
      { status: 502 }
    );
  }
}

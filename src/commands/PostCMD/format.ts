import RatingStats from "@/models/ratingStats";

/** "★ 4.5 (2)" or "no ratings". */
export const formatRating = (s: RatingStats): string =>
  s.rating_avg === null
    ? "no ratings"
    : `★ ${s.rating_avg.toFixed(1)} (${s.rating_count})`;

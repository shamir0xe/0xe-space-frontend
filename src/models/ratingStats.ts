/** Aggregate rating of a post or comment. rating_avg is null without ratings. */
type RatingStats = {
  rating_avg: number | null;
  rating_count: number;
  my_rating: number | null;
};

export default RatingStats;

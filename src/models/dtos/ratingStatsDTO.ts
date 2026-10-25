/* eslint-disable @typescript-eslint/no-explicit-any */
import RatingStats from "../ratingStats";

const ratingStatsDTO = (data: any): RatingStats => ({
  rating_avg: typeof data?.rating_avg === "number" ? data.rating_avg : null,
  rating_count: typeof data?.rating_count === "number" ? data.rating_count : 0,
  my_rating: typeof data?.my_rating === "number" ? data.my_rating : null,
});

export default ratingStatsDTO;

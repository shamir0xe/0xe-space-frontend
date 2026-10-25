import RatingStats from "@/models/ratingStats";
import { useState } from "react";

type StarRatingProps = {
  stats: RatingStats;
  /** Present when the viewer may rate; null removes their rating. */
  onRate?: (value: number | null) => Promise<void>;
  size?: "sm" | "md";
};

/** Average rating with clickable stars for logged-in viewers. */
const StarRating = ({ stats, onRate, size = "md" }: StarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shown = hover ?? stats.my_rating ?? Math.round(stats.rating_avg ?? 0);
  const text =
    stats.rating_avg === null
      ? "no ratings yet"
      : `${stats.rating_avg.toFixed(1)} (${stats.rating_count})`;

  const rate = async (value: number | null) => {
    if (!onRate || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onRate(value);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-1 ${size === "sm" ? "text-xs" : "text-sm"}`}
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onRate || busy}
          aria-label={`rate ${n}`}
          className={`${n <= shown ? "text-yellow-400" : "text-gray-500"} ${onRate ? "cursor-pointer" : "cursor-default"}`}
          onMouseEnter={() => onRate && setHover(n)}
          onClick={() => rate(n)}
        >
          ★
        </button>
      ))}
      <span className="text-gray-400 ml-1">{text}</span>
      {onRate && stats.my_rating !== null && (
        <button
          type="button"
          className="text-gray-400 hover:text-white ml-1"
          title="remove your rating"
          onClick={() => rate(null)}
        >
          ×
        </button>
      )}
      {error && <span className="text-red-400 ml-2">{error}</span>}
    </div>
  );
};

export default StarRating;

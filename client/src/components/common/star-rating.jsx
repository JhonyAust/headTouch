import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  console.log(rating, "rating");

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`
            relative p-2 rounded-full transition-all duration-300 ease-out
            transform hover:scale-110 active:scale-95
            ${
              star <= rating
                ? "text-yellow-400 hover:text-yellow-500 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 shadow-sm hover:shadow-md"
                : "text-gray-300 hover:text-yellow-400 bg-white hover:bg-yellow-50 border-gray-200 hover:border-yellow-200"
            }
            ${handleRatingChange ? "cursor-pointer" : "cursor-default"}
          `}
          variant="outline"
          size="icon"
          onClick={handleRatingChange ? () => handleRatingChange(star) : null}
          disabled={!handleRatingChange}
        >
          {/* Animated glow effect for filled stars */}
          {star <= rating && (
            <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-md animate-pulse" />
          )}
          
          <StarIcon
            className={`
              w-5 h-5 relative z-10 transition-all duration-300
              ${
                star <= rating 
                  ? "fill-yellow-400 stroke-yellow-500 drop-shadow-sm" 
                  : "fill-none stroke-gray-400"
              }
            `}
          />
        </Button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
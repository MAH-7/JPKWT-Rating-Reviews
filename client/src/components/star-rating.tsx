import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Star
          key={rating}
          className={`${sizeClasses[size]} transition-colors duration-200 ${
            readonly ? '' : 'cursor-pointer'
          } ${
            (hoverValue >= rating || (!hoverValue && value >= rating))
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}

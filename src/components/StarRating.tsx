import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
    productId?: string;
    readonly?: boolean;
    initialRating?: number;
    onRate?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
}

export default function StarRating({
    readonly = false,
    initialRating = 0,
    onRate,
    size = "md",
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleClick = (value: number) => {
        if (!readonly) {
            setRating(value);
            onRate?.(value);
        }
    };

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`transition-all ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        }`}
                >
                    <Star
                        className={`${sizeClasses[size]} transition-colors ${star <= (hover || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                    />
                </button>
            ))}
            {!readonly && (
                <span className="ml-2 text-sm text-muted-foreground">
                    {rating > 0 ? `${rating}/5` : "Rate this"}
                </span>
            )}
        </div>
    );
}

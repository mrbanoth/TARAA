import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRatings } from "@/hooks/useRatings";

interface AddReviewFormProps {
    productId: string;
    onReviewAdded?: () => void;
}

export default function AddReviewForm({ productId, onReviewAdded }: AddReviewFormProps) {
    const { addRating } = useRatings();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [userName, setUserName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            return;
        }

        setSubmitting(true);

        const result = await addRating(
            productId,
            rating,
            reviewText.trim() || undefined,
            userName.trim() || undefined
        );

        if (result) {
            // Reset form
            setRating(0);
            setReviewText("");
            setUserName("");
            onReviewAdded?.();
        }

        setSubmitting(false);
    };

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Write a Review
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Stars */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Rating *</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="transition-all hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hover || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-200"
                                            }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-sm font-medium text-primary">
                                    {rating}/5 Stars
                                </span>
                            )}
                        </div>
                    </div>

                    {/* User Name */}
                    <div className="space-y-2">
                        <label htmlFor="userName" className="text-sm font-medium">
                            Your Name (Optional)
                        </label>
                        <Input
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Anonymous Student"
                            maxLength={50}
                        />
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <label htmlFor="reviewText" className="text-sm font-medium">
                            Your Review (Optional)
                        </label>
                        <Textarea
                            id="reviewText"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {reviewText.length}/500 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={rating === 0 || submitting}
                        className="w-full"
                        size="lg"
                    >
                        {submitting ? (
                            <>
                                <span className="animate-spin mr-2">⌛</span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Review
                            </>
                        )}
                    </Button>

                    {rating === 0 && (
                        <p className="text-sm text-center text-muted-foreground">
                            Please select a rating to submit your review
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

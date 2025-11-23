import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/hooks/useRatings";
import { formatDistanceToNow } from "date-fns";

interface ReviewsListProps {
    ratings: Rating[];
    loading?: boolean;
}

export default function ReviewsList({ ratings, loading }: ReviewsListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (ratings.length === 0) {
        return (
            <Card className="border-2 border-dashed">
                <CardContent className="p-12 text-center">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">
                        Be the first to share your thoughts about this product!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {ratings.map((rating) => (
                <Card key={rating.id} className="border-2 hover:border-primary/30 transition-all">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        {rating.user_name || "Anonymous Student"}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(rating.created_at), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {rating.rating}/5
                            </Badge>
                        </div>

                        {/* Stars Display */}
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= rating.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-200 text-gray-200"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Review Text */}
                        {rating.review_text && (
                            <p className="text-foreground leading-relaxed">{rating.review_text}</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

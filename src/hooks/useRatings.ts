import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Rating {
    id: string;
    product_id: string;
    user_id?: string;
    rating: number;
    review_text?: string;
    user_name?: string;
    user_email?: string;
    created_at: string;
    updated_at: string;
}

export interface AverageRating {
    average: number;
    total: number;
}

export function useRatings(productId?: string) {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [averageRating, setAverageRating] = useState<AverageRating>({ average: 0, total: 0 });
    const [loading, setLoading] = useState(false);

    // Fetch ratings for a specific product
    const fetchRatings = async (pId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('ratings')
                .select('*')
                .eq('product_id', pId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const ratingsData = data || [];
            setRatings(ratingsData);

            // Calculate average
            if (ratingsData.length > 0) {
                const sum = ratingsData.reduce((acc, r) => acc + r.rating, 0);
                const avg = sum / ratingsData.length;
                setAverageRating({
                    average: Math.round(avg * 10) / 10, // Round to 1 decimal
                    total: ratingsData.length,
                });
            } else {
                setAverageRating({ average: 0, total: 0 });
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load ratings when productId changes
    useEffect(() => {
        if (productId) {
            fetchRatings(productId);
        }
    }, [productId]);

    // Add a new rating
    const addRating = async (
        productId: string,
        rating: number,
        reviewText?: string,
        userName?: string,
        userEmail?: string
    ) => {
        try {
            const { data, error } = await supabase
                .from('ratings')
                .insert({
                    product_id: productId,
                    rating,
                    review_text: reviewText,
                    user_name: userName,
                    user_email: userEmail,
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('Thank you for your review! ⭐');

            // Refresh ratings
            if (productId) {
                await fetchRatings(productId);
            }

            return data;
        } catch (error) {
            console.error('Error adding rating:', error);
            toast.error('Failed to submit rating. Please try again.');
            return null;
        }
    };

    // Get average rating for multiple products
    const getAverageRatings = async (productIds: string[]) => {
        try {
            const { data, error } = await supabase
                .from('ratings')
                .select('product_id, rating')
                .in('product_id', productIds);

            if (error) throw error;

            // Group by product_id and calculate averages
            const averages: Record<string, AverageRating> = {};

            productIds.forEach(id => {
                const productRatings = data?.filter(r => r.product_id === id) || [];
                if (productRatings.length > 0) {
                    const sum = productRatings.reduce((acc, r) => acc + r.rating, 0);
                    const avg = sum / productRatings.length;
                    averages[id] = {
                        average: Math.round(avg * 10) / 10,
                        total: productRatings.length,
                    };
                } else {
                    averages[id] = { average: 0, total: 0 };
                }
            });

            return averages;
        } catch (error) {
            console.error('Error fetching average ratings:', error);
            return {};
        }
    };

    return {
        ratings,
        averageRating,
        loading,
        addRating,
        fetchRatings,
        getAverageRatings,
    };
}

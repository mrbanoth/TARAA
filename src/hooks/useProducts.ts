import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product } from '@/data/products';
import { toast } from 'sonner';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to refresh products';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function fetchProducts() {
            try {
                if (!isSupabaseConfigured()) {
                    // If Supabase is not set up yet, return empty list (as requested)
                    // or you could return dummy data if you changed your mind
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setProducts(data || []);
            } catch (err: unknown) {
                // Silent error handling for security
                const message = err instanceof Error ? err.message : 'Failed to load products';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();

        // Real-time subscription
        const channel = supabase
            .channel('products_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    fetchProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { products, loading, error, refreshProducts };
}

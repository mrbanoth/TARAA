import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product } from '@/data/products';
import { toast } from 'sonner';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            } catch (err: any) {
                // Silent error handling for security
                setError(err.message);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return { products, loading, error };
}

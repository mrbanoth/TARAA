import { useState, useEffect } from "react";
import { getFavorites, toggleFavorite as toggleFavoriteStorage, isFavorite as checkIsFavorite } from "@/lib/storage";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const toggleFavorite = (productId: string) => {
        const newState = toggleFavoriteStorage(productId);
        setFavorites(getFavorites());
        return newState;
    };

    const isFavorite = (productId: string) => {
        return favorites.includes(productId);
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite,
    };
}

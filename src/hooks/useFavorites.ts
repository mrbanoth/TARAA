import { useState, useEffect } from "react";
import { getFavorites, toggleFavorite as toggleFavoriteStorage, isFavorite as checkIsFavorite } from "@/lib/storage";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        // Initial load
        setFavorites(getFavorites());

        // Listen for updates
        const handleStorageChange = () => {
            setFavorites(getFavorites());
        };

        window.addEventListener("favorites-updated", handleStorageChange);
        // Also listen for storage events (cross-tab support)
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("favorites-updated", handleStorageChange);
            window.removeEventListener("storage", handleStorageChange);
        };
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

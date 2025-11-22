// LocalStorage utility functions for TARAA

// Favorites management
const FAVORITES_KEY = "taraa_favorites";

export const getFavorites = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch {
        return [];
    }
};

export const toggleFavorite = (productId: string): boolean => {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);

    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return false;
    } else {
        // Add to favorites
        favorites.push(productId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    }
};

export const isFavorite = (productId: string): boolean => {
    const favorites = getFavorites();
    return favorites.includes(productId);
};

// Recently viewed management
const RECENTLY_VIEWED_KEY = "taraa_recently_viewed";
const MAX_RECENTLY_VIEWED = 10;

export const getRecentlyViewed = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
        const recentlyViewed = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return recentlyViewed ? JSON.parse(recentlyViewed) : [];
    } catch {
        return [];
    }
};

export const addToRecentlyViewed = (productId: string): void => {
    let recentlyViewed = getRecentlyViewed();

    // Remove if already exists to avoid duplicates
    recentlyViewed = recentlyViewed.filter(id => id !== productId);

    // Add to beginning
    recentlyViewed.unshift(productId);

    // Keep only the latest MAX_RECENTLY_VIEWED items
    recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
};

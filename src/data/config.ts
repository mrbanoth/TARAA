// TARAA Configuration File
// All customizable values in one place for easy management

// ====================================
// CATEGORY CONFIGURATION
// ====================================
export const CATEGORIES = [
    { value: "all", label: "All" },
    { value: "tshirt", label: "T-Shirts" },
    { value: "shirt", label: "Shirts" },
    { value: "bag", label: "Bags" },
    { value: "tech", label: "Tech" },
    { value: "shoes", label: "Shoes" },
    { value: "watch", label: "Watches" },
    { value: "hostel", label: "Hostel" },
    { value: "books", label: "Books" },
    { value: "accessories", label: "Accessories" },
] as const;

// ====================================
// PRICE RANGES
// ====================================
export const PRICE_RANGES = [
    { value: "under299", label: "Under ₹299", min: 0, max: 299 },
    { value: "300-399", label: "₹300 – ₹399", min: 300, max: 399 },
    { value: "400plus", label: "₹400+", min: 400, max: Infinity },
] as const;

// ====================================
// AVAILABLE SIZES (Only for clothing)
// ====================================
export const AVAILABLE_SIZES = ["M", "L", "XL", "XXL"] as const;

// ====================================
// CLOTHING CATEGORIES
// Categories that support size filtering
// ====================================
export const CLOTHING_CATEGORIES = ["tshirt", "shirt"] as const;

// Helper function to check if a category supports sizes
export const isSizableCategory = (category: string): boolean => {
    return CLOTHING_CATEGORIES.includes(category as any);
};

// ====================================
// TRENDING THRESHOLD
// Change this value to control what counts as "trending"
// ====================================
export const TRENDING_CLICKS_THRESHOLD = 1200;

// ====================================
// FEATURED PRODUCTS COUNT
// How many products to show in different sections
// ====================================
export const PRODUCT_COUNTS = {
    featured: 6,
    trending: 6,
    related: 4,
    heroGrid: 4,
    recentlyViewed: 10, // Max items to store in localStorage
} as const;

// ====================================
// CONTACT INFORMATION
// Update these to change contact details across the site
// ====================================
export const CONTACT_INFO = {
    phone: "+91 1234567890",
    email: "support@taraa.in",
    partnersEmail: "partners@taraa.in",
    workingHours: "Mon-Fri, 9AM-6PM IST",
} as const;

// ====================================
// SOCIAL MEDIA
// ====================================
export const SOCIAL_MEDIA = {
    twitter: "@TARAA",
    // Add more social links as needed
} as const;

// ====================================
// NAVIGATION LINKS
// ====================================
export const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/deals", label: "Deals" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
] as const;

// ====================================
// BANNER CONFIGURATION
// ====================================
export const TOP_BANNER = {
    show: true, // Set to false to hide top banner
    message: "Get 50% Off on Selected Items",
    linkText: "Shop Now",
    linkUrl: "/deals",
} as const;

// ====================================
// SITE INFORMATION
// ====================================
export const SITE_INFO = {
    name: "TARAA",
    tagline: "Handpicked Deals",
    description: "Handpicked deals for students and budget shoppers",
    year: new Date().getFullYear(),
} as const;

// ====================================
// SPACING/PADDING CONFIGURATION
// Easy control of page spacing
// ====================================
export const SPACING = {
    heroTopPadding: "py-8 md:py-12 lg:py-16", // Reduced from py-12 md:py-20 lg:py-24
    sectionPadding: "py-12 md:py-16",
    containerPadding: "px-4 sm:px-6",
} as const;

// ====================================
// HELPER FUNCTIONS
// ====================================

// Check if product is trending based on clicks
export const isTrending = (clicks?: number): boolean => {
    return clicks !== undefined && clicks > TRENDING_CLICKS_THRESHOLD;
};

// Get category label by value
export const getCategoryLabel = (value: string): string => {
    const category = CATEGORIES.find(cat => cat.value === value);
    return category?.label || value;
};

// Check if price is in range
export const isPriceInRange = (price: number, rangeValue: string): boolean => {
    const range = PRICE_RANGES.find(r => r.value === rangeValue);
    if (!range) return false;
    return price >= range.min && price <= range.max;
};

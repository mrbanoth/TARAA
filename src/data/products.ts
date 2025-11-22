export type Category = "tshirt" | "bag" | "tech" | "hostel" | "shoes" | "other";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  images?: string[];
  affiliateUrl: string;
  isFeatured?: boolean;
  clicks?: number;
  rating?: number;
  sizes?: string[];
  tag?: string;
  platform?: "meesho" | "amazon" | "flipkart" | "myntra" | "other"; // Added platform support
  created_at?: string;
}

// Export empty array as default to prevent import errors in existing files
// untill they are updated to use the hook
export const products: Product[] = [];

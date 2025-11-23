export type Category = "tshirt" | "shirt" | "bag" | "tech" | "hostel" | "shoes" | "watch" | "books" | "accessories" | "other" | "ad_banner";
export type Gender = "men" | "women" | "unisex";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  gender?: Gender;
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

/**
 * DEALS PAGE
 * Main deals browsing page with search and filtering
 * 
 * Features:
 * - Search products by name/description
 * - Filter by category, price range, and size
 * - Responsive design (mobile filter sheet, desktop inline)
 * - Active filter tags for easy removal
 * - Product count display
 * 
 * Config: Edit src/data/config.ts to change:
 * - Categories, price ranges, sizes
 * - Trending threshold
 * - Product counts
 */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductGrid from "@/components/ProductGrid";
import ProductCarousel from "@/components/ProductCarousel";
import { products, Category } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Package, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import configuration
import {
  CATEGORIES,
  PRICE_RANGES,
  AVAILABLE_SIZES,
  isPriceInRange,
  getCategoryLabel,
  isSizableCategory,
} from "@/data/config";

// ====================================
// TYPES
// ====================================
interface Filters {
  category: Category | "all";
  priceRange: string[];
  sizes: string[];
  search: string;
  gender: string | null;
}

// ====================================
// MAIN COMPONENT
// ====================================
export default function Deals() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const location = useLocation();
  const { products, loading } = useProducts();

  // Extract gender from pathname
  const getGenderFromPath = (path: string) => {
    if (path.startsWith('/men')) return 'men';
    if (path.startsWith('/women')) return 'women';
    if (path.startsWith('/unisex')) return 'unisex';
    return null;
  };

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    category: (categoryParam as Category) || "all",
    priceRange: [],
    sizes: [],
    search: "",
    gender: getGenderFromPath(location.pathname)
  });

  // Update filters when URL or path changes
  useEffect(() => {
    const newFilters: Partial<Filters> = {};
    
    if (categoryParam) {
      newFilters.category = categoryParam as Category;
    } else {
      newFilters.category = "all";
    }
    
    const genderFromPath = getGenderFromPath(location.pathname);
    if (genderFromPath) {
      newFilters.gender = genderFromPath;
    } else {
      newFilters.gender = null;
    }
    
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, [categoryParam, location.pathname]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    if (loading) return [];
    return products.filter((product) => {
      // Strictly exclude any women's products by checking multiple indicators
      const gender = (product.gender || '').toLowerCase().trim();
      const name = product.name.toLowerCase();
      const description = (product.description || '').toLowerCase();
      
      // Comprehensive list of women-related terms to exclude
      const womensTerms = [
        // Genders
        'women', 'woman', 'female', 'ladies', 'girl',
        // Common in product names/descriptions
        'womens', 'women\'s', 'female\'s', 'ladies\'s', 'girls', 'girl\'s',
        'wmn', 'wom', 'femail', 'fem', 'f', 'w',
        // Common women's fashion terms
        'maxi', 'midi', 'saree', 'sari', 'lehenga', 'anarkali', 'salwar', 'kurti',
        'pink', 'pink', 'pink', 'pink', // Common women's color
        'floral', 'floral', // Common women's pattern
        'mustard yellow', 'yellow', 'mustard', // Specific to the mentioned product
        'heels', 'heal', 'pump', 'stiletto', 'wedge',
        'handbag', 'clutch', 'tote', 'purse', 'pocketbook',
        'makeup', 'cosmetic', 'beauty', 'skincare', 'lipstick', 'eyeshadow',
        'dress', 'skirt', 'blouse', 'top', 'blazer', 'cardigan', 'sweater',
        'lingerie', 'bra', 'panty', 'panties', 'nighty', 'nightie', 'nightwear',
        'jewelry', 'jewellery', 'necklace', 'earring', 'bangle', 'bracelet', 'ring', 'anklet'
      ];
      
      // Check if any women's term appears in gender, name, or description
      const isWomensProduct = womensTerms.some(term => 
        gender.includes(term) || 
        name.includes(term) ||
        description.includes(term) ||
        // Check for terms with spaces around them (whole word match)
        new RegExp(`\\b${term}\\b`, 'i').test(name) ||
        new RegExp(`\\b${term}\\b`, 'i').test(description)
      );
      
      // Additional check for common women's categories
      const isWomensCategory = [
        'lingerie', 'intimate', 'beauty', 'cosmetics', 'jewelry', 'jewellery',
        'handbags', 'purses', 'wallets', 'accessories', 'fragrance', 'perfume'
      ].some(cat => product.category.toLowerCase().includes(cat));
      
      if (isWomensProduct) {
        return false;
      }

      // Search filter - check name and description
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }
      
      // Gender filter
      if (filters.gender && product.gender && product.gender !== filters.gender) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.length > 0) {
        const matchesPrice = filters.priceRange.some((range) =>
          isPriceInRange(product.price, range)
        );
        if (!matchesPrice) return false;
      }

      // Size filter - only applicable if product has sizes
      if (filters.sizes.length > 0 && product.sizes) {
        const matchesSize = filters.sizes.some((size) => product.sizes?.includes(size));
        if (!matchesSize) return false;
      }

      return true;
    });
  }, [filters, products, loading]);

  // ====================================
  // FILTER HANDLERS
  // ====================================
  const handleCategoryChange = (category: Category | "all") => {
    setFilters({ ...filters, category });
  };

  const handlePriceRangeToggle = (range: string) => {
    const newPriceRange = filters.priceRange.includes(range)
      ? filters.priceRange.filter((r) => r !== range)
      : [...filters.priceRange, range];
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    setFilters({ ...filters, sizes: newSizes });
  };

  const handleClearFilters = () => {
    setFilters({ category: "all", priceRange: [], sizes: [], search: "", gender: null });
    // Navigate back to /deals when clearing filters
    window.history.pushState({}, '', '/deals');
  };

  // Check if any filters are active (excluding gender from path)
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.priceRange.length > 0 ||
    filters.sizes.length > 0 ||
    filters.search.length > 0 ||
    (!!filters.gender && !['/men', '/women', '/unisex'].includes(location.pathname));

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    filters.priceRange.length +
    filters.sizes.length +
    (filters.gender ? 1 : 0);

  // ====================================
  // RENDER
  // ====================================
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* ========== MOBILE LAYOUT ========== */}
        <div className="md:hidden mb-6 space-y-3">
          {/* Mobile Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="w-full">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-primary">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                {/* Mobile Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat.value}
                        variant={filters.category === cat.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryChange(cat.value as Category | "all")}
                      >
                        {cat.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <div key={range.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`mobile-price-${range.value}`}
                          checked={filters.priceRange.includes(range.value)}
                          onCheckedChange={() => handlePriceRangeToggle(range.value)}
                        />
                        <Label htmlFor={`mobile-price-${range.value}`} className="cursor-pointer">
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Sizes - only for clothing (T-shirts & Shirts) */}
                {isSizableCategory(filters.category) && (
                  <div>
                    <h3 className="font-semibold mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SIZES.map((size) => (
                        <Badge
                          key={size}
                          variant={filters.sizes.includes(size) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2"
                          onClick={() => handleSizeToggle(size)}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleClearFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ========== DESKTOP FILTER BOX ========== */}
        <div className="hidden md:block mb-6">
          <Card className="border-2 shadow-sm">
            <div className="p-6 space-y-5">

              {/* Search Row */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-bold text-foreground">Search</span>
                </div>
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name or description..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-9 h-11"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Gender Icons Row - Navigate to Men/Women/Unisex pages */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-bold text-foreground">Shop By</span>
                </div>
                <div className="flex gap-3">
                  <Link to="/men">
                    <Button variant="outline" className="gap-2 hover:bg-blue-500 hover:text-white transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Men
                    </Button>
                  </Link>
                  <Link to="/women">
                    <Button variant="outline" className="gap-2 hover:bg-pink-500 hover:text-white transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Women
                    </Button>
                  </Link>
                  <Link to="/unisex">
                    <Button variant="outline" className="gap-2 hover:bg-purple-500 hover:text-white transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Unisex
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Category Row */}
              <div className="flex items-start gap-4">
                <div className="w-24 flex-shrink-0 pt-1">
                  <span className="text-sm font-bold text-foreground">Category</span>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={filters.category === cat.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryChange(cat.value as Category | "all")}
                      className="rounded-full font-medium"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-start gap-4">
                <div className="w-24 flex-shrink-0 pt-1">
                  <span className="text-sm font-bold text-foreground">Price</span>
                </div>
                <div className="flex flex-wrap gap-5 flex-1">
                  {PRICE_RANGES.map((range) => (
                    <div key={range.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`price-${range.value}`}
                        checked={filters.priceRange.includes(range.value)}
                        onCheckedChange={() => handlePriceRangeToggle(range.value)}
                      />
                      <Label htmlFor={`price-${range.value}`} className="cursor-pointer font-medium text-sm">
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Row - only show for clothing (T-shirts & Shirts) */}
              {isSizableCategory(filters.category) && (
                <div className="flex items-start gap-4">
                  <div className="w-24 flex-shrink-0 pt-1">
                    <span className="text-sm font-bold text-foreground">Size</span>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {AVAILABLE_SIZES.map((size) => (
                      <Badge
                        key={size}
                        variant={filters.sizes.includes(size) ? "default" : "outline"}
                        className="cursor-pointer px-4 py-1.5 font-medium"
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters - show when filters are active */}
              {hasActiveFilters && (
                <>
                  <div className="border-t border-border" />
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="font-medium">
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Active Filters Display - removable badges */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-sm font-medium text-muted-foreground">Active:</span>
            {filters.category !== "all" && (
              <Badge variant="secondary" className="gap-1.5 pl-3 pr-2 py-1">
                {getCategoryLabel(filters.category)}
                <button
                  onClick={() => setFilters({ ...filters, category: "all" })}
                  className="hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.priceRange.map(range => (
              <Badge key={range} variant="secondary" className="gap-1.5 pl-3 pr-2 py-1">
                {PRICE_RANGES.find(p => p.value === range)?.label}
                <button
                  onClick={() => handlePriceRangeToggle(range)}
                  className="hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.sizes.map(size => (
              <Badge key={size} variant="secondary" className="gap-1.5 pl-3 pr-2 py-1">
                Size {size}
                <button
                  onClick={() => handleSizeToggle(size)}
                  className="hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Dynamic Category Carousels - Show all categories */}
        {CATEGORIES.filter(cat => cat.value !== "all").map((cat) => {
          // Show only the selected category when filters are active
          if (hasActiveFilters && filters.category !== cat.value) return null;

          const catProducts = products.filter(p => p.category === cat.value);
          if (catProducts.length === 0) return null;

          const titleMap: Record<string, string> = {
            tshirt: "Trending T-Shirts",
            shirt: "Popular Shirts",
            shoes: "Trending Shoes",
            watch: "Best Selling Watches",
            bag: "Student Bags",
            tech: "Top Tech Gadgets",
            hostel: "Hostel Essentials",
            books: "Best Selling Books",
            accessories: "Must-Have Accessories",
          };
          const title = titleMap[cat.value] || `Trending ${cat.label}`;

          return (
            <ProductCarousel
              key={cat.value}
              title={title}
              products={catProducts.slice(0, 10)}
            />
          );
        })}

        {/* Empty State - Only show when filters are active but no results */}
        {hasActiveFilters && filteredProducts.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

import { Category, getCategoryLabel } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Filters {
  category: Category | "all";
  priceRange: string[];
  sizes: string[];
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const categories: Array<{ value: Category | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "tshirt", label: "T-Shirts" },
  { value: "bag", label: "Bags" },
  { value: "tech", label: "Tech" },
  { value: "hostel", label: "Hostel" },
];

const priceRanges = [
  { value: "under299", label: "Under ₹299" },
  { value: "300-399", label: "₹300 – ₹399" },
  { value: "400plus", label: "₹400+" },
];

const sizes = ["M", "L", "XL", "XXL"];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleCategoryChange = (category: Category | "all") => {
    onFilterChange({ ...filters, category });
  };

  const handlePriceRangeToggle = (range: string) => {
    const newPriceRange = filters.priceRange.includes(range)
      ? filters.priceRange.filter((r) => r !== range)
      : [...filters.priceRange, range];
    onFilterChange({ ...filters, priceRange: newPriceRange });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleClearFilters = () => {
    onFilterChange({ category: "all", priceRange: [], sizes: [], search: "" });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.priceRange.length > 0 ||
    filters.sizes.length > 0 ||
    filters.search.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div>
        <h3 className="text-sm font-medium mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={filters.category === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center gap-2">
              <Checkbox
                id={`price-${range.value}`}
                checked={filters.priceRange.includes(range.value)}
                onCheckedChange={() => handlePriceRangeToggle(range.value)}
              />
              <Label htmlFor={`price-${range.value}`} className="cursor-pointer text-sm">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter - Only for T-shirts */}
      {(filters.category === "all" || filters.category === "tshirt") && (
        <div>
          <h3 className="text-sm font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Badge
                key={size}
                variant={filters.sizes.includes(size) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

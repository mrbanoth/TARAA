import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface BentoGridProps {
    products: Product[];
    emptyMessage?: string;
}

export default function BentoGrid({ products, emptyMessage = "No products found." }: BentoGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

  // Premium Horizontal Scrollable Grid (Bento-style row)
  // Works great on mobile (swipe) and desktop (horizontal scroll)
  return (
    <div className="relative group">
      <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-none w-[280px] sm:w-[320px] snap-center first:pl-0 last:pr-4"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Optional: Fade effect on edges for visual cue (can be added if requested) */}
    </div>
  );
}

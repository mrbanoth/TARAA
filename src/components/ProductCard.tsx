import { Link } from "react-router-dom";
import { Star, Heart, Flame, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { isTrending } from "@/data/config";
import { useState, useCallback } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(product.id);
  const isProductTrending = isTrending(product.clicks);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(product.id);
    toast.success(newState ? "Added to favorites ❤️" : "Removed from favorites");
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (!imageError) {
      target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Available';
      setImageError(true);
    }
  }, [imageError]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="block h-full group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg"
      aria-label={`View ${product.name} details`}
    >
      <div className="h-full">
        <Card 
          className="h-full overflow-hidden border border-border/30 bg-card/50 flex flex-col hover:shadow-md transition-all duration-300 hover:border-primary/30"
          role="article"
          aria-labelledby={`product-${product.id}-title`}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted/10 flex-shrink-0">
            <div className="w-full h-full">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/30 animate-pulse" />
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                width={300}
                height={400}
                onError={handleImageError}
                onLoad={handleImageLoad}
                decoding="async"
                fetchPriority="low"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-20">
              {isProductTrending ? (
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 text-[10px] font-medium px-2 py-0.5 shadow">
                  <Flame className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              ) : product.tag ? (
                <Badge className="bg-primary/95 text-white border-0 text-[10px] font-medium px-2 py-0.5 shadow">
                  {product.tag}
                </Badge>
              ) : null}
            </div>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow z-20 hover:bg-white focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              aria-label={isFav ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
              aria-pressed={isFav}
            >
              <Heart
                className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </Button>
            
            {/* Quick View Button */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/90 text-foreground shadow-sm hover:bg-white/90 hover:text-foreground focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                onClick={(e) => e.preventDefault()}
                aria-label={`Quick view ${product.name}`}
              >
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                Quick View
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-4 flex flex-col flex-grow">
            {/* Category and Rating */}
            <div className="flex justify-between items-center mb-3">
              <Badge 
                variant="outline" 
                className="text-[10px] font-medium px-2 py-0.5 border-border/30 bg-background/80 backdrop-blur-sm truncate max-w-[60%]"
                title={product.category}
              >
                {product.category.toUpperCase()}
              </Badge>
              
              {product.rating && (
                <div className="flex items-center bg-muted/60 rounded-full px-2 py-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              )}
            </div>

            {/* Product Title */}
            <h3 
              id={`product-${product.id}-title`}
              className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem] mb-3 text-foreground/90"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Price and Sizes */}
            <div className="mt-auto pt-2">
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-lg font-bold text-foreground">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {product.sizes.slice(0, 4).map((size, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] px-2 py-0.5 bg-muted/40 rounded-full border border-border/30 whitespace-nowrap hover:bg-muted/60 transition-colors"
                      title={`Size: ${size}`}
                    >
                      {size}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span 
                      className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-default"
                      title={`${product.sizes.length - 4} more sizes available`}
                    >
                      +{product.sizes.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

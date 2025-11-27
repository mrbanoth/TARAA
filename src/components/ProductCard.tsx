import { Link } from "react-router-dom";
import { Star, Heart, Flame } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { isTrending } from "@/data/config";

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

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full border-2 hover:border-primary/30">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Trending Badge */}
          {isProductTrending && (
            <Badge className="absolute top-3 left-3 bg-[hsl(var(--trending))] text-white border-0 shadow-lg">
              <Flame className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}

          {/* Regular Tag */}
          {!isProductTrending && product.tag && (
            <Badge className="absolute top-3 left-3 bg-primary text-white shadow-lg">
              {product.tag}
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg z-10"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 transition-all ${isFav ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"
                }`}
            />
          </button>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-3 md:p-4 space-y-1.5 md:space-y-2">
          {/* Category Badge */}
          <Badge variant="outline" className="text-[10px] md:text-xs">
            {product.category.toUpperCase()}
          </Badge>

          <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 min-h-[32px] md:min-h-[40px]">
            {product.description}
          </p>

          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 md:h-3.5 md:w-3.5 ${i < Math.floor(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs md:text-sm font-medium ml-1">{product.rating}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 md:p-4 pt-0 flex items-center justify-between">
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-primary">₹{product.price}</span>
          </div>
          {product.sizes && (
            <div className="text-[10px] md:text-xs text-muted-foreground">
              {['tshirt', 'shirt', 'pants', 'jeans', 'shorts', 'hoodie', 'sweater', 'jacket', 'coat', 'blazer', 'suit', 'dress', 'skirt', 'top', 'blouse', 'leggings', 'joggers', 'tracksuit', 'sweatshirt', 'cardigan', 'tunic', 'trousers', 'chinos', 'cargos', 'shirt', 't-shirt', 'polo', 'henley', 'tank', 'tank top', 'sleeveless', 'long sleeve', 'short sleeve', 'sleeveless top', 'crop top', 'bodysuit', 'romper', 'jumpsuit', 'playsuit', 'overalls', 'kimono', 'kaftan', 'poncho', 'corset', 'bustier', 'corsage', 'corset top', 'bustier top', 'corsage top', 'corset dress', 'bustier dress', 'corsage dress', 'corset top', 'bustier top', 'corsage top', 'corset dress', 'bustier dress', 'corsage dress'].includes(product.category.toLowerCase()) && (
                product.sizes.slice(0, 3).join(", ")
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

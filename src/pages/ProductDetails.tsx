import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import AdUnit from "@/components/AdUnit";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/deals">Back to Deals</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Avoid duplicates in image gallery
  const uniqueImages = Array.from(new Set([product.imageUrl, ...(product.images || [])])).filter(Boolean);
  const allImages = uniqueImages.length > 0 ? uniqueImages : [product.imageUrl];

  const highlights = [
    "Oversized fit for maximum comfort",
    "Unisex design",
    "Perfect for college and casual wear",
    "Premium quality fabric",
    "Easy to maintain",
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/deals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Deals
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2">
              <img
                src={activeImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {product.tag}
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
                      }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category.toUpperCase()}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
              <p className="text-muted-foreground text-lg whitespace-pre-line">{product.description}</p>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold text-lg">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">(Student Reviews)</span>
              </div>
            )}

            <div className="text-4xl font-bold text-primary">₹{product.price}</div>

            {product.sizes && (
              <div>
                <h3 className="font-semibold mb-2">Available Sizes</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline" className="px-4 py-2">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Platform-Specific Buy Button */}
            {(() => {
              const platform = product.platform || 'other';
              const platformConfig: Record<string, { label: string; color: string; icon: string }> = {
                meesho: { label: 'Buy on Meesho', color: 'bg-purple-600 hover:bg-purple-700', icon: '🛍️' },
                amazon: { label: 'Buy on Amazon', color: 'bg-orange-500 hover:bg-orange-600', icon: '📦' },
                flipkart: { label: 'Buy on Flipkart', color: 'bg-blue-600 hover:bg-blue-700', icon: '🛒' },
                myntra: { label: 'Buy on Myntra', color: 'bg-pink-600 hover:bg-pink-700', icon: '👗' },
                ajio: { label: 'Buy on Ajio', color: 'bg-red-600 hover:bg-red-700', icon: '👕' },
                shopsy: { label: 'Buy on Shopsy', color: 'bg-green-600 hover:bg-green-700', icon: '🛍️' },
                other: { label: 'Buy Now', color: 'bg-primary hover:bg-primary/90', icon: '🛒' },
              };

              const config = platformConfig[platform] || platformConfig.other;

              return (
                <Button
                  size="lg"
                  className={`w-full h-14 text-lg font-bold shadow-lg transition-all ${config.color}`}
                  onClick={() => window.open(product.affiliateUrl, "_blank", "noopener,noreferrer")}
                >
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              );
            })()}

            <p className="text-xs text-muted-foreground text-center">
              You'll be redirected to our partner store. We earn a small commission at no extra cost to you.
            </p>

            {/* Ad Unit */}
            <div className="pt-4">
              <AdUnit slotId="product-sidebar-ad" className="min-h-[250px]" />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Related Deals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ExternalLink, ArrowLeft, Loader2, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import { useProducts } from "@/hooks/useProducts";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import AdUnit from "@/components/AdUnit";
import StarRating from "@/components/StarRating";
import AddReviewForm from "@/components/AddReviewForm";
import ReviewsList from "@/components/ReviewsList";
import { useRatings } from "@/hooks/useRatings";
import SEO from "@/components/SEO";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { isFavorite, toggleFavorite } = useFavorites();
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState<string>("");
  const { ratings, averageRating, loading: ratingsLoading, fetchRatings } = useRatings(id);

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
      {product && (
        <SEO
          title={`${product.name} - Best Price & Deals`}
          description={`Buy ${product.name} at the best price. ${product.description.substring(0, 150)}...`}
          image={product.imageUrl}
        />
      )}
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

            {/* Average Rating Display - From Database */}
            {averageRating.total > 0 && (
              <div className="flex items-center gap-3 bg-yellow-50 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-2xl">{averageRating.average}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold">
                    {averageRating.total} {averageRating.total === 1 ? "Review" : "Reviews"}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= Math.round(averageRating.average)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>
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
            {/* Helper to determine platform and logo */}
            {(() => {
              const getPlatformInfo = (url: string) => {
                if (!url) return { name: "Store", logo: null, color: "bg-primary hover:bg-primary/90 text-white" };
                const lowerUrl = url.toLowerCase();
                if (lowerUrl.includes("amazon")) return { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", color: "bg-[#FF9900] hover:bg-[#FF9900]/90 text-black" };
                if (lowerUrl.includes("flipkart")) return { name: "Flipkart", logo: "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png", color: "bg-[#2874F0] hover:bg-[#2874F0]/90 text-white" };
                if (lowerUrl.includes("myntra")) return { name: "Myntra", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png", color: "bg-[#ff3f6c] hover:bg-[#ff3f6c]/90 text-white" };
                if (lowerUrl.includes("meesho")) return { name: "Meesho", logo: "https://meesho.com/assets/meesho-logo-pink.svg", color: "bg-[#f43397] hover:bg-[#f43397]/90 text-white" };
                if (lowerUrl.includes("ajio")) return { name: "Ajio", logo: "https://assets.ajio.com/static/img/Ajio-Logo.svg", color: "bg-[#2c4152] hover:bg-[#2c4152]/90 text-white" };
                if (lowerUrl.includes("shopsy")) return { name: "Shopsy", logo: "https://play-lh.googleusercontent.com/S0k_B7pCqXk-tX_Xg_X_X_X_X_X_X_X_X_X_X=w240-h480-rw", color: "bg-[#FFC200] hover:bg-[#FFC200]/90 text-black" };

                // Default fallback
                return { name: "Store", logo: null, color: "bg-primary hover:bg-primary/90 text-white" };
              };

              const platform = getPlatformInfo(product.affiliateUrl || "");
              const isFav = isFavorite(product.id);

              return (
                <div className="flex gap-4 pt-4">
                  <Button
                    size="lg"
                    className={`flex-1 text-lg font-semibold h-14 rounded-full shadow-none transition-all hover:scale-[1.02] ${platform.color}`}
                    onClick={() => window.open(product.affiliateUrl, "_blank", "noopener,noreferrer")}
                  >
                    {platform.logo ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white drop-shadow-md">Buy on</span>
                        <img src={platform.logo} alt={platform.name} className="h-8 w-auto object-contain bg-white rounded px-1 py-0.5" />
                      </div>
                    ) : (
                      <>
                        Buy Now <ExternalLink className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="aspect-square h-14 rounded-full border-2"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart className={`h-6 w-6 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              );
            })()}

            <p className="text-xs text-muted-foreground text-center">
              You'll be redirected to our partner store to complete your purchase securely.
            </p>

            {/* Ad Unit */}
            <div className="pt-4">
              <AdUnit slotId="product-sidebar-ad" className="min-h-[250px]" />
            </div>
          </div>
        </div>


        {/* Reviews & Ratings Section */}
        <div className="my-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Reviews & Ratings
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Review Form */}
            <div>
              <AddReviewForm
                productId={product.id}
                onReviewAdded={() => {
                  // Refresh ratings after adding a review
                  if (id) {
                    fetchRatings(id);
                  }
                }}
              />
            </div>

            {/* Reviews List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Student Reviews ({ratings.length})
              </h3>
              <div className="max-h-[600px] overflow-y-auto pr-2">
                <ReviewsList ratings={ratings} loading={ratingsLoading} />
              </div>
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

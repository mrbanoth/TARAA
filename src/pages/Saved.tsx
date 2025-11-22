import { Heart, ShoppingBag } from "lucide-react";
import Layout from "@/components/Layout";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";
import { useFavorites } from "@/hooks/useFavorites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Saved() {
    const { favorites } = useFavorites();

    const savedProducts = products.filter(product => favorites.includes(product.id));
    const hasProducts = savedProducts.length > 0;

    return (
        <Layout>
            {/* Hero Header - Integrated empty state */}
            <div className={`${hasProducts ? 'bg-gradient-to-br from-red-50 via-pink-50 to-background' : 'bg-gradient-to-br from-red-50 via-pink-50 to-yellow-50'} py-12 md:py-16`}>
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-100 mb-4 md:mb-6">
                            <Heart className={`h-8 w-8 md:h-10 md:w-10 ${hasProducts ? 'text-red-500 fill-red-500' : 'text-red-400'}`} />
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                            Saved Deals
                        </h1>

                        {hasProducts ? (
                            // Has products - show count
                            <>
                                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                                    Your handpicked collection of favorite products. Keep track of the deals you love most!
                                </p>
                                <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-5 py-2.5 rounded-full border-2 border-red-200">
                                    <Heart className="h-4 w-4 fill-current" />
                                    <span className="font-bold text-base">
                                        {savedProducts.length} {savedProducts.length === 1 ? "product" : "products"} saved
                                    </span>
                                </div>
                            </>
                        ) : (
                            // No products - show empty state message
                            <>
                                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                                    Your favorites list is waiting to be filled with amazing deals!
                                </p>
                                <div className="max-w-md mx-auto mb-8">
                                    <div className="bg-white/60 backdrop-blur-sm border-2 border-red-100 rounded-2xl p-6 md:p-8 shadow-sm">
                                        <p className="text-base md:text-lg text-foreground mb-4 font-medium">
                                            No saved deals yet
                                        </p>
                                        <p className="text-sm md:text-base text-muted-foreground mb-6">
                                            Start browsing and tap the heart icon ❤️ on products to save your favorite deals here
                                        </p>
                                        <Button asChild size="lg" className="w-full rounded-full font-semibold">
                                            <Link to="/deals">
                                                <ShoppingBag className="h-5 w-5 mr-2" />
                                                Browse Deals
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid - only show if has products */}
            {hasProducts && (
                <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
                    <ProductGrid products={savedProducts} />
                </div>
            )}
        </Layout>
    );
}

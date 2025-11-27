import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useProducts } from "@/hooks/useProducts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ExternalLink, Search } from "lucide-react";

export default function Men() {
    const { products, loading } = useProducts();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products for Men (case-insensitive matching)
    const menProducts = products.filter((product) => {
        const gender = (product.gender || "unisex").toLowerCase().trim();

        // Show men's products (flexible matching)
        if (!['men', 'male', 'man', 'm', 'unisex'].includes(gender)) {
            return false;
        }

        // Filter by search query
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    });

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Men's Collection</h1>
                        <p className="text-muted-foreground mt-1">
                            Handpicked deals for men • {menProducts.length} products
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search men's products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 text-base"
                        />
                    </div>
                </div>

                {/* Bento Grid Layout */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i} className="h-64 animate-pulse bg-muted" />
                        ))}
                    </div>
                ) : menProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                        {menProducts.map((product, index) => {
                            // Create varied grid sizes for Bento effect
                            const isLarge = index % 7 === 0;
                            const isTall = index % 5 === 0;

                            return (
                                <Card
                                    key={product.id}
                                    className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${isLarge ? "md:col-span-2 md:row-span-2" : isTall ? "row-span-2" : ""
                                        }`}
                                    onClick={() => window.open(product.affiliateUrl, "_blank")}
                                >
                                    {/* Product Image */}
                                    <div className="relative w-full h-full">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-2">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold">₹{product.price}</span>
                                                    <ExternalLink className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <Badge className="absolute top-2 left-2 bg-black/70 text-white capitalize">
                                            {product.category}
                                        </Badge>

                                        {/* Gender Badge */}
                                        {product.gender && (
                                            <Badge className="absolute top-2 right-2 bg-blue-500/90 text-white capitalize text-xs">
                                                {product.gender}
                                            </Badge>
                                        )}

                                        {/* Trending Badge */}
                                        {product.clicks && product.clicks > 1200 && (
                                            <Badge className="absolute bottom-2 right-2 bg-primary">
                                                🔥 Trending
                                            </Badge>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <p className="text-muted-foreground">
                            {searchQuery ? "No products found matching your search" : "No men's products available yet. Admin can add products with gender set to 'Men' or 'Unisex'."}
                        </p>
                    </Card>
                )}
            </div>
        </Layout>
    );
}

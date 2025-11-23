import React from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { Product } from "@/data/products";

interface HotDealsProps {
    products: Product[];
}

export default function HotDeals({ products }: HotDealsProps) {
    if (!products || products.length === 0) return null;

    // Duplicate products to create a seamless infinite loop
    const loopProducts = [...products, ...products, ...products];

    return (
        <div className="w-full overflow-hidden bg-primary/5 py-6 border-y border-primary/10">
            {/* Marquee Container */}
            <div className="relative w-full">
                {/* Gradient Masks for smooth fade effect at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 z-10 bg-gradient-to-l from-background to-transparent" />

                {/* Scrolling Track */}
                <div className="flex animate-marquee hover:pause-animation gap-8 md:gap-12 w-max px-4">
                    {loopProducts.map((product, index) => (
                        <Link
                            key={`${product.id}-${index}`}
                            to={`/product/${product.id}`}
                            className="group flex flex-col items-center gap-3 min-w-[100px] md:min-w-[140px] transition-transform hover:scale-105"
                        >
                            {/* Circular Image Container */}
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-primary via-yellow-400 to-red-500 shadow-lg">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                {/* Hot Badge */}
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-white">
                                    {Math.round(Math.random() * 40 + 10)}% OFF
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="text-center space-y-0.5">
                                <h3 className="text-xs md:text-sm font-semibold text-foreground line-clamp-1 max-w-[120px] group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm md:text-base font-bold text-primary">
                                    ₹{product.price}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

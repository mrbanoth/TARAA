import { Product } from "@/data/products";
import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";

interface AdUnitProps {
    slotId?: string;
    format?: "auto" | "fluid" | "rectangle";
    className?: string;
}

export default function AdUnit({ slotId, format = "auto", className = "" }: AdUnitProps) {
    const { products } = useProducts();
    const [ad, setAd] = useState<Product | null>(null);

    useEffect(() => {
        // Filter for products marked as 'ad_banner'
        const ads = products.filter(p => p.category === 'ad_banner');
        if (ads.length > 0) {
            // Pick a random ad
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            setAd(randomAd);
        }
    }, [products]);

    if (ad) {
        return (
            <div className={`ad-container overflow-hidden rounded-lg shadow-sm ${className}`}>
                <a
                    href={ad.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group"
                >
                    <img
                        src={ad.imageUrl}
                        alt={ad.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Sponsored
                    </div>
                </a>
            </div>
        );
    }

    // Fallback / Placeholder if no ads found
    return null;
}

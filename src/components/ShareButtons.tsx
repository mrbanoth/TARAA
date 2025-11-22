import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
    productName: string;
    productUrl: string;
}

export default function ShareButtons({ productName, productUrl }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleWhatsAppShare = () => {
        const message = `Check out this deal on TARAA: ${productName}\n${productUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(productUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy link");
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    text: `Check out this deal on TARAA: ${productName}`,
                    url: productUrl,
                });
            } catch (error) {
                // Silent error handling for security
            }
        }
    };

    // Check if Web Share API is available
    const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

    return (
        <div className="flex gap-2">
            {hasNativeShare ? (
                <Button variant="outline" size="sm" onClick={handleNativeShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            ) : (
                <Button variant="outline" size="sm" onClick={handleWhatsAppShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    WhatsApp
                </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleCopyLink}>
                {copied ? (
                    <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                    </>
                )}
            </Button>
        </div>
    );
}

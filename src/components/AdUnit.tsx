import { Card } from "@/components/ui/card";

interface AdUnitProps {
    slotId?: string;
    format?: "auto" | "fluid" | "rectangle";
    className?: string;
}

export default function AdUnit({ slotId, format = "auto", className = "" }: AdUnitProps) {
    // In development or if no slot ID, show a placeholder
    const isDev = true; // Change to false when you have real AdSense code

    if (isDev) {
        return (
            <Card className={`bg-slate-50 border-dashed border-2 border-slate-200 flex items-center justify-center p-4 ${className}`}>
                <div className="text-center text-muted-foreground text-sm">
                    <p className="font-semibold">Advertisement Space</p>
                    <p className="text-xs">AdSense Slot: {slotId || "Pending"}</p>
                </div>
            </Card>
        );
    }

    return (
        <div className={`ad-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your ID
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
            </script>
        </div>
    );
}

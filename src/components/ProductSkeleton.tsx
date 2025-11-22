export default function ProductSkeleton() {
    return (
        <div className="group relative">
            <div className="rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                {/* Image skeleton with shimmer effect */}
                <div className="aspect-square bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer bg-[length:200%_100%]" />

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Category badge */}
                    <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />

                    {/* Title */}
                    <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
                        <div className="h-5 bg-slate-200 rounded animate-pulse w-1/2" />
                    </div>

                    {/* Rating and price */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-primary/20 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

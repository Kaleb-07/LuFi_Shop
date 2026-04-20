import { Skeleton } from "./ecommerce-ui/skeleton";

const CommonLoading = () => {
    return (
        <div className="space-y-0 selection:bg-primary/20 bg-[#F9FAFB]">
            {/* Navbar placeholder */}
            <div className="h-16 border-b border-border/40 bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-6">
                <Skeleton className="h-8 w-32" />
                <div className="flex-1 px-20">
                    <Skeleton className="h-10 w-full max-w-md mx-auto rounded-xl" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            <div className="container space-y-12 py-10">
                {/* Promo Carousel Skeleton */}
                <Skeleton className="h-[430px] w-full rounded-[2.5rem]" />

                {/* Category Bar Skeleton */}
                <div className="flex justify-center gap-4 py-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-32 rounded-lg" />
                    ))}
                </div>

                {/* Hero Section Skeleton */}
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-40 rounded-full" />
                            <Skeleton className="h-20 w-full rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                    <Skeleton className="flex-1 h-[500px] w-full rounded-[2.5rem]" />
                </div>

                {/* Product Grid Skeleton */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-60" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-[400px] w-full rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonLoading;

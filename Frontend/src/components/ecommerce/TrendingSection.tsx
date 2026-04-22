import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ecommerce-ui/button";
import { Link } from "react-router-dom";

const trendingCategories = [
    { 
        name: "Laptops", 
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Electronics" 
    },
    { 
        name: "Computer parts", 
        image: "https://images.unsplash.com/photo-1591799272175-0fa6d302c61f?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Gadgets" 
    },
    { 
        name: "Smartphones", 
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Electronics" 
    },
    { 
        name: "Enterprise networking", 
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Electronics" 
    },
    { 
        name: "Tablets and eBooks", 
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Electronics" 
    },
    { 
        name: "Storage and blank media", 
        image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Electronics" 
    },
    { 
        name: "Lenses and filters", 
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000", 
        link: "/store?category=Accessories" 
    },
];

const TrendingSection = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="container px-6">
                <div className="mb-12 flex items-center justify-between">
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-primary border-none outline-none">
                        The future in your hands
                    </h2>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => scroll("left")}
                            className="h-12 w-12 rounded-full border border-neutral-100 bg-white hover:bg-neutral-50 shadow-sm"
                        >
                            <ChevronLeft className="h-6 w-6 text-neutral-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => scroll("right")}
                            className="h-12 w-12 rounded-full border border-neutral-100 bg-white hover:bg-neutral-50 shadow-sm"
                        >
                            <ChevronRight className="h-6 w-6 text-neutral-600" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory px-2"
                >
                    {trendingCategories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            className="min-w-[200px] sm:min-w-[240px] snap-start group"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05, duration: 0.6 }}
                        >
                            <Link to={cat.link} className="block space-y-6">
                                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-[#F2F2F2] transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-neutral-200/50">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <p className="px-1 text-base font-bold text-neutral-900 transition-colors group-hover:text-primary">
                                    {cat.name}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;

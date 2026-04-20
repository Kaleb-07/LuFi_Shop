import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { Button } from "./ecommerce-ui/button";
import { Card, CardContent } from "./ecommerce-ui/card";
import { Badge } from "./ecommerce-ui/badge";
import { Link } from "react-router-dom";

const DEMO_PRODUCTS = [
    { id: 101, item_name: "Razer DeathAdder V3", price: 69, images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"] },
    { id: 102, item_name: "Keychron K2 Wireless", price: 99, images: ["https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500&q=80"] },
    { id: 103, item_name: "Sony WH-1000XM5", price: 348, images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"] },
    { id: 104, item_name: "Logitech MX Master 3S", price: 99, images: ["https://images.unsplash.com/photo-1586522332152-788c1bb312fa?w=500&q=80"] },
];

const DealsSection = () => {
    const { data: apiProducts, isLoading } = useProducts();
    const products = apiProducts && apiProducts.length > 0 ? apiProducts : DEMO_PRODUCTS;
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

    if (isLoading) return null; // Or skeleton

    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="container px-6">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
                    <div className="lg:w-1/4 w-full shrink-0 flex flex-col justify-center pb-8 lg:pb-0">
                        <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                            Today's<br className="hidden lg:block" /> Deals
                        </h2>
                        <p className="mt-4 text-neutral-500 text-lg">Limited time offers you can't miss</p>
                        <div className="flex gap-3 mt-8">
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
                        className="lg:w-3/4 w-full flex gap-8 overflow-x-auto pb-8 pt-4 scrollbar-none snap-x snap-mandatory px-2"
                    >
                        {products?.slice(0, 8).map((product) => (
                            <motion.div
                                key={product.id}
                                className="min-w-[280px] snap-start"
                            >
                                <Link to={`/shop/product/${product.id}`} className="block h-full group">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#F9FAFB] border border-neutral-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-neutral-200/50 group-hover:-translate-y-2">
                                        <div className="absolute inset-0 p-8 flex items-center justify-center">
                                            <img
                                                src={product.images?.[0] || "/images/default.jpg"}
                                                alt={product.item_name}
                                                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-sm mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-red-600 shadow-sm border border-neutral-100">
                                                -20% OFF
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6 px-2 space-y-2">
                                        <div>
                                            <h3 className="font-bold text-neutral-900 text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.item_name}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? "fill-primary text-primary" : "text-neutral-300"}`} />
                                                ))}
                                                <span className="text-xs text-neutral-500 ml-1 font-medium">(128)</span>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-3 pt-1">
                                            <span className="text-xl font-bold text-neutral-900">ETB {product.price}</span>
                                            <span className="text-sm font-medium text-neutral-400 line-through">ETB {(product.price * 1.2).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealsSection;

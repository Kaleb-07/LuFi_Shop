import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ecommerce-ui/button";
import { useNavigate } from "react-router-dom";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1593640408182-31c228cfd8f3?q=80&w=2000&auto=format&fit=crop",
        title: "Next-Gen Laptops",
        subtitle: "Power through every task with our premium laptop collection",
        badge: "New Arrivals",
        buttonText: "Shop Now",
        link: "/shop/store",
        position: "left",
        accent: "from-blue-900/80 via-blue-900/40 to-transparent"
    },
    {
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop",
        title: "Latest Smartphones",
        subtitle: "Discover flagship phones that redefine what's possible",
        badge: "Hot Deals",
        buttonText: "View Collection",
        link: "/shop/store",
        position: "right",
        accent: "from-purple-900/80 via-purple-900/40 to-transparent"
    },
    {
        image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2000&auto=format&fit=crop",
        title: "Ultimate Gaming Setup",
        subtitle: "Level up your game with cutting-edge peripherals & gear",
        badge: "Top Picks",
        buttonText: "Shop Laptop",
        link: "/shop/store",
        position: "left",
        accent: "from-green-900/80 via-green-900/40 to-transparent"
    }
];

const PromoCarousel = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[500px] md:h-[650px] lg:h-[90vh] w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="relative h-full w-full"
                >
                    <div className="absolute inset-0">
                        <img
                            src={slides[current].image}
                            alt={slides[current].title}
                            className="h-full w-full object-cover brightness-[0.65] scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-${slides[current].position === 'right' ? 'l' : 'r'} ${slides[current].accent}`} />
                    </div>

                    <div className={`relative flex h-full items-center w-full px-8 md:px-20 lg:px-28 ${slides[current].position === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-2xl text-white ${slides[current].position === 'right' ? 'text-right' : 'text-left'}`}>
                            <motion.span
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.25em] bg-white/15 backdrop-blur-sm border border-white/20 text-white"
                            >
                                ⚡ {slides[current].badge}
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="mb-6 text-5xl font-black tracking-tight md:text-7xl leading-[1.1]"
                            >
                                {slides[current].title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className={`mb-10 text-xl md:text-2xl text-white/90 font-medium max-w-lg leading-relaxed ${slides[current].position === 'right' ? 'ml-auto' : 'mr-auto'}`}
                            >
                                {slides[current].subtitle}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <Button
                                    onClick={() => navigate(slides[current].link)}
                                    className="h-16 px-12 rounded-full gold-gradient text-primary-foreground text-lg font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {slides[current].buttonText}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-8 hidden md:flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prev}
                    className="h-14 w-14 rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-xl hover:bg-primary transition-all group"
                >
                    <ChevronLeft className="h-8 w-8 transition-transform group-hover:-translate-x-1" />
                </Button>
            </div>

            <div className="absolute inset-y-0 right-8 hidden md:flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={next}
                    className="h-14 w-14 rounded-full border border-white/10 bg-black/20 text-white backdrop-blur-xl hover:bg-primary transition-all group"
                >
                    <ChevronRight className="h-8 w-8 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all duration-500 rounded-full h-2 ${current === i ? "w-12 bg-primary shadow-lg shadow-primary/30" : "w-3 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromoCarousel;

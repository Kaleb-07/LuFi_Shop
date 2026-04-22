import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    Laptop, Smartphone, Speaker, Watch, Cpu, Sparkles, ShoppingBag, 
    ChevronLeft, ChevronRight, LayoutGrid, Shirt, Footprints, Home, Trophy, Map 
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { fetchCategories, Category } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, any> = {
    Laptop, Smartphone, Speaker, Watch, Cpu, Sparkles, ShoppingBag,
    LayoutGrid, Shirt, Footprints, Home, Trophy, Map
};

const CategoryBar = () => {
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        loadCategories();
    }, []);

    const nextCategories = () => {
        if (currentIndex + itemsPerPage < categories.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const prevCategories = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    const displayedCategories = categories.slice(currentIndex, currentIndex + itemsPerPage);
    const hasNext = currentIndex + itemsPerPage < categories.length;
    const hasPrev = currentIndex > 0;

    if (categories.length === 0) return null;

    return (
        <div className="border-b border-border/40 bg-white sticky top-16 z-30 shadow-sm">
            <div className="container px-2 sm:px-4">
                <div className="flex items-center justify-between gap-2 py-2">
                    {/* Previous Button */}
                    <div className="w-8 flex-shrink-0">
                        {hasPrev && (
                            <button
                                onClick={prevCategories}
                                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground transition-all"
                                aria-label="Previous categories"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Categories List */}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-center gap-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-1 w-full justify-center overflow-x-auto scrollbar-none pb-1"
                                >
                                    {displayedCategories.map((cat) => {
                                        const Icon = ICON_MAP[cat.icon_name || ""] || ShoppingBag;
                                        return (
                                            <Link
                                                key={cat.slug}
                                                to={`/store?category=${cat.name}`}
                                                className="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-primary active:scale-95"
                                            >
                                                <Icon className="h-4 w-4" />
                                                {cat.name}
                                            </Link>
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Next Button */}
                    <div className="w-8 flex-shrink-0 flex justify-end">
                        {hasNext && (
                            <button
                                onClick={nextCategories}
                                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground transition-all"
                                aria-label="Next categories"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;

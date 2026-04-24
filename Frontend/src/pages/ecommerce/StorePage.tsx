import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  Heart,
  Star,
  Filter,
  ArrowLeft,
  ArrowRight,
  Menu,
  Check,
  ChevronDown,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  X,
  Smartphone,
  Shirt,
  Watch,
  Home,
  Sparkles,
  Trophy,
  Cpu,
  Map,
  Footprints
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchEcommerceProducts, fetchCategories, fetchBrands, Product, Category, Brand } from "../../lib/api";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Card, CardContent } from "../../components/ecommerce/ecommerce-ui/card";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { useLanguage } from "../../contexts/LanguageContext";

const ICON_MAP: Record<string, any> = {
  LayoutGrid,
  Smartphone,
  Shirt,
  ShoppingBag,
  Footprints,
  Watch,
  Home,
  Sparkles,
  Trophy,
  Cpu,
  Map,
};

const StorePage = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth >= 1024);
  const [visibleItems, setVisibleItems] = useState(12);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, brandsData] = await Promise.all([
          fetchEcommerceProducts(),
          fetchCategories(),
          fetchBrands()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarExpanded(true);
      } else {
        setIsSidebarExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync searchQuery and selectedCategory with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const cat = params.get("category");

    setSearchQuery(q);

    if (cat && (cat === "All Products" || categories.some(c => c.name === cat))) {
      setSelectedCategory(cat);
    } else if (!cat) {
      setSelectedCategory("All Products");
    }
  }, [location.search, categories]);

  // Reactive Sidebar: Open when category changes to something specific
  useEffect(() => {
    if (selectedCategory !== "All Products") {
      // Intentionally left blank to preserve user preference
    }
  }, [selectedCategory]);

  const availableTypes = useMemo(() => {
    if (selectedCategory === "All Products") return [];
    const types = products
      .filter((p) => p.category_name === selectedCategory && p.part_number)
      .map((p) => p.part_number!);
    return Array.from(new Set(types));
  }, [selectedCategory, products]);

  const filteredProducts = useMemo(() => {
    let prods = [...products];

    // --- 1. Advanced Deep Search ---
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter((p) =>
        p.item_name.toLowerCase().includes(q) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // --- 2. Category ---
    if (selectedCategory !== "All Products") {
      prods = prods.filter((p) => p.category_name === selectedCategory);
    }

    // --- 3. Price Range ---
    prods = prods.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // --- 4. Stock Availability ---
    if (inStockOnly) {
      prods = prods.filter(p => p.stock_quantity > 0);
    }

    // --- 5. Rating Filter (Using mock rating) ---
    if (minRating > 0) {
      prods = prods.filter(p => ((p.id % 5) + 1) >= minRating);
    }

    // --- 6. Drill-down Filters ---
    if (selectedTypes.length > 0) {
      prods = prods.filter((p) => p.part_number && selectedTypes.includes(p.part_number));
    }

    if (selectedBrands.length > 0) {
      prods = prods.filter((p) => p.brand_name && selectedBrands.includes(p.brand_name));
    }

    // --- 7. Advanced Sorting ---
    if (sortBy === "Price: Low to High") {
      prods.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      prods.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Popularity") {
      prods.sort((a, b) => ((b.id % 10) + b.price / 1000) - ((a.id % 10) + a.price / 1000));
    } else if (sortBy === "Best Rated") {
      prods.sort((a, b) => (b.id % 5) - (a.id % 5));
    }

    return prods;
  }, [products, selectedCategory, selectedTypes, selectedBrands, sortBy, searchQuery, priceRange, inStockOnly, minRating]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col min-h-screen pb-0 bg-[#ebf3f5]">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col lg:flex-row relative">
        {/* Mobile Overlay */}
        {isSidebarExpanded && (
          <div 
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarExpanded(false)}
          />
        )}
        <aside
          className={`fixed lg:sticky top-16 h-screen lg:h-[calc(100vh-4rem)] shrink-0 transition-all duration-500 ease-in-out z-40 ${isSidebarExpanded
            ? "w-[260px] opacity-100 translate-x-0"
            : "w-[80px] opacity-100 -translate-x-full lg:translate-x-0 overflow-hidden"
            }`}
        >
          <div className="h-full lg:max-h-full overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#1e4a5d] lg:rounded-br-3xl">
            <div className="min-h-full flex flex-col transition-all duration-500 text-slate-100 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key="category-menu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="py-6"
                >
                  <div className="space-y-4">
                    <div className={`flex items-center ${isSidebarExpanded ? "justify-between" : "justify-center"} px-5 mb-5`}>
                      {isSidebarExpanded && (
                        <div className="flex flex-col">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8cbab3]">
                            {t("cat.browse")}
                          </h4>
                          <h3 className="text-xl font-bold text-white">{t("nav.categories")}</h3>
                        </div>
                      )}
                      <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center transition-all ${isSidebarExpanded ? "bg-white/10 hover:bg-white/20 text-white" : "text-white hover:bg-white/10"}`}
                      >
                        {isSidebarExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pl-4">
                      {[{ name: "All Products", icon_name: "LayoutGrid" }, ...categories].map((cat, idx) => {
                        const Icon = ICON_MAP[cat.icon_name || "LayoutGrid"] || LayoutGrid;
                        return (
                          <div key={cat.name} className="relative group/wrapper">
                            {/* The Snappy Sliding Highlight Box */}
                            {selectedCategory === cat.name && (
                              <motion.div
                                layoutId="active-category-bg"
                                className="absolute inset-0 bg-[#ebf3f5] rounded-l-[16px] z-0 shadow-[-5px_0_15px_rgba(0,0,0,0.02)]"
                                initial={false}
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 40,
                                  bounce: 0.1
                                }}
                              >
                                <div className="absolute right-0 -top-4 w-4 h-4 bg-transparent shadow-[4px_4px_0_4px_#ebf3f5] rounded-br-[16px] pointer-events-none" />
                                <div className="absolute right-0 -bottom-4 w-4 h-4 bg-transparent shadow-[4px_-4px_0_4px_#ebf3f5] rounded-tr-[16px] pointer-events-none" />
                              </motion.div>
                            )}

                            <motion.button
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              onClick={() => {
                                setSelectedCategory(cat.name);
                                setSelectedTypes([]);
                                setSelectedBrands([]);
                                if (window.innerWidth < 1024) setIsSidebarExpanded(false);
                              }}
                              className={`w-full text-left py-3.5 px-4 rounded-l-[16px] flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'} relative z-10 transition-colors duration-200 ${selectedCategory === cat.name
                                  ? "text-[#1e4a5d]"
                                  : "hover:bg-white/5 text-[#8cbab3]"
                                }`}
                              title={!isSidebarExpanded ? cat.name : undefined}
                            >
                              <div className="flex items-center gap-4 relative z-20">
                                <Icon className={`h-5 w-5 shrink-0 transition-all duration-300 ${selectedCategory === cat.name ? "text-[#1e4a5d] stroke-[2.5px]" : "text-[#8cbab3] group-hover/wrapper:text-white"}`} />
                                {isSidebarExpanded && (
                                  <span className={`text-[14px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${selectedCategory === cat.name ? "text-[#1e4a5d] font-bold" : "text-[#8cbab3] group-hover/wrapper:text-white"}`}>
                                    {cat.name}
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Availability */}
                    {isSidebarExpanded && (
                      <div className="pt-6 mt-6 border-t border-white/10 mx-5 relative z-10">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8cbab3]">
                            {t("store.inStockOnly")}
                          </h4>
                          <button 
                            onClick={() => setInStockOnly(!inStockOnly)}
                            className={`w-11 h-6 rounded-full transition-all relative ${inStockOnly ? "gold-gradient" : "bg-white/10"}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${inStockOnly ? "left-6" : "left-1"}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rating Filter */}
                    {isSidebarExpanded && (
                      <div className="pt-6 mt-6 border-t border-white/10 mx-5 relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8cbab3] mb-4">
                          {t("store.minRating")}
                        </h4>
                        <div className="flex flex-col gap-2.5">
                          {[4, 3, 2, 1].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                              className={`flex items-center gap-3 text-xs transition-all duration-300 group/rating ${minRating === rating ? "translate-x-1" : "hover:translate-x-1"}`}
                            >
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3.5 w-3.5 transition-all ${i < rating 
                                    ? (minRating === rating ? "fill-amber-400 text-amber-400 scale-110" : "fill-amber-400/40 text-amber-400/40 group-hover/rating:fill-amber-400/80 group-hover/rating:text-amber-400/80") 
                                    : "text-white/10"}`} 
                                  />
                                ))}
                              </div>
                              <span className={`font-bold tracking-tight ${minRating === rating ? "text-amber-400" : "text-[#8cbab3] group-hover/rating:text-white"}`}>
                                & Up
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Range in Sidebar*/}
                    {isSidebarExpanded && (
                      <div className="pt-6 mt-6 border-t border-white/10 mx-5 relative z-10">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8cbab3] mb-4">
                          {t("store.priceRange")}
                        </h4>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                              <label className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Min</label>
                              <Input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="h-8 rounded-lg text-xs font-medium bg-white/10 border-transparent text-white focus:border-white/30 focus:bg-white/20 transition-colors"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <label className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Max</label>
                              <Input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="h-8 rounded-lg text-xs font-medium bg-white/10 border-transparent text-white focus:border-white/30 focus:bg-white/20 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 min-w-0 w-full">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <AnimatePresence mode="wait">
              {selectedCategory !== "All Products" && (
                <motion.nav
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1"
                >
                  <Link to="/" className="hover:text-primary transition-colors">{t("nav.store")}</Link>
                  <ChevronDown className="h-3 w-3 -rotate-90" />
                  <button
                    onClick={() => {
                      setSelectedCategory("All Products");
                      setSelectedTypes([]);
                      setSelectedBrands([]);
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    {t("store.allCategories")}
                  </button>
                  <ChevronDown className="h-3 w-3 -rotate-90" />
                  <span className="text-primary">{selectedCategory}</span>
                </motion.nav>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                <div className="shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggle */}
                    <button
                      onClick={() => setIsSidebarExpanded(true)}
                      className="lg:hidden h-10 w-10 shrink-0 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-primary transition-colors shadow-sm"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                    <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tightest leading-none">
                      {selectedCategory === "All Products" ? t("nav.store") : selectedCategory}
                    </h1>
                    {selectedCategory !== "All Products" && (
                      <button
                        onClick={() => {
                          setSelectedCategory("All Products");
                          setSelectedTypes([]);
                          setSelectedBrands([]);
                        }}
                        className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-primary/5 transition-all mt-1"
                        title={t("store.clear")}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-neutral-400 text-lg font-medium mt-3 max-w-xl">
                    {searchQuery
                      ? `${t("store.resultsFor")} "${searchQuery}"`
                      : (selectedCategory === "All Products"
                        ? t("store.exploreCollection")
                        : `${t("cat.browse")} ${selectedCategory.toLowerCase()}...`)}
                  </p>
                </div>

                <div className="flex-1 w-full">
                  <AnimatePresence mode="wait">
                    {selectedCategory === "All Products" ? (
                      <motion.div
                        key="benefits"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden"
                      >
                        {[
                          { icon: Truck, label: t("store.benefit1Title"), sub: t("store.benefit1Sub") },
                          { icon: ShieldCheck, label: t("store.benefit2Title"), sub: t("store.benefit2Sub") },
                          { icon: Headphones, label: t("store.benefit3Title"), sub: t("store.benefit3Sub") },
                          { icon: RotateCcw, label: t("store.benefit4Title"), sub: t("store.benefit4Sub") },
                        ].map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/50 border border-neutral-100 shadow-sm transition-all hover:bg-white hover:shadow-md hover:border-primary/20 group cursor-default"
                          >
                            <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                              <feature.icon className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-black text-neutral-900 leading-tight truncate">{feature.label}</p>
                              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter truncate">{feature.sub}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="horizontal-filters"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-1"
                      >
                        {/* Horizontal Type Filter */}
                        {availableTypes.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 leading-none">{t("store.type")}</h4>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {availableTypes.map((type) => (
                                <button
                                  key={type}
                                  onClick={() => toggleType(type)}
                                  className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all border ${selectedTypes.includes(type)
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-white border-neutral-100 text-neutral-600 hover:border-primary/30 hover:bg-primary/5"
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Horizontal Brand Filter */}
                        <div className="flex flex-col gap-1">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 leading-none">{t("store.brand")}</h4>
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {brands.map((brand) => (
                              <button
                                key={brand.slug}
                                onClick={() => toggleBrand(brand.name)}
                                className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all border ${selectedBrands.includes(brand.name)
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                  : "bg-white border-neutral-100 text-neutral-600 hover:border-primary/30 hover:bg-primary/5"
                                  }`}
                              >
                                {brand.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-neutral-100 mt-0 px-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                    {filteredProducts.length} {t("store.itemsFound")}
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:bg-white hover:shadow-md max-w-full overflow-x-auto scrollbar-hide">
                  <Filter className="h-4 w-4 text-primary shrink-0" />
                  <div className="h-4 w-[1px] bg-neutral-100" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{t("store.sortBy")}</span>
                    <select
                      className="bg-transparent font-bold text-neutral-800 focus:outline-none cursor-pointer text-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option>{t("sortBy.newest")}</option>
                      <option>{t("sortBy.popularity")}</option>
                      <option>{t("sortBy.rated")}</option>
                      <option>{t("sortBy.lowToHigh")}</option>
                      <option>{t("sortBy.highToLow")}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[400px] rounded-3xl bg-white/50 animate-pulse border border-neutral-100" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-40 border-2 border-dashed border-red-100 rounded-3xl bg-red-50/10">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarExpanded ? "xl:grid-cols-3" : "xl:grid-cols-4"} gap-8 transition-all duration-500`}>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.slice(0, visibleItems).map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                    <Link to={`/product/${product.id}`}>
                      <Card className="group relative h-full overflow-hidden border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-3xl">
                        <div className="relative aspect-square overflow-hidden bg-neutral-100">
                          <img
                            src={product.images?.[0] || "/images/default.jpg"}
                            alt={product.item_name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <button
                            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors shadow-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">
                                {product.brand_name || t("common.premiumBrand")}
                              </p>
                              <h3 className="font-bold text-neutral-900 text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                {product.item_name}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < 4
                                      ? "fill-primary text-primary"
                                      : "fill-neutral-200 text-neutral-200"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[12px] text-neutral-400 font-medium">
                                ({(product.id % 20) + 10} {t("detail.reviews")})
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-2xl font-black text-neutral-900">
                                ETB {product.price}
                              </span>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addToCart(product);
                                }}
                                className="h-10 px-4 rounded-xl bg-neutral-900 hover:bg-primary text-white text-[12px] font-bold transition-all shadow-lg shadow-neutral-200 flex items-center gap-2 group/btn"
                              >
                                <ShoppingBag className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                {t("detail.addToCart")}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Load More */}
            {visibleItems < filteredProducts.length && (
              <div className="mt-20 flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setVisibleItems((prev) => prev + 12)}
                  className="rounded-full px-12 h-14 border-2 border-neutral-200 hover:border-primary hover:text-primary transition-all text-neutral-600 font-bold"
                >
                  {t("store.loadMore")}
                </Button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-40 border-2 border-dashed border-neutral-200 rounded-3xl">
                <Filter className="h-16 w-16 text-neutral-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-neutral-400">{t("store.noProducts")}</h3>
                <p className="text-neutral-400 mt-2">{t("store.noProductsDesc")}</p>
                <Button
                  variant="link"
                  className="mt-4 text-primary font-bold"
                  onClick={() => {
                    setSelectedCategory("All Products");
                    setSelectedTypes([]);
                    setSelectedBrands([]);
                    setSearchQuery("");
                  }}
                >
                  {t("store.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;

import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import PromoCarousel from "../../components/ecommerce/PromoCarousel";
import CategoryBar from "../../components/ecommerce/CategoryBar";
import ModernHero from "../../components/ecommerce/ModernHero";
import DealsSection from "../../components/ecommerce/DealsSection";
import ModernPromoBanner from "../../components/ecommerce/ModernPromoBanner";
import TrendingSection from "../../components/ecommerce/TrendingSection";
import Newsletter from "../../components/ecommerce/Newsletter";
import ProductGrid from "../../components/ecommerce/ProductGrid";
import { useLanguage } from "../../contexts/LanguageContext";
import { useProducts } from "../../hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";
import { mockProducts } from "../../lib/mock-data";
import SEO from "../../components/ecommerce/SEO";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { t } = useLanguage();
  const { data: apiProducts, isLoading, isError } = useProducts();

  // Use API products if available, otherwise fallback to mock data until backend is fixed
  const products = apiProducts && apiProducts.length > 0 ? apiProducts : mockProducts;

  const filteredProducts = useMemo(() => {
    if (!products || !category) return products || [];
    return products.filter(
      (p) => p.category_name?.toLowerCase() === category.toLowerCase()
    );
  }, [category, products]);

  // Loading and error states are disabled for now to allow UI preview while backend is being fixed
  // if (isLoading) return <CommonLoading />;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] selection:bg-primary/20 overflow-x-hidden">
      <SEO 
        title="Home"
        description="Welcome to LuFi Shop, your premium destination for the latest electronics, fashion, and more."
      />
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!category ? (
            <motion.div
              key="home-rich"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              <PromoCarousel />
              <CategoryBar />
              <ModernHero />
              <DealsSection />
              <ModernPromoBanner />
              <TrendingSection />
              <Newsletter />
            </motion.div>
          ) : (
            <motion.div
              key="home-filter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container py-12"
            >
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-10">
                <div>
                  <h1 className="font-heading text-4xl font-bold capitalize text-foreground sm:text-5xl">
                    {category}
                  </h1>
                  <p className="mt-2 text-lg text-muted-foreground">
                    Showing all premium products in <span className="text-primary font-semibold">{category}</span>
                  </p>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-primary">
                  {filteredProducts?.length || 0} Products Found
                </div>
              </div>

              <ProductGrid
                products={filteredProducts || []}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

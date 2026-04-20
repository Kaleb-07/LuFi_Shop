import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { Laptop, Smartphone, Headphones, Cpu } from "lucide-react";

const CategorySection = () => {
  const { t } = useLanguage();

  const categories = [
    { name: t("cat.laptops"), icon: Laptop, slug: "laptops" },
    { name: t("cat.phones"), icon: Smartphone, slug: "phones" },
    { name: t("cat.accessories"), icon: Headphones, slug: "accessories" },
    { name: t("cat.components"), icon: Cpu, slug: "components" },
  ];

  return (
    <section className="container mt-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{t("cat.browse")}</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t("cat.title")}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((cat, i) => (
          <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <Link to={`/shop/?category=${cat.slug}`} className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40 hover:glow-accent">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 p-3 transition-transform duration-300 group-hover:scale-110">
                <cat.icon className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

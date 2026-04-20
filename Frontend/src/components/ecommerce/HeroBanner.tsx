import { Link } from "react-router-dom";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";


const HeroBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop" alt="Premium tech collection" className="h-[380px] w-full object-cover brightness-[0.3] md:h-[520px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">{t("hero.badge")}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              <span className="text-foreground">{t("hero.upTo")}</span>
              <span className="gold-text">{t("hero.discount")}</span>
              <br />
              <span className="text-foreground">{t("hero.premiumTech")}</span>
            </h1>
            <p className="text-base text-muted-foreground md:text-lg max-w-md">{t("hero.desc")}</p>
            <div className="flex gap-3">
              <Link to="/shop/?category=laptops">
                <Button size="lg" className="gold-gradient text-primary-foreground font-semibold px-8 shadow-lg hover:opacity-90 transition-opacity">
                  {t("hero.shopNow")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop/about">
                <Button size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary">
                  {t("hero.learnMore")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Truck, Headphones, CreditCard, ArrowRight, Sparkles, Zap, Star } from "lucide-react";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { useLanguage } from "../../contexts/LanguageContext";

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const perks = [
    { icon: Truck, title: t("why.freeShipping"), desc: t("why.freeShippingDesc") },
    { icon: Shield, title: t("why.authentic"), desc: t("why.authenticDesc") },
    { icon: Headphones, title: t("why.support"), desc: t("why.supportDesc") },
    { icon: CreditCard, title: t("why.secure"), desc: t("why.secureDesc") },
  ];

  return (
    <section className="container mt-20">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{t("why.subtitle")}</p>
        <h2 className="text-2xl font-bold md:text-3xl">{t("why.title")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-sm">{t("why.desc")}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {perks.map((perk, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-6 md:p-8 transition-all hover:border-primary/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <perk.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{perk.title}</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const BrandBanner = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "50K+", label: t("brand.happyCustomers"), icon: Star },
    { value: "120+", label: t("brand.premiumBrands"), icon: Shield },
    { value: "24/7", label: t("brand.expertSupport"), icon: Headphones },
    { value: "30+", label: t("brand.countriesServed"), icon: Zap },
  ];

  return (
    <section className="container mt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{t("brand.aboutUs")}</span>
            </div>
            <h2 className="text-2xl font-bold md:text-4xl leading-tight">
              {t("brand.title1")}<span className="gold-text">{t("brand.title2")}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">{t("brand.desc1")}</p>
            <p className="text-muted-foreground leading-relaxed">{t("brand.desc2")}</p>
            <Link to="/about">
              <Button variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 mt-2">
                {t("brand.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }} className="flex flex-col items-center justify-center rounded-xl bg-secondary/50 border border-border/50 p-5 text-center">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-xl font-bold text-foreground md:text-2xl">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Testimonials = () => {
  const { t } = useLanguage();

  const reviews = [
    { name: "James L.", text: "Incredible selection and fast delivery. My new MacBook arrived in 2 days!", rating: 5 },
    { name: "Priya S.", text: "Love the quality assurance. Every product I've bought has been genuine and well-packaged.", rating: 5 },
    { name: "Michael R.", text: "Best tech store online. The customer support helped me choose the perfect GPU.", rating: 5 },
  ];

  return (
    <section className="container mt-20">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">{t("test.subtitle")}</p>
        <h2 className="text-2xl font-bold md:text-3xl">{t("test.title")}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {reviews.map((review, i) => (
          <motion.div key={review.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.text}"</p>
            <p className="mt-4 text-sm font-semibold text-foreground">{review.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CTABanner = () => {
  const { t } = useLanguage();

  return (
    <section className="container mt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-2xl gold-gradient p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative space-y-4">
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">{t("cta.title")}</h2>
          <p className="mx-auto max-w-md text-primary-foreground/80">{t("cta.desc")}</p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/?category=laptops">
              <Button size="lg" className="bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90">
                {t("cta.shopNow")}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                {t("cta.createAccount")}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export { WhyChooseUs, BrandBanner, Testimonials, CTABanner };

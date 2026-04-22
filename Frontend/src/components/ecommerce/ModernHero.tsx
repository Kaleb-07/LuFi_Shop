import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ecommerce-ui/button";
import { Card, CardContent } from "./ecommerce-ui/card";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const ModernHero = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const staticProducts = [
        { id: 1, name: t("hero.prod1"), price: "ETB 99", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop" },
        { id: 2, name: t("hero.prod2"), price: "ETB 299", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop" },
        { id: 3, name: t("hero.prod3"), price: "ETB 49", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop" },
        { id: 4, name: t("hero.prod4"), price: "ETB 129", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400&auto=format&fit=crop" },
        { id: 5, name: t("hero.prod5"), price: "ETB 599", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop" },
        { id: 6, name: t("hero.prod6"), price: "ETB 79", image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=400&auto=format&fit=crop" },
    ];

    return (
        <section className="bg-white py-20 overflow-hidden">
            <div className="container">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
                    {/* Left Side */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
                            >
                                {t("home.innovation")}
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-heading text-5xl font-bold leading-[1.1] text-foreground sm:text-6xl xl:text-7xl"
                            >
                                {t("home.futureIs")} <br />
                                <span className="gold-text">{t("home.inYourHands")}</span>
                            </motion.h1>
                        </div>

                        {/* 6 Static Horizontal Cards */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {staticProducts.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + i * 0.05 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Card 
                                        onClick={() => navigate('/store')}
                                        className="group cursor-pointer overflow-hidden border-border/40 bg-secondary/20 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 rounded-2xl"
                                    >
                                            <CardContent className="p-0">
                                                <div className="relative aspect-[4/3] overflow-hidden">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                                    <div className="absolute top-2 right-2">
                                                        <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full opacity-0 scale-90 transition-all group-hover:opacity-100 group-hover:scale-100">
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                                    <p className="text-[10px] font-bold text-primary mt-0.5">{product.price}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Hero Image */}
                    <div className="relative flex-1">
                        <Link to="/store">
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative aspect-square w-full lg:aspect-auto lg:h-[600px] cursor-pointer"
                            >
                                <div className="absolute -inset-4 rounded-full bg-primary/5 blur-3xl" />
                                <img
                                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
                                    alt="Featured Product"
                                    className="relative h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105"
                                />
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModernHero;

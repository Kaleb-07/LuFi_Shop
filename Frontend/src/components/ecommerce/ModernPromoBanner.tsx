import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ModernPromoBanner = () => {
    return (
        <section className="bg-white py-12 md:py-16">
            <div className="container">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-12 md:px-16 md:py-20 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Left Side: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 text-white"
                        >
                            <h2 className="font-heading text-5xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">
                                Let the trends <br /> follow you
                            </h2>
                            <p className="mt-8 text-xl text-white/90 md:text-2xl max-w-lg leading-relaxed font-medium">
                                Enjoy up to 20% off luxury tech pieces that will always turn heads.
                            </p>
                            <div className="mt-12">
                                <Link to="/shop/store">
                                    <button className="rounded-full bg-black px-12 py-5 text-xl font-black text-white transition-all hover:scale-105 active:scale-95 shadow-2xl">
                                        Claim your classics
                                    </button>
                                </Link>
                            </div>
                            <div className="mt-16 border-t border-white/20 pt-8 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                                Discounts in ETB. *See terms & conditions.
                            </div>
                        </motion.div>

                        {/* Right Side: Product Collage */}
                        <div className="relative flex items-center justify-center lg:justify-end">
                            <div className="relative grid grid-cols-2 gap-6 md:gap-8 max-w-xl">
                                {/* Product 1: Smartphone */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="col-span-1 row-span-2 flex items-center justify-center rounded-[2.5rem] bg-white p-8 shadow-2xl"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80"
                                        alt="Modern Smartphone"
                                        className="max-h-[350px] w-full object-contain transition-transform duration-500 hover:scale-110"
                                    />
                                </motion.div>

                                {/* Promo Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center text-primary shadow-xl"
                                >
                                    <span className="text-sm font-black uppercase tracking-widest opacity-60">Up To</span>
                                    <span className="text-4xl font-black md:text-5xl tracking-tighter">ETB 140*</span>
                                    <span className="text-sm font-black uppercase tracking-widest opacity-60">Off</span>
                                </motion.div>

                                {/* Product 2: Headphones */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="flex items-center justify-center rounded-3xl bg-white p-8 shadow-xl"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                                        alt="Premium Headphones"
                                        className="max-h-[160px] w-full object-contain transition-transform duration-500 hover:scale-110"
                                    />
                                </motion.div>

                                {/* Product 3: Tablet (Floating/Offset)
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="absolute -right-12 top-1/2 hidden xl:flex -translate-y-1/2 items-center justify-center rounded-[3rem] bg-white p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] z-20"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1544244015-0cd4b3ff2091?w=600&q=80"
                                        alt="Sleek Tablet"
                                        className="max-h-[400px] w-full object-contain transition-transform duration-500 hover:scale-110"
                                    />
                                </motion.div> */}
                            </div>
                        </div>
                    </div>

                    {/* Background Decorations */}
                    <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
                        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-white/10 blur-[120px]" />
                        <div className="absolute -right-[10%] -bottom-[10%] h-[50%] w-[50%] rounded-full bg-black/10 blur-[120px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full opacity-[0.05] grayscale invert bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModernPromoBanner;

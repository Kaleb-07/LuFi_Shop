import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { Button } from "./ecommerce-ui/button";
import { Input } from "./ecommerce-ui/input";

const Newsletter = () => {
    return (
        <section className="bg-white py-24 pb-32">
            <div className="container px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-20 md:px-16 text-center">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-[0.03]">
                        <Mail className="h-96 w-96 text-white" />
                    </div>

                    <div className="relative max-w-3xl mx-auto space-y-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                                Stay Ahead of the Curve
                            </h2>
                            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
                                Subscribe for exclusive updates, early access to new drops, and special offers on premium tech.
                            </p>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="relative flex-1">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-14 pl-14 bg-white/10 border border-white/10 hover:bg-white/15 focus-visible:ring-white/20 rounded-full text-base text-white placeholder:text-neutral-400 shadow-inner backdrop-blur-sm transition-colors"
                                    required
                                />
                            </div>
                            <Button className="h-14 px-8 bg-white text-neutral-900 hover:bg-neutral-100 font-bold rounded-full shadow-xl shadow-white/5 transition-transform hover:-translate-y-0.5 group">
                                Subscribe
                                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Button>
                        </motion.form>

                        <div className="pt-4">
                            <p className="text-xs text-neutral-500 font-medium tracking-wide">
                                By subscribing, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;

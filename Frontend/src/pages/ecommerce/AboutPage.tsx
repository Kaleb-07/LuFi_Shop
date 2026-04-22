import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Users, Award, Globe, ShoppingBag, Shield, Zap, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";

const Counter = ({ value, label, icon: Icon }: { value: number; label: string; icon: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/20 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Search-style circular decoration */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <svg className="h-32 w-32 -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="377"
            strokeDashoffset="100"
            className="text-primary/20"
          />
        </svg>
      </div>

      <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
        <Icon className="h-8 w-8" />
      </div>
      <span className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {count.toLocaleString()}+
      </span>
      <span className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground line-clamp-1">
        {label}
      </span>
    </motion.div>
  );
};

const FeatureItem = ({ title, desc, icon: Icon }: { title: string; desc: string; icon: any }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-start gap-4 p-6 rounded-2xl transition-colors hover:bg-primary/5 group"
  >
    <div className="flex-shrink-0 rounded-xl bg-white p-3 shadow-md group-hover:shadow-primary/20">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const AboutPage = () => {
  const { t } = useLanguage();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const stickyRef = useRef(null);
  const { scrollYProgress: stickyScrollY } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      title: t("about.features.sellTitle"),
      desc: t("about.features.sellDesc"),
      btnText: t("about.features.sellBtn"),
      icon: Zap,
      color: "bg-primary/30",
      iconColor: "text-primary"
    },
    {
      title: t("about.features.buyTitle"),
      desc: t("about.features.buyDesc"),
      btnText: t("about.features.buyBtn"),
      icon: ShoppingBag,
      color: "bg-emerald-500/30",
      iconColor: "text-emerald-500"
    },
    {
      title: t("about.features.shopTitle"),
      desc: t("about.features.shopDesc"),
      btnText: t("about.features.shopBtn"),
      icon: Shield,
      color: "bg-blue-500/30",
      iconColor: "text-blue-500"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#F9FAFB] selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      <main ref={targetRef}>
        {/* Section 1 – Hero with Full Background Image */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Full Background Image with Animation */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80"
              alt="Gaming Setup"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center text-white max-w-3xl px-4"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Build Your Dream Rig
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Premium PC components, keyboards, mice, and RAM for gamers and creators.
            </p>
          </motion.div>
        </section>

        {/* Section 2 – Why Choose yanol */}
        <section className="bg-white py-16 md:py-24 overflow-hidden">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              {/* Left Side - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                  Why Choose <span className="text-primary">Yanol</span>
                </h2>

                <div className="space-y-6">
                  {/* Reason 1 - Premium PC Components */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Premium PC Components
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-4">
                      From high-performance graphics cards to lightning-fast RAM modules,
                      our marketplace connects you with top-quality components from trusted
                      sellers. Build your dream rig with parts that deliver exceptional
                      performance and reliability.
                    </p>
                  </div>

                  {/* Reason 2 - Elite Gaming Peripherals */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Elite Gaming Peripherals
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-4">
                      Discover mechanical keyboards with your favorite switches, high-precision
                      gaming mice, and immersive headsets. Whether you're a competitive gamer
                      or a casual enthusiast, find peripherals that give you the edge.
                    </p>
                  </div>

                  {/* Reason 3 - Expert Community & Support */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Expert Community & Support
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-4">
                      Our community of builders and enthusiasts shares tips, build guides,
                      and recommendations. Need advice on your next upgrade? Our experts
                      and fellow gamers are here to help you make the right choice.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 inline-flex items-center">
                    Explore Our Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Right Side - Multiple Images Grid (Alternative Layout) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-3 gap-2">
                  {/* Image 1 - Large (spans 2 columns) */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="col-span-2 row-span-2 relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80"
                      alt="Gaming Setup"
                      className="w-full h-160 object-cover rounded-2xl shadow-lg"
                    />
                    <span className="absolute bottom left-3 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Custom Builds
                    </span>
                  </motion.div>

                  {/* Image 2 - Small */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&q=80"
                      alt="PC Components"
                      className="w-full h-32 object-cover rounded-2xl shadow-lg"
                    />
                  </motion.div>

                  {/* Image 3 - Small */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80"
                      alt="Gaming Mouse"
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                  </motion.div>

                  {/* Image 4 - Small */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80"
                      alt="RAM Modules"
                      className="w-full h-40 object-cover rounded-2xl shadow-lg"
                    />
                  </motion.div>

                  {/* Image 5 - Small */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80"
                      alt="Mechanical Keyboard"
                      className="w-full h-40 object-cover rounded-2xl shadow-lg"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3 – How Btsy Tech Works */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How yanol Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your premier destination for high-performance PC components, gaming peripherals,
                and professional hardware. We connect tech enthusiasts with premium gear.
              </p>
            </motion.div>

            {/* Three Column Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">

              {/* Column 1 - Sell (For Sellers/Vendors) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
              >
                {/* Icon with tech theme */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  Sell Your Gear
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  List your PC components, gaming peripherals, and tech accessories to thousands of
                  buyers. Whether you're a manufacturer, retailer, or individual seller, reach the
                  right audience for your products.
                </p>

                {/* Key features bullet points */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Low commission fees</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Seller protection program</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Analytics & insights dashboard</span>
                  </li>
                </ul>

                <a
                  href="/sell"
                  className="inline-flex items-center text-primary font-semibold hover:gap-3 transition-all gap-2 group/link"
                >
                  Start selling
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </motion.div>

              {/* Column 2 - Buy (For Customers) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-500 transition-colors">
                  Buy Premium Tech
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Discover the latest PC components, mechanical keyboards, high-precision mice,
                  and high-speed RAM. From gaming rigs to workstations, find exactly what you need.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Curated collections</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Price comparison tools</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Verified seller reviews</span>
                  </li>
                </ul>

                <a
                  href="/"
                  className="inline-flex items-center text-green-500 font-semibold hover:gap-3 transition-all gap-2 group/link"
                >
                  Start shopping
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </motion.div>

              {/* Column 3 - Trust/Security */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">
                  Shop With Confidence
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Every transaction is protected by our secure payment system and buyer protection
                  program. We verify all sellers and products to ensure quality and authenticity.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>

                <a
                  href="/security"
                  className="inline-flex items-center text-blue-500 font-semibold hover:gap-3 transition-all gap-2 group/link"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </motion.div>

            </div>

            {/* Bottom CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-20 text-center"
            >
              <div className="inline-flex items-center gap-4 p-4 bg-gray-100 rounded-full px-8">
                <span className="text-gray-600">Ready to upgrade your setup?</span>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                  Explore Products
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
};

export default AboutPage;

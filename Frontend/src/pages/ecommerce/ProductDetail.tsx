import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ShoppingBag, Heart, Truck, RotateCcw,
  Star, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Plus
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useProduct, useProducts } from "../../hooks/useProducts";
import { useToast } from "../../hooks/use-toast";

// ─── Mock reviews (static, since there's no reviews API yet) ─────────────────
const MOCK_REVIEWS = [
  { id: 1, name: "Samuel T.", rating: 5, comment: "Absolutely amazing product! Build quality is top‑notch and shipping was super fast.", date: "Mar 5, 2026" },
  { id: 2, name: "Meron A.", rating: 4, comment: "Great value for money. Fits perfectly and feels premium. Would definitely buy again.", date: "Feb 28, 2026" },
  { id: 3, name: "Yonas K.", rating: 5, comment: "Exceeded my expectations. The color is exactly as shown in the photos.", date: "Feb 20, 2026" },
];

// ─── Demo product shown when API is not yet connected ────────────────────────
const DEMO_PRODUCT = {
  id: 0,
  item_name: "Pro Gaming Mechanical Keyboard RGB",
  brand_name: "Yanol Tech",
  category_name: "Keyboards",
  price: 149,
  stock_quantity: 24,
  description: "Experience the ultimate gaming precision with our Pro Mechanical Keyboard. Features Cherry MX switches, per-key RGB lighting, and an aerospace-grade aluminium body built to last for 100 million keystrokes.",
  images: [
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
  ],
};

// ─── Demo similar products shown when API is not yet connected ───────────────
const DEMO_SIMILAR = [
  { id: 1, item_name: "HyperX Cloud II Headset", brand_name: "HyperX", price: 99, category_name: "Keyboards", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"] },
  { id: 2, item_name: "Logitech G Pro X Mouse", brand_name: "Logitech", price: 79, category_name: "Keyboards", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80"] },
  { id: 3, item_name: "Corsair Vengeance RGB RAM 32GB", brand_name: "Corsair", price: 129, category_name: "Keyboards", images: ["https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80"] },
  { id: 4, item_name: "NVIDIA RTX 4080 GPU", brand_name: "NVIDIA", price: 1199, category_name: "Keyboards", images: ["https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?w=400&q=80"] },
  { id: 5, item_name: "Samsung 980 Pro NVMe SSD", brand_name: "Samsung", price: 89, category_name: "Keyboards", images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80"] },
];

// ─── Star Row helper ──────────────────────────────────────────────────────────
const StarRow = ({ rating, size = 4 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-${size} w-${size} ${i < rating ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}`}
      />
    ))}
  </div>
);

// ─── Accordion Item ───────────────────────────────────────────────────────────
const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-800 hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-gray-600 leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Product Card (for Similar Items) ────────────────────────────────────────
const SimilarCard = ({ product }: { product: any }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/shop/product/${product.id}`)}
      className="flex-shrink-0 w-52 cursor-pointer rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-44 w-full bg-gray-50">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80"}
          alt={product.item_name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 truncate">{product.item_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{product.brand_name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-primary">ETB {product.price}</span>
          <StarRow rating={4} size={3} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id ? Number(id) : undefined);
  const { data: allProducts } = useProducts();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [qty, setQty] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-32 flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="mt-4 text-gray-500">Loading product…</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Fallback to DEMO when API not connected ──
  const isDemo = isError || !product;
  const displayProduct = isDemo ? DEMO_PRODUCT : product!;

  // ── Derived data ──
  const images = displayProduct.images?.length
    ? displayProduct.images
    : [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
    ];

  const similarProducts = isDemo
    ? DEMO_SIMILAR
    : (allProducts?.filter((p) => p.id !== displayProduct.id && p.category_name === displayProduct.category_name).slice(0, 8) ?? []);

  const avgRating = Math.round(
    MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length
  );

  const handleAddToCart = () => {
    if (!isDemo) for (let i = 0; i < qty; i++) addToCart(displayProduct as any);
    toast({ title: `${displayProduct.item_name} added to bag`, description: `Quantity: ${qty}` });
    navigate("/shop/cart");
  };

  const prevImg = () => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImg = () => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-16">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 – BREADCRUMB
        ══════════════════════════════════════════════════════ */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <Link to="/shop" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {displayProduct.category_name && (
            <>
              <Link to={`/shop?category=${displayProduct.category_name}`} className="hover:text-primary transition-colors capitalize">
                {displayProduct.category_name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          {displayProduct.brand_name && (
            <>
              <span className="hover:text-primary transition-colors capitalize">{displayProduct.brand_name}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{displayProduct.item_name}</span>
        </nav>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 – PRODUCT DISPLAY
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Left Column: Image Thumbnails ── */}
          <div className="flex flex-col gap-6 lg:gap-10 order-1 lg:order-1">
            <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-6 lg:gap-8">
              <div className="flex lg:flex-col flex-row gap-3 order-2 lg:order-1">
                {images.map((src, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-20 h-20 lg:w-full lg:h-24 xl:h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImg === i ? "border-primary shadow-md shadow-primary/20" : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="h-full w-full object-cover" />
                    {activeImg === i && (
                      <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* ── Center Column: Main Image ── */}
              <div className="relative order-1 lg:order-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={images[activeImg]}
                    alt={displayProduct.item_name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Arrows */}
                <button
                  onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`h-1.5 rounded-full transition-all ${activeImg === i ? "w-5 bg-primary" : "w-1.5 bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Accordion moved below images ── */}
            <div className="border-t border-gray-100 pt-4 space-y-0 lg:ml-[120px]">
              <AccordionItem title="Product Details">
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><span className="font-medium">Material:</span> Premium composite alloy &amp; silicone</li>
                  <li><span className="font-medium">Features:</span> Ergonomic design, anti-slip grip, dust-resistant</li>
                  <li><span className="font-medium">Size:</span> Standard universal fit</li>
                  <li><span className="font-medium">Care:</span> Wipe clean with dry cloth. Avoid moisture.</li>
                </ul>
                {displayProduct.description && (
                  <p className="mt-3 text-gray-600">{displayProduct.description}</p>
                )}
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p>Standard delivery: 3–5 business days. Express delivery available at checkout.</p>
                <p>Returns accepted within 30 days of purchase. Item must be in original packaging.</p>
              </AccordionItem>
              <AccordionItem title="Warranty">
                <p>12-month manufacturer's warranty. Contact support for any defects or issues.</p>
              </AccordionItem>
            </div>
          </div>

          {/* ── Right Column: Product Info ── */}
          <div className="order-2 lg:order-2 space-y-5 lg:col-span-1">

            {/* Category tag + name */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                {displayProduct.category_name}
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-1 leading-tight">
                {displayProduct.item_name}
              </h1>
              {displayProduct.brand_name && (
                <p className="text-sm text-gray-400 mt-1">{displayProduct.brand_name}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRow rating={avgRating} />
              <span className="text-sm text-gray-500">({MOCK_REVIEWS.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">ETB {displayProduct.price}</span>
              <span className="text-sm text-green-600 font-medium">Free Delivery</span>
            </div>


            {/* Colour & Quantity */}
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-700">Colour:</span> Black
                </p>
                <div className="flex gap-2">
                  {["#111111", "hsl(201, 61%, 40%)", "#2B4C8C", "#5C3A1E"].map((c) => (
                    <button
                      key={c}
                      className={`h-7 w-7 rounded-full border-2 border-white shadow-md ring-2 ring-transparent hover:ring-gray-400 transition-all ${c === "hsl(201, 61%, 40%)" ? "ring-primary" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-2 font-medium text-gray-700">
                  Quantity
                </p>
                <div className="flex items-center border border-gray-200 rounded-xl h-10 w-32 bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors hover:bg-gray-50 rounded-l-xl text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-medium text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors hover:bg-gray-50 rounded-r-xl text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Bag + Wishlist */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={handleAddToCart}
                disabled={displayProduct.stock_quantity === 0}
                className="flex-1 gold-gradient text-white font-semibold py-6 text-base rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Bag
              </Button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`p-4 rounded-2xl border-2 transition-all ${wishlist
                  ? "border-red-400 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
                  }`}
              >
                <Heart className={`h-5 w-5 ${wishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Delivery Info Box */}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Free delivery on qualifying orders</p>
                  <button className="text-xs text-primary hover:underline mt-0.5">
                    View Delivery &amp; Returns Policy
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">30-day free returns</p>
                  <p className="text-xs text-gray-500">Hassle-free returns within 30 days</p>
                </div>
              </div>
            </div>

            {/* Shipping notice */}
            <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>This product may have shipping restrictions to certain regions.</span>
            </div>
          </div>
        </div>
        <div />

        {/* ══════════════════════════════════════════════════════
            SECTION 3 – CUSTOMER REVIEWS
        ══════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-4xl font-bold text-gray-900">{avgRating}.0</span>
                <div>
                  <StarRow rating={avgRating} size={5} />
                  <p className="text-sm text-gray-500 mt-1">Based on {MOCK_REVIEWS.length} reviews</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
              className="rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>

          {/* Write Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">Share your experience</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Your Name</label>
                      <input
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="e.g. Samuel T."
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Rating</label>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })}>
                            <Star className={`h-6 w-6 transition-colors ${s <= newReview.rating ? "fill-primary text-primary" : "text-gray-200"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Tell others what you think about this product..."
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        toast({ title: "Review submitted!", description: "Thanks for your feedback." });
                        setShowReviewForm(false);
                        setNewReview({ name: "", rating: 5, comment: "" });
                      }}
                      className="gold-gradient text-white font-semibold rounded-xl"
                    >
                      Submit Review
                    </Button>
                    <Button variant="outline" onClick={() => setShowReviewForm(false)} className="rounded-xl">
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_REVIEWS.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <StarRow rating={review.rating} size={3} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 4 – SIMILAR PRODUCTS
        ══════════════════════════════════════════════════════ */}
        {
          similarProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Similar Items</h2>
                <Link
                  to={`/shop?category=${displayProduct.category_name}`}
                  className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {similarProducts.map((p) => (
                  <div key={p.id} className="snap-start">
                    <SimilarCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )
        }

        {/* Back to shop link */}
        <div className="pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>
        </div>

      </main >

      <Footer />

      {/* Hide scrollbar utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div >
  );
};

export default ProductDetail;

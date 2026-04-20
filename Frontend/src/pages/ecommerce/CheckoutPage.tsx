import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Banknote, Lock } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("cod");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/shop");
      setLoading(false);
    }, 1500);
  };

  if (items.length === 0) {
    navigate("/shop/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 pt-20">
        <Link to="/shop/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> {t("checkout.backToCart")}
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-foreground">{t("checkout.title")}</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">{t("checkout.shippingInfo")}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("checkout.fullName")}</Label>
                  <Input id="name" placeholder="John Doe" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("checkout.phone")}</Label>
                  <Input id="phone" placeholder="+1 234 567 890" required maxLength={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("checkout.email")}</Label>
                <Input id="email" type="email" placeholder="you@example.com" required maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t("checkout.address")}</Label>
                <Input id="address" placeholder="123 Main Street, City, Country" required maxLength={300} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">{t("checkout.paymentMethod")}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setPayment("cod")} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${payment === "cod" ? "border-primary bg-primary/5 shadow-[0_0_15px_hsl(201,61%,40%,0.1)]" : "border-border hover:border-muted-foreground/30"}`}>
                  <Banknote className={`h-5 w-5 ${payment === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("checkout.cod")}</p>
                    <p className="text-xs text-muted-foreground">{t("checkout.codDesc")}</p>
                  </div>
                </button>
                <button type="button" onClick={() => setPayment("card")} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${payment === "card" ? "border-primary bg-primary/5 shadow-[0_0_15px_hsl(201,61%,40%,0.1)]" : "border-border hover:border-muted-foreground/30"}`}>
                  <CreditCard className={`h-5 w-5 ${payment === "card" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("checkout.card")}</p>
                    <p className="text-xs text-muted-foreground">{t("checkout.cardDesc")}</p>
                  </div>
                </button>
              </div>
            </motion.div>

            <Button type="submit" disabled={loading} className="w-full gold-gradient text-primary-foreground font-semibold h-12 text-base hover:opacity-90 transition-opacity">
              <Lock className="mr-2 h-4 w-4" />
              {loading ? t("checkout.placing") : `${t("checkout.pay")} ETB ${totalPrice.toFixed(2)}`}
            </Button>
          </form>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-20">
            <h2 className="mb-5 text-lg font-bold text-foreground">{t("checkout.orderSummary")}</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/20">
                    <img src={product.images?.[0] || "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop"} alt={product.item_name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.item_name}</p>
                    <p className="text-xs text-muted-foreground">{t("checkout.qty")}: {quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">ETB {(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="my-5 border-t border-border" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span>ETB {totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.shipping")}</span><span className="text-primary font-medium">{t("cart.free")}</span></div>
            </div>
            <div className="my-4 border-t border-border" />
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>{t("cart.total")}</span><span>ETB {totalPrice.toFixed(2)}</span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

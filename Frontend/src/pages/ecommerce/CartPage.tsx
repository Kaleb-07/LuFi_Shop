import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-32 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 border border-border">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("cart.empty")}</h1>
            <p className="mt-2 text-muted-foreground">{t("cart.emptyDesc")}</p>
            <Link to="/">
              <Button className="mt-6 gold-gradient text-primary-foreground font-semibold px-8 hover:opacity-90">
                {t("cart.startShopping")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 pt-20">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> {t("cart.continueShopping")}
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t("cart.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} {items.length > 1 ? t("cart.items") : t("cart.item")} {t("cart.inYourCart")}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/20">
                <Link to={`/product/${product.id}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary/20">
                  <img src={product.images?.[0] || "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop"} alt={product.item_name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${product.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">{product.item_name}</Link>
                    <p className="text-xs text-primary/70 uppercase tracking-wider">{product.brand_name || t("common.noBrand")}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-border bg-secondary/30">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="font-bold text-foreground">ETB {(product.price * quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(product.id)} className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-20">
            <h2 className="mb-5 text-lg font-bold text-foreground">{t("cart.orderSummary")}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span className="text-foreground">ETB {totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.shipping")}</span><span className="text-primary font-medium">{t("cart.free")}</span></div>
            </div>
            <div className="my-5 border-t border-border" />
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>{t("cart.total")}</span><span>ETB {totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <Button className="mt-6 w-full gold-gradient text-primary-foreground font-semibold h-12 text-base hover:opacity-90 transition-opacity">{t("cart.checkout")}</Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;

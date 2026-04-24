import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { Card, CardContent } from "../../components/ecommerce/ecommerce-ui/card";
import { motion } from "framer-motion";
import { Package, Search, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { fetchOrderDetails, Order } from "../../lib/api";

const TrackOrderPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      setOrderId(id);
      trackOrder(id);
    }
  }, [location.search]);

  const trackOrder = async (id: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchOrderDetails(id);
      setOrder(data);
    } catch (err) {
      console.error("Tracking failed:", err);
      setError(true);
      toast({ title: "Order not found", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast({ title: t("track.orderId"), variant: "destructive" });
      return;
    }
    trackOrder(orderId);
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: "pending", label: t("track.orderPlaced"), icon: Package },
      { key: "processing", label: t("track.processing"), icon: Clock },
      { key: "shipped", label: t("track.shipped"), icon: Truck },
      { key: "delivered", label: t("track.delivered"), icon: CheckCircle },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status.toLowerCase());

    return steps.map((s, i) => ({
      ...s,
      done: i <= currentIndex,
      date: i === 0 ? (order?.created_at ? new Date(order.created_at).toLocaleDateString() : "") : (i === currentIndex ? "Updated recently" : "")
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative py-10 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="container relative">
            <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("nav.myOrders")}
            </Link>
            <div className="text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t("track.subtitle")}</p>
                <h1 className="text-4xl font-bold md:text-5xl">{t("track.title1")}<span className="gold-text">{t("track.title2")}</span></h1>
                <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("track.desc")}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container max-w-xl pb-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">{t("track.orderId")}</Label>
                  <div className="flex gap-3">
                    <Input id="orderId" placeholder="e.g. TS-20260305-001" value={orderId} onChange={(e) => { setOrderId(e.target.value); setOrder(null); }} maxLength={50} />
                    <Button type="submit" disabled={loading} className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 shrink-0">
                      <Search className="mr-2 h-4 w-4" />
                      {loading ? "..." : t("track.track")}
                    </Button>
                  </div>
                </div>
              </form>

              {loading && (
                <div className="mt-12 flex flex-col items-center justify-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                  <p className="text-sm text-muted-foreground">Fetching order details...</p>
                </div>
              )}

              {error && !loading && (
                <div className="mt-8 p-6 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center text-center space-y-3">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                  <h3 className="font-bold text-red-900">Order Not Found</h3>
                  <p className="text-sm text-red-700">Please check the order number and try again. Make sure it matches our records exactly.</p>
                </div>
              )}

              {order && !loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-8">
                  <div className="mb-6 rounded-xl bg-secondary/50 p-4 border border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("track.order")}</span>
                      <span className="font-mono font-bold text-foreground">{order.order_number}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">{t("track.status")}</span>
                      <span className="font-bold text-primary uppercase tracking-wider">{order.status}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2 border-t border-border pt-2">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-bold text-foreground">ETB {order.total_amount}</span>
                    </div>
                  </div>

                  <div className="space-y-0 pl-2">
                    {getStatusSteps(order.status).map((status, i, arr) => (
                      <div key={status.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500 ${status.done ? "border-primary bg-primary/10" : "border-border bg-secondary/50"}`}>
                            <status.icon className={`h-5 w-5 ${status.done ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          {i < arr.length - 1 && <div className={`w-0.5 h-10 transition-colors duration-500 ${status.done ? "bg-primary/40" : "bg-border"}`} />}
                        </div>
                        <div className="pt-2">
                          <p className={`text-sm font-bold ${status.done ? "text-foreground" : "text-muted-foreground"}`}>{status.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{status.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="text-sm font-bold mb-3 uppercase tracking-widest text-neutral-400">Order Items</h4>
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                              <img src={item.product?.images?.[0] || "/images/default.jpg"} alt={item.product?.item_name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.product?.item_name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold">ETB {item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle, Truck, AlertCircle, ArrowLeft } from "lucide-react";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { fetchUserOrders, Order } from "../../lib/api";

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, navigate]);

  const loadOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchUserOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <Package className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-32 flex flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground animate-pulse">Loading your orders...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 pt-24 max-w-5xl">
        <header className="mb-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Shop
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Orders</h1>
                <p className="mt-2 text-muted-foreground">Manage your purchases and track their shipping status real-time.</p>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl px-4 py-2 text-sm font-medium text-primary flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                {orders.length} Total Orders
            </div>
          </div>
        </header>

        {error && (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-xl font-bold">Failed to load orders</h2>
                <p className="text-muted-foreground">There was a problem connecting to the server. Please try again.</p>
                <Button onClick={loadOrders} variant="outline" className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">
                    Retry Connection
                </Button>
            </div>
        )}

        {!error && orders.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
                    <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">No orders yet</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto">Looks like you haven't made any purchases yet. Your history will appear here!</p>
                </div>
                <Button onClick={() => navigate("/store")} className="gold-gradient text-primary-foreground font-bold rounded-xl px-8 h-12 shadow-lg shadow-primary/20">
                    Start Shopping
                </Button>
            </div>
        )}

        {!error && orders.length > 0 && (
            <div className="space-y-4">
                {orders.map((order, idx) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative overflow-hidden rounded-3xl border border-border bg-card p-4 transition-all hover:shadow-xl hover:shadow-primary/5 sm:p-6"
                    >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 text-primary transition-transform group-hover:scale-110">
                                    <Package className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground sm:text-lg">{order.order_number}</h3>
                                    <p className="text-sm text-muted-foreground">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                                <Badge className={`rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-all ${getStatusColor(order.status)}`}>
                                    <span className="mr-1.5">{getStatusIcon(order.status)}</span>
                                    {order.status}
                                </Badge>
                                <p className="text-lg font-black text-foreground">ETB {order.total_amount.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center border-t border-border pt-4 sm:border-0 sm:pt-0">
                                <Button
                                    onClick={() => navigate(`/track-order?id=${order.order_number}`)}
                                    variant="ghost" 
                                    className="h-12 w-full rounded-2xl bg-primary/5 px-6 font-bold text-primary transition-all hover:bg-primary hover:text-white sm:w-auto"
                                >
                                    View Details
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-6 flex flex-wrap gap-2">
                           {order.items?.map((item) => (
                             <div key={item.id} className="h-10 w-10 overflow-hidden rounded-lg border border-border/50 bg-muted/50" title={item.product?.item_name}>
                                <img src={item.product?.images?.[0] || "/images/default.jpg"} className="h-full w-full object-cover" alt="" />
                             </div>
                           ))}
                           {order.items && order.items.length > 5 && (
                             <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-[10px] font-bold text-muted-foreground">
                                +{order.items.length - 5}
                             </div>
                           )}
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;

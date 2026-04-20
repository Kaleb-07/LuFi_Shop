import { useState } from "react";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { Card, CardContent } from "../../components/ecommerce/ecommerce-ui/card";
import { motion } from "framer-motion";
import { Package, Search, Truck, CheckCircle, Clock } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useLanguage } from "../../contexts/LanguageContext";

const TrackOrderPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockStatuses = [
    { step: t("track.orderPlaced"), icon: Package, done: true, date: "Mar 5, 2026" },
    { step: t("track.processing"), icon: Clock, done: true, date: "Mar 5, 2026" },
    { step: t("track.shipped"), icon: Truck, done: true, date: "Mar 6, 2026" },
    { step: t("track.delivered"), icon: CheckCircle, done: false, date: "Est. Mar 9, 2026" },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast({ title: t("track.orderId"), variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTracked(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="container relative text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t("track.subtitle")}</p>
              <h1 className="text-4xl font-bold md:text-5xl">{t("track.title1")}<span className="gold-text">{t("track.title2")}</span></h1>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("track.desc")}</p>
            </motion.div>
          </div>
        </section>

        <section className="container max-w-xl pb-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">{t("track.orderId")}</Label>
                  <div className="flex gap-3">
                    <Input id="orderId" placeholder="e.g. TS-20260305-001" value={orderId} onChange={(e) => { setOrderId(e.target.value); setTracked(false); }} maxLength={50} />
                    <Button type="submit" disabled={loading} className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 shrink-0">
                      <Search className="mr-2 h-4 w-4" />
                      {loading ? "..." : t("track.track")}
                    </Button>
                  </div>
                </div>
              </form>

              {tracked && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-8">
                  <div className="mb-4 rounded-xl bg-secondary/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("track.order")}</span>
                      <span className="font-mono font-medium text-foreground">{orderId}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">{t("track.status")}</span>
                      <span className="font-medium text-primary">{t("track.inTransit")}</span>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {mockStatuses.map((status, i) => (
                      <div key={status.step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${status.done ? "border-primary bg-primary/10" : "border-border bg-secondary/50"}`}>
                            <status.icon className={`h-5 w-5 ${status.done ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          {i < mockStatuses.length - 1 && <div className={`w-0.5 h-8 ${status.done ? "bg-primary/40" : "bg-border"}`} />}
                        </div>
                        <div className="pt-2">
                          <p className={`text-sm font-medium ${status.done ? "text-foreground" : "text-muted-foreground"}`}>{status.step}</p>
                          <p className="text-xs text-muted-foreground">{status.date}</p>
                        </div>
                      </div>
                    ))}
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

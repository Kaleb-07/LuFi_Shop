import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { useLanguage } from "../../contexts/LanguageContext";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center space-y-6">
          <div className="text-8xl font-heading font-bold gold-text">404</div>
          <h1 className="text-2xl font-bold text-foreground">{t("notFound.title")}</h1>
          <p className="text-muted-foreground max-w-md mx-auto">{t("notFound.desc")}</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => window.history.back()} variant="outline" className="border-border hover:bg-secondary">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("notFound.goBack")}
            </Button>
            <Link to="/">
              <Button className="gold-gradient text-primary-foreground font-semibold hover:opacity-90">
                <Home className="mr-2 h-4 w-4" /> {t("notFound.home")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

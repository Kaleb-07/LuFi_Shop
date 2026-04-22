import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube, CreditCard, Apple, Wallet } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="container pt-20 pb-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-5">
          <div className="col-span-2 space-y-8 md:col-span-2">
            <div>
              <Link to="/" className="font-heading text-2xl font-bold tracking-tight">
                <span className="gold-text">LuFi</span><span className="text-foreground">Zon</span>
              </Link>
              <p className="mt-4 max-w-sm text-base text-muted-foreground leading-relaxed">
                Experience the next generation of technology. We curate only the finest flagship devices and premium accessories for your digital lifestyle.
              </p>
            </div>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Link key={i} to="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">{t("footer.shop")}</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link to="/?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/?category=fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link to="/?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link to="/?category=gadgets" className="hover:text-primary transition-colors">Gadgets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">{t("footer.support")}</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link to="/faq" className="hover:text-primary transition-colors">{t("nav.faq")}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t("footer.contactUs")}</Link></li>
              <li><Link to="/track-order" className="hover:text-primary transition-colors">{t("nav.trackOrder")}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Contact</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>mesafint007@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+251 901354819</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-border/40 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} LuFiZon. All rights reserved.
          </div>

          <div className="flex items-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
            <CreditCard className="h-6 w-6" />
            <Apple className="h-6 w-6" />
            <Wallet className="h-6 w-6" />
            <span className="font-bold text-xs tracking-tighter">VISA</span>
            <span className="font-bold text-xs tracking-tighter">AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

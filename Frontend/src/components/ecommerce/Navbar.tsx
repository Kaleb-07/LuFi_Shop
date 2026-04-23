import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, ChevronDown, LogIn, Settings, LogOut, ShoppingBag } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ecommerce/ecommerce-ui/avatar";
import ThemeToggle from "../../components/ecommerce/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ecommerce/ecommerce-ui/dropdown-menu";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync searchQuery state with URL ?q= parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
  }, [location.search]);

  // Live Search: Update URL when searchQuery changes
  const updateSearchURL = (query: string) => {
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    
    // Only navigate if we are on the store page OR if there is a query
    // This prevents redirecting to store page when just clearing a search on other pages
    if (location.pathname === "/store" || query) {
      navigate(`/store?${params.toString()}`, { replace: true });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchURL(searchQuery);
  };

  const onSearchChange = (val: string) => {
    setSearchQuery(val);
    updateSearchURL(val);
  };

  const navLinks = [
    { name: t("nav.store"), href: "/store" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  const isHomePage = location.pathname === "/" || location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only use transparency on the Home page at the top. Everything else is solid.
  const isSolid = scrolled || !isHomePage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid
          ? "border-b border-border/40 bg-white/90 backdrop-blur-xl shadow-sm"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-8">
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group transition-all duration-300 hover:opacity-90 active:scale-95">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-primary/20 transition-all duration-500 group-hover:shadow-primary/40 group-hover:rotate-[6deg] group-hover:scale-110 border border-primary/10">
              <img
                src="/favicon.svg"
                alt="LuFi Shop"
                className="h-full w-full object-cover"
                onError={(e) => {
                  // fallback to gradient cart icon if image not found
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden absolute inset-0 gold-gradient items-center justify-center">
                <span className="text-primary-foreground font-black text-lg">LF</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className={`text-base font-black tracking-tight transition-colors ${isSolid ? "text-foreground" : "text-white"}`}>
                LuFi <span className="text-primary">Shop</span>
              </span>
            </div>
          </Link>


          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold transition-colors hover:text-primary ${
                  isSolid ? "text-muted-foreground" : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden flex-1 max-w-md lg:block">
          <form onSubmit={handleSearch} className="relative group">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-primary ${
              isSolid ? "text-muted-foreground" : "text-white/70"
            }`} />
            <Input
              placeholder={t("nav.searchProducts")}
              className={`h-10 pl-10 border-transparent transition-all focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/30 ${
                isSolid
                  ? "bg-secondary/30 focus-visible:bg-white"
                  : "!bg-transparent bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:bg-white/20"
              }`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </form>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher isTransparent={!isSolid} />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="gold-gradient text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" /> {t("nav.profileSettings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    <ShoppingBag className="h-4 w-4" /> {t("nav.myOrders")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className={`font-semibold hover:text-primary ${
                isSolid ? "text-muted-foreground hover:bg-primary/5" : "text-white/90 hover:bg-white/15"
              }`}>
                {t("nav.signIn")}
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className={`hover:text-primary ${
              isSolid ? "text-muted-foreground hover:bg-primary/5" : "text-white/90 hover:bg-white/15"
            }`}>
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gold-gradient text-[9px] font-bold text-primary-foreground shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`rounded-lg p-2 hover:bg-secondary lg:hidden ${
            isSolid ? "text-muted-foreground" : "text-white/90"
          }`}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-white/95 backdrop-blur-xl p-6 lg:hidden space-y-6 slide-in-from-top-2 animate-in duration-300">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={t("nav.searchProducts")} 
              className="h-11 pl-10 bg-secondary/50 border-transparent" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {!user && (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full h-12 gold-gradient text-primary-foreground font-bold shadow-lg shadow-primary/20">
                {t("nav.signIn")}
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

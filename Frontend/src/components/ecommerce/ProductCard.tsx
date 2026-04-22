import { Link } from "react-router-dom";
import { ShoppingCart, Star, Check } from "lucide-react";
import { Product } from "../../lib/api";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Card, CardContent } from "../../components/ecommerce/ecommerce-ui/card";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart, items } = useCart();
  const { t } = useLanguage();
  const isInCart = items.some((item) => item.product.id === product.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Card className="h-full overflow-hidden border-border/30 bg-white transition-all duration-300 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem]">
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-secondary/20">
            <img
              src={product.images?.[0] || "/images/default.jpg"}
              alt={product.item_name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />

            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                {product.brand_name || t("common.noBrand")}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-[10px] font-bold text-foreground">4.8</span>
              </div>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-heading text-lg font-bold leading-tight text-foreground transition-colors hover:text-primary line-clamp-1">
                {product.item_name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                ETB {product.price ? product.price.toLocaleString() : "0"}
              </p>
            </div>
            <Button
              size="icon"
              disabled={product.stock_quantity === 0 || isInCart}
              onClick={() => addToCart(product)}
              className={`h-12 w-12 rounded-2xl shadow-lg transition-all transform active:scale-95 ${isInCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "gold-gradient text-primary-foreground shadow-primary/20"
                }`}
            >
              {isInCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

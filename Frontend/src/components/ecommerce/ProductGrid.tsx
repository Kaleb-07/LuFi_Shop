import ProductCard from "../../components/ecommerce/ProductCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { Product } from "../../lib/api";

interface ProductGridProps {
  title?: string;
  products: Product[];
  subtitle?: string;
}

const ProductGrid = ({ title, products, subtitle }: ProductGridProps) => {
  const { t } = useLanguage();

  return (
    <section className="container mt-16">
      {(title || subtitle) && (
        <div className="mb-8">
          {subtitle && <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">{subtitle}</p>}
          {title && <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>}
        </div>
      )}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">{t("grid.noProducts")}</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;

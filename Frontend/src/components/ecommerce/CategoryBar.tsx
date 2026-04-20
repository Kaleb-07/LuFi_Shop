import { Link } from "react-router-dom";
import { Laptop, Smartphone, Speaker, Watch, Cpu, Sparkles, ShoppingBag } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const categories = [
    { name: "Electronics", slug: "electronics", icon: Laptop },
    { name: "Gadgets", slug: "gadgets", icon: Cpu },
    { name: "Bags", slug: "bags", icon: ShoppingBag },
    { name: "Shoes", slug: "shoes", icon: Sparkles },
    { name: "Accessories", slug: "accessories", icon: Watch },
    { name: "Home & Living", slug: "home", icon: Speaker },
];

const CategoryBar = () => {
    const { t } = useLanguage();

    return (
        <div className="border-b border-border/40 bg-white">
            <div className="container">
                <div className="flex items-center justify-center gap-1 overflow-x-auto py-2 scrollbar-none">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/shop/store?category=${cat.name}`}
                            className="flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-primary transition-all hover:scale-105 active:scale-95"
                        >
                            <cat.icon className="h-4 w-4" />
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;

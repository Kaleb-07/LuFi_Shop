import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Package,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Product } from "../../lib/api";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { toast } from "react-hot-toast";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState<"all" | "visible" | "hidden">("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      const updated = await adminApi.updateProduct(product.id, { 
        is_visible: !product.is_visible 
      });
      setProducts(products.map(p => p.id === product.id ? updated : p));
      toast.success(`Product ${updated.is_visible ? 'visible' : 'hidden'}`);
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await adminApi.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.item_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.item_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterVisible === "all" || 
                         (filterVisible === "visible" && p.is_visible) || 
                         (filterVisible === "hidden" && !p.is_visible);
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Products</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your inventory, prices, and visibility.</p>
          </div>
          <Button className="gold-gradient text-white font-bold rounded-2xl px-6 h-12 shadow-lg shadow-primary/20 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Product
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Package className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Items</p>
                    <p className="text-xl font-black text-slate-900">{products.length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Stock</p>
                    <p className="text-xl font-black text-slate-900">{products.filter(p => p.stock_quantity > 0).length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Low Stock</p>
                    <p className="text-xl font-black text-slate-900">{products.filter(p => p.stock_quantity < 5).length}</p>
                </div>
            </div>
        </div>

        {/* Table & Filters */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           {/* Controls */}
           <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative group flex-1 max-w-sm">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                 <Input 
                   placeholder="Search items or codes..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white rounded-xl"
                 />
              </div>
              <div className="flex items-center gap-2">
                 <Button 
                   variant={filterVisible === 'all' ? 'default' : 'ghost'} 
                   onClick={() => setFilterVisible('all')}
                   className={`rounded-xl px-4 font-bold ${filterVisible === 'all' ? 'gold-gradient text-white' : 'text-slate-500'}`}
                 >
                   All
                 </Button>
                 <Button 
                   variant={filterVisible === 'visible' ? 'default' : 'ghost'} 
                   onClick={() => setFilterVisible('visible')}
                   className={`rounded-xl px-4 font-bold ${filterVisible === 'visible' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                 >
                   Visible
                 </Button>
                 <Button 
                   variant={filterVisible === 'hidden' ? 'default' : 'ghost'} 
                   onClick={() => setFilterVisible('hidden')}
                   className={`rounded-xl px-4 font-bold ${filterVisible === 'hidden' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                 >
                   Hidden
                 </Button>
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Product</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Inventory</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Pricing</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                       [1,2,3,4,5].map(i => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan={5} className="px-6 py-8"><div className="h-8 bg-slate-100 rounded-xl" /></td>
                          </tr>
                       ))
                    ) : filteredProducts.map((p) => (
                       <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                   <img src={p.images?.[0] || "/images/default.jpg"} className="h-full w-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                   <p className="font-bold text-slate-900 truncate">{p.item_name}</p>
                                   <p className="text-xs text-slate-400 font-medium">{p.item_code}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${p.stock_quantity > 10 ? 'bg-green-500' : p.stock_quantity > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                <span className="font-bold text-slate-700">{p.stock_quantity} in stock</span>
                             </div>
                             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">{p.brand_name || 'No Brand'}</p>
                          </td>
                          <td className="px-6 py-4">
                             <p className="font-black text-slate-900">ETB {p.price.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                             <Badge className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${p.is_visible ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {p.is_visible ? 'Active' : 'Hidden'}
                             </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => toggleVisibility(p)}
                                  className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all list-none"
                                  title={p.is_visible ? "Hide from shop" : "Show in shop"}
                                >
                                   {p.is_visible ? <Eye className="h-4 w-4 text-slate-500" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
                                </button>
                                <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
                                   <Edit2 className="h-4 w-4 text-blue-500" />
                                </button>
                                <button 
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-2 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all"
                                >
                                   <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Pagination Placeholder */}
           <div className="p-6 border-t border-slate-50 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">Showing {filteredProducts.length} of {products.length} products</p>
              <div className="flex items-center gap-4">
                 <Button variant="outline" size="sm" className="rounded-xl border-slate-200" disabled>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                 </Button>
                 <div className="flex items-center gap-1">
                    <Button variant="default" size="sm" className="h-8 w-8 p-0 rounded-lg bg-slate-900 text-white font-bold">1</Button>
                 </div>
                 <Button variant="outline" size="sm" className="rounded-xl border-slate-200" disabled>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;

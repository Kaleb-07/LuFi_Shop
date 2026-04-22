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
  TrendingUp,
  AlertCircle,
  X,
  Upload,
  Loader2
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Product, fetchCategories, fetchBrands, Category, Brand } from "../../lib/api";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Textarea } from "../../components/ecommerce/ecommerce-ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../../components/ecommerce/ecommerce-ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ecommerce/ecommerce-ui/select";
import { toast } from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState<"all" | "visible" | "hidden">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    item_name: "",
    item_code: "",
    price: 0,
    stock_quantity: 0,
    description: "",
    category_id: undefined,
    brand_id: undefined,
    is_visible: true,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        adminApi.getProducts(),
        fetchCategories(),
        fetchBrands()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err) {
      console.error("Failed to fetch admin products data", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        item_name: product.item_name,
        item_code: product.item_code,
        price: product.price,
        stock_quantity: product.stock_quantity,
        description: product.description || "",
        category_id: product.category_id,
        brand_id: product.brand_id,
        is_visible: product.is_visible,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        item_name: "",
        item_code: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
        price: 0,
        stock_quantity: 0,
        description: "",
        category_id: undefined,
        brand_id: undefined,
        is_visible: true,
      });
    }
    setSelectedFiles([]);
    setPreviews([]);
    setExistingImages(product?.images || []);
    setImagesToRemove([]);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      
      // Append basic fields
      if (formData.item_name) data.append('item_name', formData.item_name);
      if (formData.item_code) data.append('item_code', formData.item_code);
      if (formData.price !== undefined) data.append('price', formData.price.toString());
      if (formData.stock_quantity !== undefined) data.append('stock_quantity', formData.stock_quantity.toString());
      if (formData.description) data.append('description', formData.description);
      if (formData.category_id) data.append('category_id', formData.category_id.toString());
      if (formData.brand_id) data.append('brand_id', formData.brand_id.toString());
      
      data.append('is_visible', formData.is_visible ? '1' : '0');

      // Append new images
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          data.append('images[]', file);
        });
      }

      // Append images to remove
      if (imagesToRemove.length > 0) {
        imagesToRemove.forEach(url => {
          data.append('remove_images[]', url);
        });
      }

      if (editingProduct) {
        const response = await adminApi.updateProduct(editingProduct.id, data);
        const updated = (response as any).product || response;
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        toast.success("Product updated successfully");
      } else {
        const response = await adminApi.createProduct(data);
        const created = (response as any).product || response;
        setProducts([created, ...products]);
        toast.success("Product created successfully");
      }
      setModalOpen(false);
    } catch (err: any) {
      console.error("Submit failed", err);
      
      // Try to extract detailed validation errors
      let errorMsg = "Operation failed";
      if (err.response?.errors) {
        const errors = err.response.errors;
        errorMsg = Object.values(errors).flat().join(", ");
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Filter out files larger than 2MB
      const validFiles = files.filter(file => {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 2MB)`, { icon: "⚠️" });
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
    setImagesToRemove(prev => [...prev, url]);
  };

  const toggleVisibility = async (product: Product) => {
    try {
      const response = await adminApi.updateProduct(product.id, { 
        is_visible: !product.is_visible 
      });
      const updated = (response as any).product || response;
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
    const matchesSearch = (p.item_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                         (p.item_code?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesFilter = filterVisible === "all" || 
                         (filterVisible === "visible" && p.is_visible) || 
                         (filterVisible === "hidden" && !p.is_visible);
    
    const matchesCategory = filterCategory === "all" || p.category_id?.toString() === filterCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
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
          <Button 
            onClick={() => handleOpenModal()}
            className="gold-gradient text-white font-bold rounded-2xl px-6 h-12 shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Package className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Products</p>
                    <p className="text-xl font-black text-slate-900">{products.length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Stock</p>
                    <p className="text-xl font-black text-slate-900">{products.filter(p => p.stock_quantity <= 10).length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                    <EyeOff className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hidden Items</p>
                    <p className="text-xl font-black text-slate-900">{products.filter(p => !p.is_visible).length}</p>
                </div>
            </div>
        </div>


        {/* Table & Filters */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           {/* Controls */}
           <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
                 <div className="relative group flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white rounded-xl"
                    />
                 </div>
                 
                 <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px] h-11 bg-slate-50 border-transparent focus:ring-0 rounded-xl font-bold text-slate-600">
                       <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                       <SelectItem value="all" className="font-bold">All Categories</SelectItem>
                       {categories.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()} className="font-bold">{c.name}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl">
                 <button 
                   onClick={() => setFilterVisible('all')}
                   className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${filterVisible === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   All
                 </button>
                 <button 
                   onClick={() => setFilterVisible('visible')}
                   className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${filterVisible === 'visible' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Visible
                 </button>
                 <button 
                   onClick={() => setFilterVisible('hidden')}
                   className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${filterVisible === 'hidden' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Hidden
                 </button>
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
                                <button 
                                  onClick={() => handleOpenModal(p)}
                                  className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all"
                                >
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col scrollbar-hide">
          <div className="gold-gradient p-8 pb-6 text-white rounded-t-[2rem]">
             <DialogHeader>
                <DialogTitle className="text-2xl font-black text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <DialogDescription className="font-medium text-white/80">
                  {editingProduct ? `Updating ${editingProduct.item_name}` : "Fill in the details to list a new item in your store."}
                </DialogDescription>
             </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 pt-6 space-y-6 overflow-y-auto scrollbar-hide flex-1">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Product Name</label>
                     <Input 
                       required
                       value={formData.item_name}
                       onChange={e => setFormData({...formData, item_name: e.target.value})}
                       className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                       placeholder="e.g. Vintage Leather Jacket"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Product Code</label>
                     <Input 
                       required
                       value={formData.item_code}
                       onChange={e => setFormData({...formData, item_code: e.target.value})}
                       className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                       placeholder="e.g. PRD-001"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Price (ETB)</label>
                     <Input 
                       required
                       type="number"
                       value={formData.price}
                       onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                       className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Stock Quantity</label>
                     <Input 
                       required
                       type="number"
                       value={formData.stock_quantity}
                       onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                       className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Category</label>
                     <Select 
                       value={formData.category_id?.toString() || ""} 
                       onValueChange={v => setFormData({...formData, category_id: parseInt(v)})}
                     >
                       <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-xl font-bold">
                         <SelectValue placeholder="Select Category" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-slate-100">
                         {categories.map(cat => (
                           <SelectItem key={cat.id} value={cat.id.toString()} className="rounded-lg">{cat.name}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Brand</label>
                     <Select 
                       value={formData.brand_id?.toString() || ""} 
                       onValueChange={v => setFormData({...formData, brand_id: parseInt(v)})}
                     >
                       <SelectTrigger className="h-12 bg-slate-50 border-transparent rounded-xl font-bold">
                         <SelectValue placeholder="Select Brand" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-slate-100">
                         {brands.map(brand => (
                           <SelectItem key={brand.id} value={brand.id.toString()} className="rounded-lg">{brand.name}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                   <div className="col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Description</label>
                      <Textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="bg-slate-50 border-transparent focus:bg-white rounded-xl font-medium min-h-[100px]"
                        placeholder="Detailed product description..."
                      />
                   </div>

                   <div className="col-span-2 space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-1">Product Images</label>
                      
                      <div className="grid grid-cols-4 gap-4">
                         {/* Existing Images */}
                         {existingImages.map((url, i) => (
                            <div key={`existing-${i}`} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                               <img src={url} className="h-full w-full object-cover" alt="" />
                               <button 
                                 type="button"
                                 onClick={() => removeExistingImage(url)}
                                 className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                  <X className="h-3 w-3" />
                               </button>
                            </div>
                         ))}
                         
                         {/* Selected File Previews */}
                         {previews.map((url, i) => (
                            <div key={`new-${i}`} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group bg-slate-50">
                               <img src={url} className="h-full w-full object-cover" alt="" />
                               <button 
                                 type="button"
                                 onClick={() => removeSelectedFile(i)}
                                 className="absolute top-2 right-2 p-1.5 bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                  <X className="h-3 w-3" />
                               </button>
                            </div>
                         ))}

                         {/* Upload Button */}
                         <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-slate-50 transition-all flex flex-col items-center justify-center cursor-pointer gap-2">
                            <Upload className="h-6 w-6 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload</span>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleFileChange}
                            />
                         </label>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic">Upload multiple images. Recommended size: 800x800px.</p>
                   </div>
               </div>
            </div>
            <DialogFooter className="bg-slate-50 p-6 flex items-center justify-between gap-4">
               <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="visible" 
                    checked={formData.is_visible}
                    onChange={e => setFormData({...formData, is_visible: e.target.checked})}
                    className="h-5 w-5 rounded-md border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="visible" className="text-sm font-bold text-slate-600">Make visible in store</label>
               </div>
               <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="rounded-xl font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gold-gradient text-white font-bold rounded-xl px-8 min-w-[140px]">
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (editingProduct ? "Save Changes" : "Create Product")}
                  </Button>
               </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;

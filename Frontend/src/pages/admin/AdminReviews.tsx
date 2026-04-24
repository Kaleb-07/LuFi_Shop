import { useState, useEffect } from "react";
import { 
  Star, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  MessageSquare,
  User,
  Package,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { useToast } from "../../hooks/use-toast";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Re-using apiFetch via adminApi if I added it, or just use a custom fetch here
      // For now, I'll assume I added getReviews to adminApi
      const data = await adminApi.getReviews();
      setReviews(data.data || data); // Handle paginated or raw array
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
    try {
      await adminApi.updateReviewStatus(id, newStatus);
      toast({ title: "Status Updated", description: `Review is now ${newStatus}.` });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminApi.deleteReview(id);
      toast({ title: "Deleted", description: "Review has been removed." });
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete review.", variant: "destructive" });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReviews.map(r => r.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkStatusUpdate = async (status: 'active' | 'hidden') => {
    try {
      await Promise.all(selectedIds.map(id => adminApi.updateReviewStatus(id, status)));
      toast({ title: "Bulk Update Success", description: `${selectedIds.length} reviews updated.` });
      setReviews(reviews.map(r => selectedIds.includes(r.id) ? { ...r, status } : r));
      setSelectedIds([]);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update some reviews.", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} reviews?`)) return;
    try {
      await Promise.all(selectedIds.map(id => adminApi.deleteReview(id)));
      toast({ title: "Bulk Delete Success", description: `${selectedIds.length} reviews removed.` });
      setReviews(reviews.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete some reviews.", variant: "destructive" });
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.product?.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Reviews</h1>
            <p className="text-slate-500 font-medium mt-1">Moderate customer feedback and ratings.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews, users, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-slate-900 text-white p-4 rounded-3xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4 px-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black">
                {selectedIds.length}
              </div>
              <p className="text-sm font-bold tracking-tight">Items Selected</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => handleBulkStatusUpdate('active')} variant="ghost" className="text-white hover:bg-white/10 rounded-xl h-10 px-4 text-xs font-black">
                <Eye className="h-4 w-4 mr-2" />
                Show All
              </Button>
              <Button onClick={() => handleBulkStatusUpdate('hidden')} variant="ghost" className="text-white hover:bg-white/10 rounded-xl h-10 px-4 text-xs font-black">
                <EyeOff className="h-4 w-4 mr-2" />
                Hide All
              </Button>
              <Button onClick={handleBulkDelete} variant="ghost" className="text-red-400 hover:bg-red-500/10 rounded-xl h-10 px-4 text-xs font-black">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
              <div className="w-px h-6 bg-white/20 mx-2 self-center" />
              <Button onClick={() => setSelectedIds([])} variant="ghost" className="text-white/60 hover:text-white rounded-xl h-10 px-4 text-xs font-black">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Select All Toggle */}
        {!loading && filteredReviews.length > 0 && (
          <div className="flex items-center gap-3 px-6">
            <input 
              type="checkbox" 
              checked={selectedIds.length === filteredReviews.length && filteredReviews.length > 0}
              onChange={toggleSelectAll}
              className="h-5 w-5 rounded-lg border-slate-200 text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Select All Reviews</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
                {review.status === 'hidden' && (
                  <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl">
                    Hidden
                  </div>
                )}
                
                <div className="grid grid-cols-[auto_1fr_auto] gap-8">
                  <div className="flex items-center pt-2">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(review.id)}
                      onChange={() => toggleSelect(review.id)}
                      className="h-6 w-6 rounded-xl border-slate-200 text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{review.user?.name}</p>
                          <p className="text-xs text-slate-400 font-bold">{review.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                          <Package className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{review.product?.item_name}</p>
                          <p className="text-xs text-slate-400 font-bold italic">Product Reference</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{new Date(review.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-slate-400 font-bold italic">Date Submitted</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"}`} />
                        ))}
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 justify-center">
                    <Button 
                      variant="outline" 
                      className={`rounded-2xl border-2 transition-all font-black text-xs ${
                        review.status === 'active' 
                          ? "border-slate-100 text-slate-400 hover:border-amber-400 hover:text-amber-500" 
                          : "border-amber-100 bg-amber-50 text-amber-600 hover:border-amber-200"
                      }`}
                      onClick={() => handleStatusToggle(review.id, review.status)}
                    >
                      {review.status === 'active' ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {review.status === 'active' ? "Hide Review" : "Show Review"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl border-2 border-slate-100 text-slate-400 hover:border-red-400 hover:text-red-500 transition-all font-black text-xs"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-20 text-center">
                <MessageSquare className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900">No reviews found</h3>
                <p className="text-slate-400 font-bold italic mt-2">Try adjusting your search or check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;

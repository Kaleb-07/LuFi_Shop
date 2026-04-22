import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  MoreVertical,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Loader2,
  Printer
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Order } from "../../lib/api";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ecommerce/ecommerce-ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ecommerce/ecommerce-ui/dialog";
import { toast } from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: number) => {
     setLoadingDetail(true);
     setDetailOpen(true);
     try {
        const order = await adminApi.getOrderDetails(id);
        setSelectedOrder(order);
     } catch (err) {
        toast.error("Failed to load order details");
        setDetailOpen(false);
     } finally {
        setLoadingDetail(false);
     }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response: any = await adminApi.updateOrderStatus(id, newStatus);
      const updatedOrder = response.order || response;
      setOrders(orders.map(o => o.id === id ? updatedOrder : o));
      if (selectedOrder?.id === id) setSelectedOrder(updatedOrder);
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusIcon = (status: string = "") => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <ShoppingBag className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string = "") => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const filteredOrders = orders.filter(o => {
    const orderNumber = o.order_number || "";
    const customerName = o.customer_name || o.email || "Unknown Customer";
    const status = o.status || "";
    
    const matchesSearch = orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900">Orders</h1>
          <p className="text-slate-500 font-medium mt-1">Review and process customer orders in real-time.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative group flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search orders or names..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white border-slate-200 rounded-xl"
              />
           </div>
           <div className="flex flex-wrap items-center gap-2">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
                 <Button 
                   key={status}
                   variant={statusFilter === status ? "default" : "outline"}
                   onClick={() => setStatusFilter(status)}
                   className={`rounded-xl px-4 font-bold capitalize ${statusFilter === status ? "bg-slate-900 text-white" : "border-slate-200 text-slate-500"}`}
                 >
                   {status}
                 </Button>
              ))}
           </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Order Details</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Customer</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Total</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Progress</th>
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
                    ) : (filteredOrders.map((order) => (
                       <tr key={order.id} className="group hover:bg-slate-50/5 transition-colors">
                          <td className="px-6 py-4">
                             <div>
                                <p className="font-black text-slate-900">{order.order_number}</p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
                                   <Calendar className="h-3 w-3" />
                                   {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div>
                                <p className="font-bold text-slate-900">{order.customer_name || order.email.split('@')[0]}</p>
                                <p className="text-xs text-slate-500">{order.email}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="font-black text-slate-900">ETB {order.total_amount?.toLocaleString() || "0"}</p>
                             <div className="flex items-center gap-1.5 mt-1">
                                <CreditCard className="h-3 w-3 text-slate-300" />
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${order.payment_status === 'paid' ? 'text-green-600' : 'text-slate-400'}`}>
                                   {order.payment_status || 'Pending'}
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <Badge className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 w-fit ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                             </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() => handleViewDetails(order.id)}
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-10 rounded-xl font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 gap-2"
                                >
                                   <Eye className="h-4 w-4" /> View
                                </Button>
                                
                                <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                                         <MoreVertical className="h-4 w-4 text-slate-400" />
                                      </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100">
                                      <p className="px-2 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Update Status</p>
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'processing')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-bold">
                                         <ShoppingBag className="h-4 w-4" /> Processing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'shipped')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-purple-50 focus:text-purple-600 font-bold">
                                         <Truck className="h-4 w-4" /> Shipped
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'delivered')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-green-50 focus:text-green-600 font-bold">
                                         <CheckCircle className="h-4 w-4" /> Delivered
                                      </DropdownMenuItem>
                                      <div className="h-px bg-slate-100 my-1" />
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'cancelled')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-red-50 focus:text-red-600 font-bold">
                                         <XCircle className="h-4 w-4" /> Cancelled
                                      </DropdownMenuItem>
                                   </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                          </td>
                       </tr>
                    )))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
         <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col scrollbar-hide">
            {loadingDetail ? (
               <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="font-bold text-slate-400">Loading order details...</p>
               </div>
            ) : selectedOrder && (
               <div className="flex flex-col h-full overflow-hidden">
                  <DialogHeader className="gold-gradient p-6 text-white space-y-3 shrink-0">
                     <div className="flex items-center justify-between">
                        <Badge className={`rounded-xl px-3 py-1 font-black uppercase tracking-widest text-[10px] ${getStatusColor(selectedOrder.status)}`}>
                           {selectedOrder.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-xl gap-2 font-bold" onClick={() => window.print()}>
                           <Printer className="h-4 w-4" /> Print
                        </Button>
                     </div>
                     <DialogTitle className="text-2xl font-black text-white">
                        {selectedOrder.order_number}
                     </DialogTitle>
                     <DialogDescription className="text-slate-400 font-medium text-xs">
                        Placed on {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A"}
                     </DialogDescription>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-hide">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Customer & Shipping */}
                        <div className="space-y-6">
                           <div>
                              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic mb-3">Customer</h3>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center">
                                       <ShoppingBag className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900">{selectedOrder.customer_name || selectedOrder.user?.name || selectedOrder.email}</p>
                                       <p className="text-[10px] text-slate-500 font-medium">{selectedOrder.email}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center">
                                       <Phone className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{selectedOrder.phone}</p>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic mb-3">Shipping Address</h3>
                              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                 <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                 <p className="text-xs font-bold text-slate-700 leading-relaxed">{selectedOrder.shipping_address}</p>
                              </div>
                           </div>

                           <div>
                              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic mb-3">Payment</h3>
                              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    <p className="text-sm font-bold text-slate-700 capitalize">{selectedOrder.payment_method}</p>
                                 </div>
                                 <Badge className={`rounded-lg font-black uppercase text-[8px] ${selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {selectedOrder.payment_status || 'Pending'}
                                 </Badge>
                              </div>
                           </div>
                        </div>

                        {/* Right Column: Order Items */}
                        <div>
                           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic mb-3">Order Summary</h3>
                           <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                              {selectedOrder.items?.map((item) => (
                                 <div key={item.id} className="flex items-center justify-between p-2 rounded-xl border border-slate-50">
                                    <div className="flex items-center gap-2">
                                       <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">
                                          <img src={item.product?.images?.[0] || "/images/default.jpg"} className="h-full w-full object-cover" alt="" />
                                       </div>
                                       <div>
                                          <p className="text-xs font-black text-slate-900 truncate max-w-[120px]">{item.product?.item_name}</p>
                                          <p className="text-[9px] font-bold text-slate-400">{item.quantity} x ETB {item.price?.toLocaleString() || "0"}</p>
                                       </div>
                                    </div>
                                    <p className="text-xs font-black text-slate-900">ETB {((item.quantity || 0) * (item.price || 0)).toLocaleString()}</p>
                                 </div>
                              ))}
                           </div>

                           <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                              <div className="flex justify-between text-xs">
                                 <span className="text-slate-400 font-bold">Subtotal</span>
                                 <span className="text-slate-900 font-black">ETB {selectedOrder.total_amount?.toLocaleString() || "0"}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                 <span className="text-slate-400 font-bold">Shipping</span>
                                 <span className="text-slate-900 font-black italic">Calculated</span>
                              </div>
                              <div className="flex justify-between text-lg pt-3 border-t border-dashed border-slate-200">
                                 <span className="font-black text-slate-900 text-sm">Total</span>
                                 <span className="font-black text-primary">ETB {selectedOrder.total_amount?.toLocaleString() || "0"}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4 shrink-0">
                     {selectedOrder.status === 'pending' && (
                        <Button onClick={() => updateStatus(selectedOrder.id, 'processing')} className="gold-gradient text-white font-bold rounded-xl px-8 shadow-lg shadow-primary/20 h-10 text-sm">
                           Confirm Order & Start Processing
                        </Button>
                     )}
                     {selectedOrder.status === 'processing' && (
                        <Button onClick={() => updateStatus(selectedOrder.id, 'shipped')} className="bg-blue-600 text-white font-bold rounded-xl px-8 shadow-lg shadow-blue-600/20 h-10 text-sm">
                           Mark as Shipped
                        </Button>
                     )}
                     {selectedOrder.status === 'shipped' && (
                        <Button onClick={() => updateStatus(selectedOrder.id, 'delivered')} className="bg-green-600 text-white font-bold rounded-xl px-8 shadow-lg shadow-green-600/20 h-10 text-sm">
                           Mark as Delivered
                        </Button>
                     )}
                  </div>
               </div>
            )}
         </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;

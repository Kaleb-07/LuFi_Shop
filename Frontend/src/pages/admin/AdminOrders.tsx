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
  ChevronDown
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
import { toast } from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const updated = await adminApi.updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? updated : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const updatePayment = async (id: number, paymentStatus: string) => {
     try {
       const order = orders.find(o => o.id === id);
       if (!order) return;
       const updated = await adminApi.updateOrderStatus(id, order.status, paymentStatus);
       setOrders(orders.map(o => o.id === id ? updated : o));
       toast.success(`Payment marked as ${paymentStatus}`);
     } catch (err) {
       toast.error("Failed to update payment");
     }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <ShoppingBag className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
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
                                   {new Date(order.created_at).toLocaleDateString()}
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div>
                                <p className="font-bold text-slate-900">{order.customer_name}</p>
                                <p className="text-xs text-slate-500">{order.email}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="font-black text-slate-900">ETB {order.total_amount.toLocaleString()}</p>
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
                                <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-10 rounded-xl font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 gap-2">
                                         Status <ChevronDown className="h-4 w-4" />
                                      </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100">
                                      <p className="px-2 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Promote Stage</p>
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'processing')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-blue-50 focus:text-blue-600">
                                         <ShoppingBag className="h-4 w-4" /> Processing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'shipped')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-purple-50 focus:text-purple-600">
                                         <Truck className="h-4 w-4" /> Shipped
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'delivered')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-green-50 focus:text-green-600">
                                         <CheckCircle className="h-4 w-4" /> Delivered
                                      </DropdownMenuItem>
                                      <div className="h-px bg-slate-100 my-1" />
                                      <DropdownMenuItem onClick={() => updateStatus(order.id, 'cancelled')} className="rounded-xl flex items-center gap-2 cursor-pointer focus:bg-red-50 focus:text-red-600">
                                         <XCircle className="h-4 w-4" /> Cancelled
                                      </DropdownMenuItem>
                                   </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                                   <MoreVertical className="h-4 w-4 text-slate-400" />
                                </Button>
                             </div>
                          </td>
                       </tr>
                    )))}
                 </tbody>
              </table>
           </div>
           {filteredOrders.length === 0 && !loading && (
               <div className="p-20 text-center">
                   <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <ShoppingBag className="h-8 w-8 text-slate-300" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900">No orders found</h3>
                   <p className="text-slate-500 font-medium mt-1">Try adjusting your filters or search query.</p>
               </div>
           )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

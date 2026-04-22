import { useState, useEffect } from "react";
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Trash2
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "../../components/ecommerce/ecommerce-ui/dialog";
import { toast } from "react-hot-toast";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
  avatar?: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers", err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
    setLoadingDetails(true);
    try {
      const data = await adminApi.getUserDetails(customer.id);
      setCustomerOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to load customer details", err);
      toast.error("Could not load order history");
    } finally {
      setLoadingDetails(false);
    }
  };

  const deleteCustomer = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
    
    try {
      await adminApi.deleteUser(id);
      setCustomers(customers.filter(c => c.id !== id));
      toast.success("Customer deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete customer", err);
      let msg = "Failed to delete customer";
      if (err.response?.message) msg = err.response.message;
      toast.error(msg);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (c.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900">Customers</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your customer base and track their engagement.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Customers</p>
                    <p className="text-xl font-black text-slate-900">{customers.length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active This Month</p>
                    <p className="text-xl font-black text-slate-900">{customers.filter(c => c.orders_count > 0).length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <DollarSign className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Customer Value</p>
                    <p className="text-xl font-black text-slate-900">
                        ETB {customers.length > 0 ? (customers.reduce((acc, c) => acc + c.total_spent, 0) / customers.length).toFixed(0) : 0}
                    </p>
                </div>
            </div>
        </div>

        {/* Table & Filters */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-50">
              <div className="relative group max-w-sm">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                 <Input 
                   placeholder="Search by name or email..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white rounded-xl"
                 />
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Customer Info</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Orders</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Total Spent</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Joined</th>
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
                    ) : (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl gold-gradient text-white flex items-center justify-center font-bold text-sm">
                                    {(customer.name || "??").slice(0, 2).toUpperCase()}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{customer.name}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                       <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                          <Mail className="h-2.5 w-2.5" /> {customer.email}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <Badge variant="outline" className="rounded-lg bg-slate-50 border-slate-200 text-slate-700 font-bold">
                                 {customer.orders_count} Orders
                              </Badge>
                           </td>
                           <td className="px-6 py-4">
                              <p className="font-black text-slate-900">ETB {customer.total_spent.toLocaleString()}</p>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                 <Calendar className="h-3 w-3" />
                                 {new Date(customer.created_at).toLocaleDateString()}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button 
                                    onClick={() => handleViewCustomer(customer)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="rounded-xl hover:bg-slate-50"
                                    title="View Customer Details"
                                  >
                                    <ExternalLink className="h-4 w-4 text-slate-400" />
                                 </Button>
                                 <Button 
                                   onClick={() => deleteCustomer(customer.id)}
                                   variant="ghost" 
                                   size="icon" 
                                   className="rounded-xl hover:bg-red-50 group/del"
                                   title="Delete Customer"
                                 >
                                    <Trash2 className="h-4 w-4 text-slate-400 group-hover/del:text-red-500 transition-colors" />
                                 </Button>
                              </div>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>

           {filteredCustomers.length === 0 && !loading && (
               <div className="p-20 text-center">
                   <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Users className="h-8 w-8 text-slate-300" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900">No customers found</h3>
                   <p className="text-slate-500 font-medium mt-1">Try adjusting your search query.</p>
               </div>
           )}
        </div>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
         <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col scrollbar-hide">
            {selectedCustomer && (
               <div className="flex flex-col h-full overflow-hidden">
                  <DialogHeader className="gold-gradient p-8 text-white space-y-3 shrink-0">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="h-16 w-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl">
                              {(selectedCustomer?.name || "??").slice(0, 2).toUpperCase()}
                           </div>
                           <div>
                              <DialogTitle className="text-2xl font-black text-white">{selectedCustomer?.name}</DialogTitle>
                              <DialogDescription className="text-white/70 font-medium">{selectedCustomer?.email}</DialogDescription>
                           </div>
                        </div>
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-none rounded-xl px-3 py-1">
                           Joined {selectedCustomer?.created_at ? new Date(selectedCustomer.created_at as string).toLocaleDateString() : 'N/A'}
                        </Badge>
                     </div>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-hide">
                     <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-2">Total Orders</p>
                           <p className="text-2xl font-black text-slate-900">{selectedCustomer?.orders_count}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-2">Total Spent</p>
                           <p className="text-2xl font-black text-slate-900">ETB {selectedCustomer?.total_spent.toLocaleString()}</p>
                        </div>
                     </div>

                     <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                           <ShoppingBag className="h-4 w-4 text-primary" />
                           Recent Activity
                        </h3>
                        {loadingDetails ? (
                           <div className="py-12 flex justify-center">
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                           </div>
                        ) : customerOrders.length > 0 ? (
                           <div className="space-y-3">
                              {customerOrders.map((order) => (
                                 <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-3">
                                       <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                          <ShoppingBag className="h-5 w-5 text-slate-400" />
                                       </div>
                                       <div>
                                          <p className="text-sm font-black text-slate-900">{order.order_number}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                             {new Date(order.created_at).toLocaleDateString()} • {order.status}
                                          </p>
                                       </div>
                                    </div>
                                    <p className="text-sm font-black text-slate-900">ETB {order.total_amount.toLocaleString()}</p>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                              <p className="text-sm font-bold text-slate-400 italic">No orders found for this customer.</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                     <Button 
                        onClick={() => setModalOpen(false)}
                        className="gold-gradient text-white font-bold rounded-xl px-8"
                     >
                        Close
                     </Button>
                  </div>
               </div>
            )}
         </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCustomers;

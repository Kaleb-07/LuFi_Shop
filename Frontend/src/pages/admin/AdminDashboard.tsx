import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Package, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import AdminLayout from "./AdminLayout";
import { adminApi, DashboardStats } from "../../lib/adminApi";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stats = await adminApi.getStats();
      setData(stats);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-40 w-full animate-pulse bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 animate-pulse bg-slate-200 rounded-3xl" />)}
          </div>
          <div className="h-96 w-full animate-pulse bg-slate-200 rounded-3xl" />
        </div>
      </AdminLayout>
    );
  }

  const kpis = [
    { name: "Total Revenue", value: `ETB ${data?.stats.revenue.toLocaleString()}`, change: "+12.5%", trending: "up", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", path: "/admin/orders" },
    { name: "Total Orders", value: data?.stats.orders.toString(), change: "+8.2%", trending: "up", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", path: "/admin/orders" },
    { name: "Total Customers", value: data?.stats.customers.toString(), change: "+3.1%", trending: "up", icon: Users, color: "text-orange-600", bg: "bg-orange-100", path: "/admin/customers" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <Clock className="h-3 w-3" />;
      case "delivered": return <CheckCircle className="h-3 w-3" />;
      case "shipped": return <Truck className="h-3 w-3" />;
      case "cancelled": return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
             <div 
               key={idx} 
               onClick={() => navigate(kpi.path)}
               className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} transition-transform group-hover:scale-110`}>
                      <kpi.icon className="h-6 w-6" />
                   </div>
                   <div className="flex items-center gap-1">
                      {kpi.trending === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : kpi.trending === 'down' ? <TrendingDown className="h-4 w-4 text-red-500" /> : null}
                      <span className={`text-xs font-bold ${kpi.trending === 'up' ? "text-green-600" : kpi.trending === 'down' ? "text-red-600" : "text-slate-400"}`}>
                        {kpi.change}
                      </span>
                   </div>
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{kpi.name}</p>
                   <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                </div>
             </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Revenue Chart */}
           <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-xl font-black text-slate-900">Revenue Analytics</h2>
                    <p className="text-sm text-slate-400 font-medium">Daily revenue performance for the last 7 days</p>
                 </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.revenueChart}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d1a054" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d1a054" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                      tickFormatter={(str) => {
                         const d = new Date(str);
                         return d.toLocaleDateString('en-US', { weekday: 'short' });
                      }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                      dx={-10}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                       itemStyle={{ fontWeight: 800, color: '#d1a054' }}
                       labelStyle={{ fontWeight: 800, marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#d1a054" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Recent Orders Overview */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
                    <p className="text-sm text-slate-400 font-medium">Latest customer activity</p>
                 </div>
                 <Link to="/admin/orders">
                    <Button variant="ghost" size="sm" className="text-primary font-bold rounded-xl">View All</Button>
                 </Link>
              </div>
              
              <div className="flex-1 space-y-4">
                 {data?.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:border-slate-200 transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                             <ShoppingBag className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900">{order.order_number}</p>
                             <p className="text-[10px] font-bold text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-slate-900">ETB {order.total_amount.toLocaleString()}</p>
                          <Badge className={`mt-1 text-[9px] px-1.5 py-0.5 rounded-lg border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                             {getStatusIcon(order.status)}
                             {order.status}
                          </Badge>
                       </div>
                    </div>
                 ))}
                 {data?.recentOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                       <ShoppingBag className="h-12 w-12 mb-2" />
                       <p className="text-sm font-bold">No orders yet</p>
                    </div>
                 )}
              </div>
              
           </div>
        </div>

        {/* Action Banner */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative group">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h2 className="text-3xl font-black">Want to see customer trends?</h2>
                 <p className="text-slate-400 mt-2 max-w-md font-medium">Explore detailed analytics on your top customers and their buying patterns.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/customers')}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-primary hover:text-white transition-all flex items-center gap-2 group/btn shadow-xl shadow-white/5"
              >
                 Customer Directory <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
           </div>
           <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors" />
           <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

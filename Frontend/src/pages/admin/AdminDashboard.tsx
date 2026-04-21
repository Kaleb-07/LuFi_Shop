import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Package, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ChevronRight
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
    { name: "Total Revenue", value: `ETB ${data?.stats.revenue.toLocaleString()}`, change: "+12.5%", trending: "up", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { name: "Total Orders", value: data?.stats.orders.toString(), change: "+8.2%", trending: "up", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Total Products", value: data?.stats.products.toString(), change: "Managed", trending: "none", icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Total Customers", value: data?.stats.customers.toString(), change: "+3.1%", trending: "up", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
  ];

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
             <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
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
                 <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       Revenue
                    </div>
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

           {/* Orders Overview */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
              <div className="mb-8">
                 <h2 className="text-xl font-black text-slate-900">Order Frequency</h2>
                 <p className="text-sm text-slate-400 font-medium">Daily order counts</p>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.orderChart}>
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
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dx={-10} />
                    <Tooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#1e293b" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Met</p>
                    <p className="text-lg font-black text-slate-900">84.2%</p>
                 </div>
                 <Button variant="ghost" size="sm" className="text-primary font-bold group rounded-xl">
                    Full Report <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                 </Button>
              </div>
           </div>
        </div>

        {/* Bottom Section (Placeholder for Recent Orders) */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative group">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h2 className="text-3xl font-black">Ready to scale your store?</h2>
                 <p className="text-slate-400 mt-2 max-w-md font-medium">Use the inventory manager to add new products or update your pricing strategy in real-time.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/products')}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-primary hover:text-white transition-all flex items-center gap-2 group/btn shadow-xl shadow-white/5"
              >
                 Go to Inventory <ChevronRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
           </div>
           {/* Abstract Decorative blobs */}
           <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors" />
           <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

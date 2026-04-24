import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Trophy,
  DollarSign,
  ShoppingBag,
  Target
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
  Bar,
  Cell
} from 'recharts';
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Badge } from "../../components/ecommerce/ecommerce-ui/badge";

interface ReportData {
  summary: {
    total_revenue: number;
    total_orders: number;
    avg_order_value: number;
  };
  chartData: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  topProducts: {
    id: number;
    item_name: string;
    total_quantity: string | number;
    total_revenue: string | number;
  }[];
}

const AdminReports = () => {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const report = await adminApi.getReports(period);
      setData(report);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    // Create CSV content
    const headers = ["Date", "Revenue (ETB)", "Orders"];
    const rows = data.chartData.map(item => [
      item.date,
      item.revenue.toString(),
      item.orders.toString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lufi_sales_report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const periods = [
    { id: "day", label: "Today" },
    { id: "week", label: "Last 7 Days" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" },
  ];

  if (loading && !data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Reports</h1>
            <p className="text-slate-500 font-medium mt-1">Detailed performance analysis of your store's sales.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  period === p.id 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="p-3 bg-green-50 text-green-600 rounded-2xl w-fit mb-4">
                    <DollarSign className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">Total Revenue</p>
                 <h3 className="text-3xl font-black text-slate-900">ETB {Number(data?.summary.total_revenue).toLocaleString()}</h3>
                 <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>8.4% vs last period</span>
                 </div>
              </div>
              <TrendingUp className="absolute -right-6 -bottom-6 h-32 w-32 text-slate-50 opacity-50 group-hover:scale-110 transition-transform" />
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
                    <ShoppingBag className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">Total Orders</p>
                 <h3 className="text-3xl font-black text-slate-900">{data?.summary.total_orders}</h3>
                 <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>12.1% vs last period</span>
                 </div>
              </div>
              <Target className="absolute -right-6 -bottom-6 h-32 w-32 text-slate-50 opacity-50 group-hover:scale-110 transition-transform" />
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4">
                    <BarChart3 className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">Avg. Order Value</p>
                 <h3 className="text-3xl font-black text-slate-900">ETB {Number(data?.summary.avg_order_value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                 <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-red-500">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>2.3% vs last period</span>
                 </div>
              </div>
              <Calendar className="absolute -right-6 -bottom-6 h-32 w-32 text-slate-50 opacity-50 group-hover:scale-110 transition-transform" />
           </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-xl font-black text-slate-900">Revenue Stream</h2>
                    <p className="text-sm text-slate-400 font-medium italic">Sales performance over time</p>
                 </div>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-primary"
                    onClick={handleDownload}
                 >
                    <Download className="h-5 w-5" />
                 </Button>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d1a054" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#d1a054" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      dy={10}
                      tickFormatter={(str) => {
                         const d = new Date(str);
                         if (period === 'year') return d.toLocaleDateString('en-US', { month: 'short' });
                         return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      dx={-10}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                       labelStyle={{ fontWeight: 900, marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}
                       itemStyle={{ fontWeight: 900, fontSize: '14px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#d1a054" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-xl font-black text-slate-900">Order Volume</h2>
                    <p className="text-sm text-slate-400 font-medium italic">Quantity of orders processed</p>
                 </div>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-primary"
                    onClick={handleDownload}
                 >
                    <Download className="h-5 w-5" />
                 </Button>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      dy={10}
                      tickFormatter={(str) => {
                         const d = new Date(str);
                         if (period === 'year') return d.toLocaleDateString('en-US', { month: 'short' });
                         return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      dx={-10}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                       labelStyle={{ fontWeight: 900, marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}
                       itemStyle={{ fontWeight: 900, fontSize: '14px', color: '#3b82f6' }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#3b82f6" 
                      radius={[6, 6, 0, 0]} 
                      barSize={20}
                      animationDuration={2000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Top Products Leaderboard */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                 <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Trophy className="h-7 w-7 text-amber-500" />
                    Top Performing Products
                 </h2>
                 <p className="text-slate-400 font-medium italic">Based on total revenue generated in this period</p>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50/50">
                    <tr>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Rank</th>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Product Name</th>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-center">Quantity Sold</th>
                       <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-right">Revenue Generated</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {data?.topProducts.map((product, idx) => (
                       <tr key={product.id} className="group hover:bg-slate-50/30 transition-colors">
                          <td className="px-10 py-6">
                             <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${
                                idx === 0 ? "bg-amber-100 text-amber-700" : 
                                idx === 1 ? "bg-slate-200 text-slate-700" : 
                                idx === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                             }`}>
                                {idx + 1}
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <span className="font-black text-slate-900 group-hover:text-primary transition-colors">{product.item_name}</span>
                          </td>
                          <td className="px-10 py-6 text-center">
                             <Badge variant="outline" className="font-bold border-slate-200 bg-white">
                                {product.total_quantity} units
                             </Badge>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <span className="font-black text-slate-900">ETB {Number(product.total_revenue).toLocaleString()}</span>
                          </td>
                       </tr>
                    ))}
                    {data?.topProducts.length === 0 && (
                       <tr>
                          <td colSpan={4} className="px-10 py-20 text-center opacity-40">
                             <div className="flex flex-col items-center justify-center gap-2">
                                <BarChart3 className="h-10 w-10" />
                                <p className="font-bold italic">No data available for this period</p>
                             </div>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;

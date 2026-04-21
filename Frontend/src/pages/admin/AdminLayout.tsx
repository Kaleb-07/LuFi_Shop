import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  Store,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ecommerce/ecommerce-ui/avatar";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user || user.role !== 'admin') {
     // This is a safety fallback, route guarding should happen in App.jsx too
     return null;
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Products", icon: Package, path: "/admin/products" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/shop/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 overflow-hidden">
          <Link to="/admin" className="flex items-center gap-3">
             <div className="h-10 w-10 shrink-0 rounded-xl gold-gradient shadow-lg shadow-primary/20 flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
             </div>
             {sidebarOpen && (
               <motion.span 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="font-bold text-xl tracking-tight"
                >
                 LuFi <span className="text-primary">Admin</span>
               </motion.span>
             )}
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5 border border-primary/10" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "group-hover:scale-110 transition-transform"}`} />
                {sidebarOpen && <span>{item.name}</span>}
                {isActive && sidebarOpen && (
                   <motion.div layoutId="activePill" className="ml-auto">
                      <ChevronRight className="h-4 w-4" />
                   </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile / Logout at bottom */}
        <div className="p-4 border-t border-slate-100">
           {sidebarOpen && (
             <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white">
                   <AvatarImage src={user.avatar} />
                   <AvatarFallback className="gold-gradient text-white text-xs font-bold">
                     {user.name.slice(0, 2).toUpperCase()}
                   </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                   <p className="text-sm font-bold truncate">{user.name}</p>
                   <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Administrator</p>
                </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-6">
             <button 
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="p-2 ml-[-12px] hover:bg-slate-50 rounded-lg text-slate-500"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </button>
             <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Universal search..." 
                  className="bg-slate-50 border-transparent focus:ring-0 focus:border-primary/20 h-10 w-64 pl-10 pr-4 rounded-xl text-sm transition-all focus:bg-white focus:w-80" 
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="relative p-2 hover:bg-slate-50 rounded-xl text-slate-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 border-2 border-white rounded-full" />
             </button>
             <div className="h-8 w-px bg-slate-200 mx-2" />
             <Link to="/shop">
                <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50 gap-2">
                   <Store className="h-4 w-4" />
                   View Shop
                </Button>
             </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto pb-12">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

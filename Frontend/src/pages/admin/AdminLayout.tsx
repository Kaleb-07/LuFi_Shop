import { useState, ReactNode, useEffect } from "react";
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
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  AlertTriangle,
  UserPlus,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { adminApi } from "../../lib/adminApi";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ecommerce/ecommerce-ui/avatar";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "../../components/ecommerce/ecommerce-ui/popover";
import { Badge as UIBadge } from "../../components/ecommerce/ecommerce-ui/badge";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await adminApi.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="h-4 w-4 text-primary" />;
      case 'stock': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'user': return <UserPlus className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  if (!user || user.role !== 'admin') {
     // This is a safety fallback, route guarding should happen in App.jsx too
     return null;
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Products", icon: Package, path: "/admin/products" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
    { name: "Staff", icon: ShieldCheck, path: "/admin/staff" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
             <Popover>
                <PopoverTrigger asChild>
                   <button className="relative p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                      )}
                   </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 rounded-[2rem] border-slate-100 shadow-2xl overflow-hidden mr-4">
                   <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="font-black text-slate-900 flex items-center gap-2">
                         Notifications
                         <UIBadge className="bg-primary/10 text-primary border-none rounded-full px-2 py-0.5 text-[10px]">{notifications.length}</UIBadge>
                      </h3>
                      <button 
                        onClick={loadNotifications}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Refresh
                      </button>
                   </div>
                    <style>{`
                      .no-scrollbar::-webkit-scrollbar { display: none; }
                      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>
                    <div className={`${showAllNotifications ? "h-auto max-h-[60vh]" : "h-[350px]"} overflow-y-auto no-scrollbar`}>
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center space-y-2">
                           <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                              <Bell className="h-6 w-6 text-slate-200" />
                           </div>
                           <p className="text-xs font-bold text-slate-400">All caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                           {notifications.map((notif) => (
                             <Link 
                               key={notif.id} 
                               to={notif.link}
                               className="p-4 flex gap-4 hover:bg-slate-50/50 transition-colors group"
                             >
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                                   {getNotificationIcon(notif.type)}
                                </div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-xs font-black text-slate-900 leading-none mb-1">{notif.title}</p>
                                   <p className="text-[11px] text-slate-500 font-medium leading-tight mb-1">{notif.message}</p>
                                   <p className="text-[10px] text-slate-400 font-bold italic">{notif.time}</p>
                                </div>
                             </Link>
                           ))}
                        </div>
                      )}
                   </div>
                    <div className="p-3 bg-slate-50/50 border-t border-slate-50 text-center">
                       <button 
                         onClick={() => setShowAllNotifications(!showAllNotifications)}
                         className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                       >
                         {showAllNotifications ? "Show Less" : "View All Activity"}
                       </button>
                    </div>
                </PopoverContent>
             </Popover>
             <div className="h-8 w-px bg-slate-200 mx-2" />
             <Link to="/">
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

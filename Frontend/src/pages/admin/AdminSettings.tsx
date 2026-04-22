import { useState, useEffect } from "react";
import { 
  Settings, 
  Store, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Save,
  Loader2,
  ShieldCheck,
  Bell,
  Palette
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { adminApi } from "../../lib/adminApi";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { toast } from "react-hot-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    shop_name: "LuFi Shop",
    shop_email: "contact@lufishop.com",
    shop_phone: "+251 900 000 000",
    shop_address: "Addis Ababa, Ethiopia",
    currency: "ETB",
    tax_rate: "15",
    shipping_fee: "150"
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminApi.getSettings();
      if (Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success("Settings saved successfully");
    } catch (err) {
      console.error("Failed to save settings", err);
      toast.error("Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return (
        <AdminLayout>
           <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        </AdminLayout>
     );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900">Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your store general preferences and contact information.</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - General & Contact */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                            <Store className="h-5 w-5 text-primary" />
                            General Information
                        </h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Store Name</Label>
                                <Input 
                                    value={settings.shop_name}
                                    onChange={e => setSettings({ ...settings, shop_name: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Store Email</Label>
                                <Input 
                                    type="email"
                                    value={settings.shop_email}
                                    onChange={e => setSettings({ ...settings, shop_email: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Phone Number</Label>
                                <Input 
                                    value={settings.shop_phone}
                                    onChange={e => setSettings({ ...settings, shop_phone: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Address</Label>
                                <Input 
                                    value={settings.shop_address}
                                    onChange={e => setSettings({ ...settings, shop_address: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Financial Settings
                        </h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Currency</Label>
                                <Input 
                                    value={settings.currency}
                                    onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Tax Rate (%)</Label>
                                <Input 
                                    type="number"
                                    value={settings.tax_rate}
                                    onChange={e => setSettings({ ...settings, tax_rate: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Base Shipping Fee</Label>
                                <Input 
                                    type="number"
                                    value={settings.shipping_fee}
                                    onChange={e => setSettings({ ...settings, shipping_fee: e.target.value })}
                                    className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Preferences & Save */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">
                        <Save className="h-5 w-5 text-primary" />
                        Actions
                    </h3>
                    <Button 
                        type="submit"
                        disabled={submitting}
                        className="w-full gold-gradient text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Save All Changes
                    </Button>
                    <Button 
                        type="button"
                        variant="ghost"
                        className="w-full text-slate-400 font-bold h-12 rounded-2xl hover:bg-slate-50"
                    >
                        Discard Changes
                    </Button>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                        <h4 className="text-xl font-black mb-2">Advanced Security</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Ensure your shop remains secure by managing staff access roles and API keys.
                        </p>
                    </div>
                    <Globe className="absolute -right-8 -bottom-8 h-32 w-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="font-black text-slate-900 flex items-center gap-2 mb-4">
                        <Bell className="h-5 w-5 text-amber-500" />
                        Notifications
                    </h4>
                    <p className="text-slate-500 text-xs font-medium">
                        Configure how you receive alerts about new orders and customer registrations.
                    </p>
                    <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-[10px] text-amber-700 font-bold italic">Push notifications are currently disabled.</p>
                    </div>
                </div>
            </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

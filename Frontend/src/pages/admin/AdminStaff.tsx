import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  Star, 
  TrendingUp, 
  Calendar,
  MoreVertical,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  X,
  Loader2,
  ShieldAlert
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
  DialogDescription,
  DialogFooter
} from "../../components/ecommerce/ecommerce-ui/dialog";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ecommerce/ecommerce-ui/select";
import { toast } from "react-hot-toast";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  performance_score?: number; // Placeholder
  completed_tasks?: number; // Placeholder
}

const AdminStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStaff();
      setStaff(data);
    } catch (err) {
      console.error("Failed to load staff", err);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      setFormData({
        name: member.name,
        email: member.email,
        password: "",
        role: member.role
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "staff"
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStaff) {
        await adminApi.updateStaff(editingStaff.id, formData);
        toast.success("Staff member updated successfully");
      } else {
        await adminApi.createStaff(formData);
        toast.success("Staff member created successfully");
      }
      setModalOpen(false);
      loadStaff();
    } catch (err: any) {
      console.error("Failed to save staff", err);
      toast.error(err.response?.message || "Failed to save staff");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await adminApi.deleteStaff(id);
      setStaff(staff.filter(s => s.id !== id));
      toast.success("Staff member removed");
    } catch (err) {
      console.error("Failed to delete staff", err);
      toast.error("Failed to delete staff");
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Staff Management</h1>
            <p className="text-slate-500 font-medium mt-1">Monitor staff performance and manage access roles.</p>
          </div>
          <Button 
            onClick={() => handleOpenModal()}
            className="gold-gradient text-white font-bold rounded-2xl px-6 h-12 shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5" />
            Add Staff Member
          </Button>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic mb-1">Top Performer</p>
                   <h3 className="text-2xl font-black mb-4">Sarah Johnson</h3>
                   <div className="flex items-center gap-4">
                      <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                         <p className="text-[10px] font-bold text-slate-400">Monthly Tasks</p>
                         <p className="text-lg font-black">142</p>
                      </div>
                      <div className="bg-primary/20 px-4 py-2 rounded-xl backdrop-blur-md border border-primary/20">
                         <p className="text-[10px] font-bold text-primary">Efficiency</p>
                         <p className="text-lg font-black text-primary">98%</p>
                      </div>
                   </div>
                </div>
                <Star className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">+12%</Badge>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Completion Time</p>
                <p className="text-2xl font-black text-slate-900 mt-1">24.5 mins</p>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Staff</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{staff.length} Active</p>
            </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="relative group max-w-sm flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                 <Input 
                   placeholder="Search staff by name..." 
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
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Staff Member</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Role</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Performance</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Joined</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest italic text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                       [1,2,3].map(i => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan={5} className="px-6 py-8"><div className="h-8 bg-slate-100 rounded-xl" /></td>
                          </tr>
                       ))
                    ) : (
                      filteredStaff.map((member) => (
                        <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">
                                    {member.name.slice(0, 2).toUpperCase()}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{member.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{member.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <Badge className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${member.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                 {member.role}
                              </Badge>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary" 
                                      style={{ width: `${member.performance_score || 85}%` }} 
                                    />
                                 </div>
                                 <span className="text-xs font-black text-slate-700">{member.performance_score || 85}%</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                 <Calendar className="h-3 w-3" />
                                 {new Date(member.created_at).toLocaleDateString()}
                              </div>
                           </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    onClick={() => handleOpenModal(member)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="rounded-xl hover:bg-slate-50 group/edit"
                                    title="Edit Staff"
                                  >
                                     <Edit2 className="h-4 w-4 text-slate-400 group-hover/edit:text-primary transition-colors" />
                                  </Button>
                                  <Button 
                                    onClick={() => handleDelete(member.id)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="rounded-xl hover:bg-red-50 group/del"
                                    title="Delete Staff"
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
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
         <DialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col scrollbar-hide">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
               <DialogHeader className="gold-gradient p-8 text-white space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                     <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        {editingStaff ? <Edit2 className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                     </div>
                     <DialogTitle className="text-2xl font-black text-white">
                        {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
                     </DialogTitle>
                  </div>
                  <DialogDescription className="text-white/70 font-medium">
                     {editingStaff ? 'Update profile information and access role.' : 'Create a new staff account with specific permissions.'}
                  </DialogDescription>
               </DialogHeader>

               <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white scrollbar-hide">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Full Name</Label>
                     <Input 
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Email Address</Label>
                     <Input 
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">
                        {editingStaff ? 'New Password (Optional)' : 'Password'}
                     </Label>
                     <Input 
                        required={!editingStaff}
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1">Access Role</Label>
                     <Select 
                        value={formData.role} 
                        onValueChange={v => setFormData({ ...formData, role: v })}
                     >
                        <SelectTrigger className="h-12 bg-slate-50 border-transparent focus:bg-white rounded-xl font-bold">
                           <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                           <SelectItem value="staff" className="rounded-xl focus:bg-slate-50 font-bold">Staff Member</SelectItem>
                           <SelectItem value="admin" className="rounded-xl focus:bg-slate-50 font-bold">Administrator</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 sm:justify-end gap-3 shrink-0">
                  <Button 
                     type="button"
                     variant="ghost" 
                     onClick={() => setModalOpen(false)}
                     className="rounded-xl font-bold text-slate-500"
                  >
                     Cancel
                  </Button>
                  <Button 
                     type="submit"
                     disabled={submitting}
                     className="gold-gradient text-white font-bold rounded-xl px-8 h-11 min-w-[120px]"
                  >
                     {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        editingStaff ? 'Update Staff' : 'Create Staff'
                     )}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminStaff;

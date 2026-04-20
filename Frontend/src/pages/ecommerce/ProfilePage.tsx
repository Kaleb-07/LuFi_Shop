import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ecommerce/ecommerce-ui/button";
import { Input } from "../../components/ecommerce/ecommerce-ui/input";
import { Label } from "../../components/ecommerce/ecommerce-ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ecommerce/ecommerce-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ecommerce/ecommerce-ui/avatar";
import { Save, Lock, User, LogOut, Shield } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "../../components/ecommerce/Navbar";
import Footer from "../../components/ecommerce/Footer";

const ProfilePage = () => {
  const { user, updateProfile, updatePassword, logout, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t("profile.loading")}</p>
        </main>
      </div>
    );
  }

  if (!user) { navigate("/login"); return null; }

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile({ name, email }); toast({ title: t("profile.save") + "!" }); }
    catch { toast({ title: "Failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { toast({ title: "Min 8 characters", variant: "destructive" }); return; }
    if (newPassword !== confirmPassword) { toast({ title: "Passwords do not match", variant: "destructive" }); return; }
    setSavingPassword(true);
    try { await updatePassword(currentPassword, newPassword, confirmPassword); toast({ title: t("profile.updatePassword") + "!" }); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    catch { toast({ title: "Failed", variant: "destructive" }); }
    finally { setSavingPassword(false); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container max-w-2xl flex-1 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="gold-gradient text-primary-foreground text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">{t("profile.title")}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><User className="h-4 w-4 text-primary" /></div>
                {t("profile.personalInfo")}
              </CardTitle>
              <CardDescription>{t("profile.personalInfoDesc")}</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSave}>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="profile-name">{t("profile.name")}</Label><Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required /></div>
                <div className="space-y-2"><Label htmlFor="profile-email">{t("profile.email")}</Label><Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required /></div>
                <Button type="submit" disabled={saving} className="gold-gradient text-primary-foreground font-semibold hover:opacity-90">
                  <Save className="mr-2 h-4 w-4" /> {saving ? t("profile.saving") : t("profile.save")}
                </Button>
              </CardContent>
            </form>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Shield className="h-4 w-4 text-primary" /></div>
                {t("profile.changePassword")}
              </CardTitle>
              <CardDescription>{t("profile.changePasswordDesc")}</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSave}>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="current-password">{t("profile.currentPassword")}</Label><Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required maxLength={128} /></div>
                <div className="space-y-2"><Label htmlFor="new-password">{t("profile.newPassword")}</Label><Input id="new-password" type="password" placeholder="Min 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required maxLength={128} /></div>
                <div className="space-y-2"><Label htmlFor="confirm-new-password">{t("profile.confirmNewPassword")}</Label><Input id="confirm-new-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required maxLength={128} /></div>
                <Button type="submit" disabled={savingPassword} variant="outline" className="border-primary/30 hover:bg-primary/10">
                  <Lock className="mr-2 h-4 w-4" /> {savingPassword ? t("profile.updatingPassword") : t("profile.updatePassword")}
                </Button>
              </CardContent>
            </form>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-destructive/20">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <p className="font-semibold text-foreground">{t("profile.signOut")}</p>
                <p className="text-sm text-muted-foreground">{t("profile.signOutDesc")}</p>
              </div>
              <Button variant="destructive" onClick={async () => { await logout(); navigate("/"); }} className="font-semibold">
                <LogOut className="mr-2 h-4 w-4" /> {t("profile.signOut")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

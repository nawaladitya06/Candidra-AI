"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Trash2, Edit2, ShieldAlert, Search, RefreshCw, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export default function AdminBillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]); // For adding new subscriptions
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);

  // Form states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [plan, setPlan] = useState("pro");
  const [subStatus, setSubStatus] = useState("active");
  const [daysValid, setDaysValid] = useState("30");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billingRes, usersRes] = await Promise.all([
        fetch("/api/admin/billing"),
        fetch("/api/admin/users")
      ]);
      const billingData = await billingRes.json();
      const usersData = await usersRes.json();
      
      if (billingData.subscriptions) setSubscriptions(billingData.subscriptions);
      if (usersData.users) setUsers(usersData.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && ADMIN_EMAILS.includes(session?.user?.email || "")) {
      fetchData();
    }
  }, [status, session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription? The user's plan will be reset to FREE.")) return;
    try {
      const res = await fetch(`/api/admin/billing?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Subscription deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete subscription");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSub.id,
          plan: editingSub.plan,
          status: editingSub.status,
          currentPeriodEnd: editingSub.currentPeriodEnd
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Subscription updated");
      setEditingSub(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update subscription");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }
    
    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          plan,
          status: subStatus,
          daysValid
        }),
      });
      if (!res.ok) throw new Error("Add failed");
      toast.success("Subscription added");
      setIsAddModalOpen(false);
      setSelectedUserId("");
      fetchData();
    } catch (err) {
      toast.error("Failed to add subscription");
    }
  };

  if (status === "loading" || (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const filteredSubs = subscriptions.filter(s => 
    s.userName?.toLowerCase().includes(search.toLowerCase()) || 
    s.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    s.plan?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white font-mono selection:bg-primary/30">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white brutal-heading flex items-center gap-4">
              <CreditCard className="w-10 h-10 text-primary" />
              Billing <span className="text-primary">Management</span>
            </h1>
            <p className="text-slate-400 mt-2 tracking-tight">Admin access only. Manually manage user subscriptions and plans.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-white text-black border-2 border-primary px-4 py-2 uppercase tracking-widest text-xs font-black brutal-shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Subscription
            </button>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/20 px-4 py-2 uppercase tracking-widest text-xs font-bold brutal-shadow-sm transition-all"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="SEARCH BY NAME OR EMAIL..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black border-4 border-white/20 pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary transition-colors brutal-shadow-sm font-bold placeholder:text-slate-600"
          />
        </div>

        {/* SUBSCRIPTIONS TABLE */}
        <div className="border-4 border-white/20 bg-black overflow-hidden brutal-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-white/20 bg-white/5">
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">User</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">Plan</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">Status</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">Expires</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">Loading subscriptions...</td>
                  </tr>
                ) : filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest">No subscriptions found</td>
                  </tr>
                ) : (
                  filteredSubs.map((sub) => {
                    const isExpired = sub.currentPeriodEnd && sub.currentPeriodEnd < Date.now();
                    return (
                      <tr key={sub.id} className="border-b-2 border-white/10 hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold">{sub.userName || "Unknown"}</div>
                          <div className="text-xs text-slate-400">{sub.userEmail || "No Email"}</div>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-1 text-xs font-black uppercase tracking-widest border-2",
                            sub.plan === "enterprise" ? "border-purple-500 text-purple-500 bg-purple-500/10" :
                            sub.plan === "pro" ? "border-primary text-primary bg-primary/10" : 
                            "border-slate-500 text-slate-300 bg-slate-800"
                          )}>
                            {sub.plan}
                          </span>
                        </td>
                        <td className="p-4">
                           <span className={cn(
                            "px-2 py-1 text-xs font-black uppercase tracking-widest border-2",
                            sub.status === "active" ? "border-green-500 text-green-500" :
                            sub.status === "canceled" ? "border-red-500 text-red-500" : 
                            "border-yellow-500 text-yellow-500"
                          )}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {sub.currentPeriodEnd ? (
                            <span className={cn("font-bold", isExpired && "text-red-500")}>
                               {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-slate-500">Forever</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setEditingSub(sub)}
                              className="p-2 border-2 border-white/20 hover:border-primary hover:text-primary transition-colors brutal-shadow-sm"
                              title="Edit Subscription"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(sub.id)}
                              className="p-2 border-2 border-white/20 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors brutal-shadow-sm"
                              title="Delete Subscription"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD MODAL */}
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-black border-4 border-primary p-8 max-w-md w-full brutal-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Add Subscription</h2>
                </div>
                
                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Select User</label>
                    <select 
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                      required
                    >
                      <option value="">-- Select a User --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Plan</label>
                    <select 
                      value={plan}
                      onChange={e => setPlan(e.target.value)}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO</option>
                      <option value="enterprise">ENTERPRISE</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Status</label>
                    <select 
                      value={subStatus}
                      onChange={e => setSubStatus(e.target.value)}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="active">ACTIVE</option>
                      <option value="past_due">PAST DUE</option>
                      <option value="canceled">CANCELED</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Valid For (Days)</label>
                    <input 
                      type="number" 
                      value={daysValid}
                      onChange={e => setDaysValid(e.target.value)}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. 30"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-3 border-2 border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 border-2 border-primary bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors brutal-shadow-sm flex items-center justify-center gap-2"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {editingSub && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-black border-4 border-primary p-8 max-w-md w-full brutal-shadow"
              >
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Edit Billing</h2>
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">User</label>
                    <div className="p-3 border-2 border-white/10 bg-white/5 text-slate-300">
                      {editingSub.userName} ({editingSub.userEmail})
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Plan</label>
                    <select 
                      value={editingSub.plan || "free"}
                      onChange={e => setEditingSub({...editingSub, plan: e.target.value})}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO</option>
                      <option value="enterprise">ENTERPRISE</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Status</label>
                    <select 
                      value={editingSub.status || "active"}
                      onChange={e => setEditingSub({...editingSub, status: e.target.value})}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="active">ACTIVE</option>
                      <option value="past_due">PAST DUE</option>
                      <option value="canceled">CANCELED</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setEditingSub(null)}
                      className="flex-1 py-3 border-2 border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 border-2 border-primary bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors brutal-shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Trash2, Edit2, ShieldAlert, Search, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && ADMIN_EMAILS.includes(session?.user?.email || "")) {
      fetchUsers();
    }
  }, [status, session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingUser.id,
          name: editingUser.name,
          plan: editingUser.plan,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("User updated");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
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

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white font-mono selection:bg-primary/30">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white brutal-heading flex items-center gap-4">
              <Users className="w-10 h-10 text-primary" />
              User <span className="text-primary">Management</span>
            </h1>
            <p className="text-slate-400 mt-2 tracking-tight">Admin access only. Manage all users on the platform.</p>
          </div>
          
          <button 
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/20 px-4 py-2 uppercase tracking-widest text-xs font-bold brutal-shadow-sm transition-all"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh Data
          </button>
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

        {/* USERS TABLE */}
        <div className="border-4 border-white/20 bg-black overflow-hidden brutal-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-white/20 bg-white/5">
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">Name</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">Email</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary">Plan</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary text-center">Interviews</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-primary text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b-2 border-white/10 hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-bold">{user.name || "Unknown"}</td>
                      <td className="p-4 text-slate-300">{user.email}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 text-xs font-black uppercase tracking-widest border-2",
                          user.plan === "pro" ? "border-primary text-primary bg-primary/10" : "border-slate-500 text-slate-300 bg-slate-800"
                        )}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-xl">{user.interviewsCompleted || 0}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingUser(user)}
                            className="p-2 border-2 border-white/20 hover:border-primary hover:text-primary transition-colors brutal-shadow-sm"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 border-2 border-white/20 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors brutal-shadow-sm"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {editingUser && (
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
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Edit User</h2>
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Name</label>
                    <input 
                      type="text" 
                      value={editingUser.name || ""}
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary">Plan</label>
                    <select 
                      value={editingUser.plan || "free"}
                      onChange={e => setEditingUser({...editingUser, plan: e.target.value})}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO</option>
                      <option value="enterprise">ENTERPRISE</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setEditingUser(null)}
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

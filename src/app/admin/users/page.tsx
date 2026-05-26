"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Users, Trash2, Edit2, ShieldAlert, Search, RefreshCw,
  Loader2, Crown, User, ChevronDown,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

type Plan = "all" | "free" | "pro" | "enterprise";

const PLAN_TABS: { key: Plan; label: string }[] = [
  { key: "all",        label: "All"        },
  { key: "free",       label: "Free"       },
  { key: "pro",        label: "Pro"        },
  { key: "enterprise", label: "Enterprise" },
];

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    enterprise: "border-purple-500/50 text-purple-400 bg-purple-500/10",
    pro:        "border-blue-500/50   text-blue-400   bg-blue-500/10",
    free:       "border-white/10      text-slate-500  bg-white/5",
  };
  const icons: Record<string, React.ReactNode> = {
    enterprise: <span>⚡</span>,
    pro:        <Crown className="w-2.5 h-2.5" />,
    free:       <User  className="w-2.5 h-2.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border font-mono ${styles[plan] ?? styles.free}`}>
      {icons[plan] ?? null}
      {plan}
    </span>
  );
}

/** Deterministic color from a string */
function avatarColor(seed: string) {
  const colors = [
    "bg-blue-500/20   text-blue-400   border-blue-500/30",
    "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "bg-pink-500/20   text-pink-400   border-pink-500/30",
  ];
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<Plan>("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))
    ) {
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
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("User deleted");
      setUsers(u => u.filter(x => x.id !== id));
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingUser.id, name: editingUser.name, plan: editingUser.plan }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("User updated");
      setUsers(u => u.map(x => x.id === editingUser.id ? { ...x, ...editingUser } : x));
      setEditingUser(null);
    } catch {
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesPlan = planFilter === "all" || u.plan === planFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return matchesPlan && matchesSearch;
    });
  }, [users, search, planFilter]);

  const counts = useMemo(() => ({
    all:        users.length,
    free:       users.filter(u => u.plan === "free").length,
    pro:        users.filter(u => u.plan === "pro").length,
    enterprise: users.filter(u => u.plan === "enterprise").length,
  }), [users]);

  if (
    status === "loading" ||
    (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))
  ) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6 bg-black min-h-screen text-white font-mono">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
              <Users className="w-9 h-9 text-primary" />
              User <span className="text-primary">Management</span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm tracking-tight">
              {users.length} registered accounts · Admin access only
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-primary/50 px-4 py-2 uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-40"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {/* ── Summary Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",  val: counts.all,        color: "border-white/20 text-white" },
            { label: "Free",   val: counts.free,        color: "border-slate-600  text-slate-400" },
            { label: "Pro",    val: counts.pro,         color: "border-blue-500/40 text-blue-400" },
            { label: "Enterprise", val: counts.enterprise, color: "border-purple-500/40 text-purple-400" },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={cn("p-4 border-2 bg-black brutal-shadow-sm text-center cursor-pointer hover:-translate-y-0.5 transition-transform", c.color)}
              onClick={() => setPlanFilter(c.label.toLowerCase() as Plan)}
            >
              <p className={cn("text-3xl font-black font-mono", c.color.split(" ")[1])}>{c.val}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="SEARCH BY NAME OR EMAIL..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black border-2 border-white/20 pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-slate-600"
            />
          </div>

          {/* Plan filter tabs */}
          <div className="flex border-2 border-white/20">
            {PLAN_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setPlanFilter(t.key)}
                className={cn(
                  "px-4 py-2 text-xs font-black uppercase tracking-widest font-mono transition-colors border-r border-white/10 last:border-r-0",
                  planFilter === t.key
                    ? "bg-primary text-black"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {t.label}
                <span className="ml-1.5 text-[9px] opacity-60">
                  ({t.key === "all" ? counts.all : counts[t.key]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────────────────────── */}
        <div className="border-4 border-white/20 bg-black brutal-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-white/20 bg-white/[0.03]">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">User</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">Email</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">Plan</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary text-center">Interviews</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary text-center">Runs</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
                      <p className="text-slate-500 text-xs uppercase tracking-widest">Loading users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-xs uppercase tracking-widest">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, i) => {
                    const initials = ((user.name || user.email || "?")[0]).toUpperCase();
                    const ac = avatarColor(user.email || user.id);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 border flex items-center justify-center text-xs font-black font-mono flex-shrink-0", ac)}>
                              {initials}
                            </div>
                            <span className="font-bold text-sm truncate max-w-[120px]">{user.name || "—"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 text-xs">{user.email}</td>
                        <td className="p-4"><PlanBadge plan={user.plan || "free"} /></td>
                        <td className="p-4 text-center">
                          <span className="font-black text-lg font-mono">{user.interviewsCompleted ?? 0}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-black text-lg font-mono text-slate-400">{user.codingRuns ?? 0}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 border border-white/20 hover:border-primary hover:text-primary transition-colors"
                              title="Edit User"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deleting === user.id}
                              className="p-2 border border-white/20 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                              title="Delete User"
                            >
                              {deleting === user.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />
                              }
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-3 border-t border-white/10 bg-white/[0.01] flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>
          )}
        </div>

      </div>

      {/* ── Edit Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setEditingUser(null); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="bg-black border-4 border-primary p-8 max-w-md w-full"
              style={{ boxShadow: "8px 8px 0 0 rgba(59,130,246,0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Edit User</h2>
              </div>

              {/* Current user info */}
              <div className="p-3 border border-white/10 bg-white/[0.02] mb-6 flex items-center gap-3">
                <div className={cn("w-8 h-8 border flex items-center justify-center text-xs font-black font-mono", avatarColor(editingUser.email || editingUser.id))}>
                  {((editingUser.name || editingUser.email || "?")[0]).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{editingUser.name || "—"}</p>
                  <p className="text-[10px] text-slate-500">{editingUser.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Display Name</label>
                  <input
                    type="text"
                    value={editingUser.name || ""}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Plan</label>
                  <div className="relative">
                    <select
                      value={editingUser.plan || "free"}
                      onChange={e => setEditingUser({ ...editingUser, plan: e.target.value })}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none font-mono pr-10"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-3 border-2 border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm transition-colors font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 border-2 border-primary bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors font-mono flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

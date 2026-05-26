"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  CreditCard, Trash2, Edit2, ShieldAlert, Search, RefreshCw,
  Loader2, Plus, Crown, CheckCircle2, XCircle, Clock, ChevronDown,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

type StatusFilter = "all" | "active" | "canceled" | "past_due";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function PlanBadge({ plan }: { plan: string }) {
  const s: Record<string, string> = {
    enterprise: "border-purple-500/50 text-purple-400 bg-purple-500/10",
    pro:        "border-blue-500/50   text-blue-400   bg-blue-500/10",
    free:       "border-white/10      text-slate-500  bg-white/5",
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border font-mono ${s[plan] ?? s.free}`}>
      {plan === "pro" ? "★ " : plan === "enterprise" ? "⚡ " : ""}{plan}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    active:   { cls: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10", icon: <CheckCircle2 className="w-3 h-3" />, label: "Active"   },
    canceled: { cls: "border-red-500/50     text-red-400     bg-red-500/10",     icon: <XCircle      className="w-3 h-3" />, label: "Canceled" },
    past_due: { cls: "border-amber-500/50   text-amber-400   bg-amber-500/10",   icon: <Clock        className="w-3 h-3" />, label: "Past Due" },
  };
  const c = cfg[status] ?? cfg.canceled;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border font-mono ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  );
}

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "active",   label: "Active"   },
  { key: "past_due", label: "Past Due" },
  { key: "canceled", label: "Canceled" },
];

export default function AdminBillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);

  // Add form
  const [selectedUserId, setSelectedUserId] = useState("");
  const [plan, setPlan] = useState("pro");
  const [subStatus, setSubStatus] = useState("active");
  const [daysValid, setDaysValid] = useState("30");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [billingRes, usersRes] = await Promise.all([
        fetch("/api/admin/billing"),
        fetch("/api/admin/users"),
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
    if (!confirm("Delete this subscription? The user's plan will be reset to FREE.")) return;
    try {
      const res = await fetch(`/api/admin/billing?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Subscription deleted");
      setSubscriptions(s => s.filter(x => x.id !== id));
    } catch {
      toast.error("Failed to delete subscription");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSub.id,
          plan: editingSub.plan,
          status: editingSub.status,
          currentPeriodEnd: editingSub.currentPeriodEnd,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Subscription updated");
      setEditingSub(null);
      fetchData();
    } catch {
      toast.error("Failed to update subscription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) { toast.error("Please select a user"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserId, plan, status: subStatus, daysValid }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Add failed");
      }
      toast.success("Subscription created!");
      setIsAddModalOpen(false);
      setSelectedUserId(""); setPlan("pro"); setSubStatus("active"); setDaysValid("30");
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add subscription");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubs = useMemo(() => {
    return subscriptions.filter(s => {
      const q = search.toLowerCase();
      const matchesSearch = !q || s.userName?.toLowerCase().includes(q) || s.userEmail?.toLowerCase().includes(q) || s.plan?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const counts = useMemo(() => ({
    all:      subscriptions.length,
    active:   subscriptions.filter(s => s.status === "active").length,
    past_due: subscriptions.filter(s => s.status === "past_due").length,
    canceled: subscriptions.filter(s => s.status === "canceled").length,
  }), [subscriptions]);

  const revenue = useMemo(() => {
    const plans: Record<string, number> = { pro: 29, enterprise: 99 };
    return subscriptions
      .filter(s => s.status === "active")
      .reduce((sum, s) => sum + (plans[s.plan] ?? 0), 0);
  }, [subscriptions]);

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
              <CreditCard className="w-9 h-9 text-primary" />
              Billing <span className="text-primary">Management</span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm tracking-tight">
              {subscriptions.length} subscriptions · {counts.active} active
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-blue-400 text-black border-2 border-primary px-4 py-2 uppercase tracking-widest text-xs font-black transition-all"
            >
              <Plus className="w-4 h-4" />
              New Subscription
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-primary/50 px-4 py-2 uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-40"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Summary Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Subs",    val: counts.all,             color: "border-white/20   text-white"       },
            { label: "Active",        val: counts.active,          color: "border-emerald-500/40 text-emerald-400" },
            { label: "Past Due",      val: counts.past_due,        color: "border-amber-500/40 text-amber-400"  },
            { label: "Est. MRR",      val: `$${revenue}`,          color: "border-blue-500/40 text-blue-400"    },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={cn("p-4 border-2 bg-black brutal-shadow-sm text-center hover:-translate-y-0.5 transition-transform", c.color)}
            >
              <p className={cn("text-3xl font-black font-mono", c.color.split(" ")[1])}>{c.val}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="SEARCH BY NAME, EMAIL OR PLAN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black border-2 border-white/20 pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-slate-600"
            />
          </div>

          <div className="flex border-2 border-white/20">
            {STATUS_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={cn(
                  "px-4 py-2 text-xs font-black uppercase tracking-widest font-mono transition-colors border-r border-white/10 last:border-r-0",
                  statusFilter === t.key
                    ? "bg-primary text-black"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {t.label}
                <span className="ml-1.5 text-[9px] opacity-60">
                  ({t.key === "all" ? counts.all : counts[t.key] ?? 0})
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
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">Plan</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">Expires</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
                      <p className="text-slate-500 text-xs uppercase tracking-widest">Loading subscriptions...</p>
                    </td>
                  </tr>
                ) : filteredSubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <CreditCard className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-xs uppercase tracking-widest">No subscriptions found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubs.map((sub, i) => {
                    const isExpired = sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() < Date.now();
                    return (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-black text-primary font-mono flex-shrink-0">
                              {((sub.userName || sub.userEmail || "?")[0]).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{sub.userName || "Unknown"}</p>
                              <p className="text-[10px] text-slate-500">{sub.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><PlanBadge plan={sub.plan} /></td>
                        <td className="p-4"><StatusBadge status={sub.status} /></td>
                        <td className="p-4">
                          {sub.currentPeriodEnd ? (
                            <span className={cn("text-sm font-bold font-mono", isExpired ? "text-red-500" : "text-slate-300")}>
                              {isExpired && "⚠ "}{new Date(sub.currentPeriodEnd).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-sm">∞ Forever</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingSub(sub)}
                              className="p-2 border border-white/20 hover:border-primary hover:text-primary transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="p-2 border border-white/20 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
          {filteredSubs.length > 0 && (
            <div className="px-6 py-3 border-t border-white/10 bg-white/[0.01]">
              <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                Showing {filteredSubs.length} of {subscriptions.length} subscriptions
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Modal ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="bg-black border-4 border-primary p-8 max-w-md w-full"
              style={{ boxShadow: "8px 8px 0 0 rgba(59,130,246,0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Add Subscription</h2>
              </div>

              <form onSubmit={handleAdd} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Select User</label>
                  <div className="relative">
                    <select
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none font-mono pr-10"
                      required
                    >
                      <option value="">-- Select a User --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Plan</label>
                    <div className="relative">
                      <select
                        value={plan}
                        onChange={e => setPlan(e.target.value)}
                        className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none font-mono pr-8"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Status</label>
                    <div className="relative">
                      <select
                        value={subStatus}
                        onChange={e => setSubStatus(e.target.value)}
                        className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none font-mono pr-8"
                      >
                        <option value="active">Active</option>
                        <option value="past_due">Past Due</option>
                        <option value="canceled">Canceled</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Valid For (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={daysValid}
                    onChange={e => setDaysValid(e.target.value)}
                    className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                    placeholder="e.g. 30  (0 = no expiry)"
                  />
                  <p className="text-[9px] text-slate-600 font-mono">Set 0 for a subscription that never expires</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 border-2 border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm transition-colors font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 border-2 border-primary bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors font-mono flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingSub && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setEditingSub(null); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="bg-black border-4 border-primary p-8 max-w-md w-full"
              style={{ boxShadow: "8px 8px 0 0 rgba(59,130,246,0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-7 h-7 text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Edit Subscription</h2>
              </div>

              {/* User info pill */}
              <div className="p-3 border border-white/10 bg-white/[0.02] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-black text-primary font-mono">
                  {((editingSub.userName || editingSub.userEmail || "?")[0]).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold">{editingSub.userName || "—"}</p>
                  <p className="text-[10px] text-slate-500">{editingSub.userEmail}</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Plan</label>
                    <div className="relative">
                      <select
                        value={editingSub.plan || "free"}
                        onChange={e => setEditingSub({ ...editingSub, plan: e.target.value })}
                        className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none font-mono pr-8"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Status</label>
                    <div className="relative">
                      <select
                        value={editingSub.status || "active"}
                        onChange={e => setEditingSub({ ...editingSub, status: e.target.value })}
                        className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none font-mono pr-8"
                      >
                        <option value="active">Active</option>
                        <option value="past_due">Past Due</option>
                        <option value="canceled">Canceled</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary">Expiry Date</label>
                  <input
                    type="date"
                    value={editingSub.currentPeriodEnd
                      ? new Date(editingSub.currentPeriodEnd).toISOString().split("T")[0]
                      : ""}
                    onChange={e => setEditingSub({ ...editingSub, currentPeriodEnd: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingSub(null)}
                    className="flex-1 py-3 border-2 border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm transition-colors font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 border-2 border-primary bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors font-mono flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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

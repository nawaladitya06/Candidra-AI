"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Mail, MessageSquare, Send, CheckCircle2, Circle, Clock,
  Loader2, ChevronDown, ChevronUp, RefreshCw, Inbox, Reply,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

type StatusFilter = "all" | "unread" | "read" | "replied";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function StatusPill({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string; icon: React.ReactNode }> = {
    unread:  { cls: "border-blue-500/50  text-blue-400  bg-blue-500/10",   label: "Unread",  icon: <Circle       className="w-2.5 h-2.5 fill-blue-400" /> },
    read:    { cls: "border-white/20     text-slate-400 bg-white/5",        label: "Read",    icon: <Circle       className="w-2.5 h-2.5" /> },
    replied: { cls: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10", label: "Replied", icon: <CheckCircle2 className="w-2.5 h-2.5" /> },
  };
  const c = cfg[status] ?? cfg.read;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border font-mono", c.cls)}>
      {c.icon}{c.label}
    </span>
  );
}

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all",     label: "All"     },
  { key: "unread",  label: "Unread"  },
  { key: "read",    label: "Read"    },
  { key: "replied", label: "Replied" },
];

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && ADMIN_EMAILS.includes(session?.user?.email || "")) {
      fetchContacts();
    }
  }, [status, session]);

  const handleMarkAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus !== "unread") return;
    try {
      await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });
      setContacts(cs => cs.map(c => c.id === id ? { ...c, status: "read" } : c));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const toggleExpand = (id: string, currentStatus: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      handleMarkAsRead(id, currentStatus);
    }
  };

  const handleReply = async (id: string) => {
    const text = replyTexts[id]?.trim();
    if (!text) { toast.error("Please enter a reply"); return; }
    setReplyingId(id);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminReply: text }),
      });
      if (!res.ok) throw new Error("Reply failed");
      toast.success("Reply saved!");
      setReplyTexts(rt => ({ ...rt, [id]: "" }));
      fetchContacts();
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setReplyingId(null);
    }
  };

  const counts = useMemo(() => ({
    all:     contacts.length,
    unread:  contacts.filter(c => c.status === "unread").length,
    read:    contacts.filter(c => c.status === "read").length,
    replied: contacts.filter(c => c.status === "replied").length,
  }), [contacts]);

  const filtered = useMemo(() =>
    statusFilter === "all" ? contacts : contacts.filter(c => c.status === statusFilter),
    [contacts, statusFilter]
  );

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
              <Mail className="w-9 h-9 text-primary" />
              Contact <span className="text-primary">Inbox</span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm tracking-tight">
              {counts.all} messages ·{" "}
              {counts.unread > 0
                ? <span className="text-blue-400 font-bold">{counts.unread} unread</span>
                : "all read"}
            </p>
          </div>
          <button
            onClick={fetchContacts}
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
            { label: "Total",   val: counts.all,     color: "border-white/20        text-white",         key: "all"     },
            { label: "Unread",  val: counts.unread,  color: "border-blue-500/40     text-blue-400",      key: "unread"  },
            { label: "Read",    val: counts.read,    color: "border-white/20        text-slate-400",     key: "read"    },
            { label: "Replied", val: counts.replied, color: "border-emerald-500/40  text-emerald-400",   key: "replied" },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => setStatusFilter(c.key as StatusFilter)}
              className={cn(
                "p-4 border-2 bg-black brutal-shadow-sm text-center cursor-pointer hover:-translate-y-0.5 transition-transform",
                c.color,
                statusFilter === c.key && "ring-1 ring-primary/50"
              )}
            >
              <p className={cn("text-3xl font-black font-mono", c.color.split(" ")[1])}>{c.val}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Status Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex border-2 border-white/20 w-fit">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                "px-4 py-2.5 text-xs font-black uppercase tracking-widest font-mono transition-colors border-r border-white/10 last:border-r-0",
                statusFilter === t.key
                  ? "bg-primary text-black"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {t.label}
              {counts[t.key] > 0 && t.key !== "all" && (
                <span className={cn(
                  "ml-1.5 text-[9px] px-1.5 py-0.5 font-black",
                  statusFilter === t.key ? "bg-black/20 text-black" : "bg-white/10 text-slate-400"
                )}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Inbox List ──────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {loading && contacts.length === 0 ? (
            <div className="p-16 text-center border-4 border-white/20 brutal-shadow">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-slate-500 text-xs uppercase tracking-widest">Loading messages...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center border-4 border-white/20 brutal-shadow flex flex-col items-center">
              <Inbox className="w-12 h-12 mb-4 text-slate-700" />
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                {statusFilter === "all" ? "Inbox is empty" : `No ${statusFilter} messages`}
              </p>
            </div>
          ) : (
            filtered.map((contact, idx) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  "border-4 brutal-shadow transition-colors",
                  contact.status === "unread"
                    ? "border-blue-500/60 bg-blue-500/[0.03]"
                    : contact.status === "replied"
                    ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                    : "border-white/15 bg-black"
                )}
              >
                {/* ── Row Header ── */}
                <div
                  onClick={() => toggleExpand(contact.id, contact.status)}
                  className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors select-none"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={cn(
                      "w-10 h-10 border-2 flex items-center justify-center text-sm font-black font-mono flex-shrink-0 mt-0.5",
                      contact.status === "unread"  ? "border-blue-500/50  bg-blue-500/10  text-blue-400"   :
                      contact.status === "replied" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" :
                                                     "border-white/15      bg-white/5      text-slate-400"
                    )}>
                      {contact.name?.[0]?.toUpperCase() ?? "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={cn("font-bold text-sm", contact.status === "unread" ? "text-white" : "text-slate-300")}>
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-slate-600">{contact.email}</span>
                        <StatusPill status={contact.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate leading-relaxed">
                        {contact.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(contact.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="text-slate-500">
                      {expandedId === contact.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* ── Expanded Body ── */}
                <AnimatePresence>
                  {expandedId === contact.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t-2 border-white/10"
                    >
                      <div className="p-6 md:p-8 space-y-6 bg-black/40">

                        {/* Original message */}
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Original Message
                          </p>
                          <div className="p-4 border-l-4 border-white/20 bg-white/[0.02]">
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                              {contact.message}
                            </p>
                          </div>
                        </div>

                        {/* Reply section */}
                        {contact.status === "replied" ? (
                          <div className="p-5 border-2 border-emerald-500/30 bg-emerald-500/5">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Your Reply
                              </p>
                              <span className="text-[9px] text-slate-600 font-mono">
                                {new Date(contact.repliedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-white leading-relaxed whitespace-pre-wrap text-sm font-medium">
                              {contact.adminReply}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                              <Reply className="w-3.5 h-3.5" />
                              Write a Reply
                            </p>
                            <textarea
                              value={replyTexts[contact.id] ?? ""}
                              onChange={e => setReplyTexts(rt => ({ ...rt, [contact.id]: e.target.value }))}
                              placeholder="Type your reply here..."
                              rows={4}
                              className="w-full bg-black border-2 border-white/20 p-4 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none font-mono placeholder:text-slate-600"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleReply(contact.id)}
                                disabled={replyingId === contact.id || !(replyTexts[contact.id]?.trim())}
                                className="px-6 py-2.5 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
                              >
                                {replyingId === contact.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Send className="w-3.5 h-3.5" />
                                }
                                {replyingId === contact.id ? "Saving..." : "Send Reply"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-[10px] text-slate-700 font-mono uppercase tracking-widest text-center">
            {filtered.length} message{filtered.length !== 1 ? "s" : ""} shown
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

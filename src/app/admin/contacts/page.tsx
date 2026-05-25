"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Mail, MessageSquare, Send, CheckCircle2, Circle, Clock, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !ADMIN_EMAILS.includes(session?.user?.email || ""))) {
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
      setContacts(contacts.map(c => c.id === id ? { ...c, status: "read" } : c));
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
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    
    setReplyingId(id);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminReply: replyText }),
      });
      
      if (!res.ok) throw new Error("Reply failed");
      
      toast.success("Reply saved successfully");
      setReplyText("");
      fetchContacts(); // Refresh to get the new status and timestamp
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setReplyingId(null);
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

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white font-mono selection:bg-primary/30">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white brutal-heading flex items-center gap-4">
              <Mail className="w-10 h-10 text-primary" />
              Contact <span className="text-primary">Inbox</span>
            </h1>
            <p className="text-slate-400 mt-2 tracking-tight">Admin access only. Manage and reply to user inquiries.</p>
          </div>
        </div>

        {/* INBOX LIST */}
        <div className="space-y-4">
          {loading && contacts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border-4 border-white/20 bg-black brutal-shadow font-bold uppercase tracking-widest">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-primary" />
              Loading messages...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border-4 border-white/20 bg-black brutal-shadow font-bold uppercase tracking-widest flex flex-col items-center">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              Inbox is empty
            </div>
          ) : (
            contacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`border-4 brutal-shadow transition-colors ${
                  contact.status === 'unread' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-white/20 bg-black'
                }`}
              >
                {/* INBOX ITEM HEADER */}
                <div 
                  onClick={() => toggleExpand(contact.id, contact.status)}
                  className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {contact.status === 'unread' && <Circle className="w-4 h-4 fill-primary text-primary" />}
                    {contact.status === 'read' && <Circle className="w-4 h-4 text-slate-500" />}
                    {contact.status === 'replied' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    
                    <div>
                      <h3 className={`font-bold ${contact.status === 'unread' ? 'text-white' : 'text-slate-300'}`}>
                        {contact.name} <span className="text-slate-500 font-normal">({contact.email})</span>
                      </h3>
                      <p className="text-sm text-slate-400 truncate max-w-md mt-1">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500 font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    {expandedId === contact.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                <AnimatePresence>
                  {expandedId === contact.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t-2 border-white/10"
                    >
                      <div className="p-6 md:p-8 space-y-8 bg-black/50">
                        
                        {/* ORIGINAL MESSAGE */}
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Message</h4>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap border-l-4 border-white/20 pl-4 py-2">
                            {contact.message}
                          </p>
                        </div>
                        
                        {/* ADMIN REPLY SECTION */}
                        {contact.status === 'replied' ? (
                          <div className="bg-primary/10 border-2 border-primary/30 p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Replied
                              </h4>
                              <span className="text-xs text-slate-400 tracking-widest uppercase">
                                {new Date(contact.repliedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-white leading-relaxed whitespace-pre-wrap font-bold">
                              {contact.adminReply}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Write a Reply</h4>
                            <textarea 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply here..."
                              className="w-full bg-black border-2 border-white/20 p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none h-32 brutal-shadow-sm font-mono placeholder:text-slate-600"
                            />
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleReply(contact.id)}
                                disabled={replyingId === contact.id}
                                className="px-8 py-3 bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors brutal-shadow-sm flex items-center gap-2 disabled:opacity-50"
                              >
                                {replyingId === contact.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                                Send Reply
                              </button>
                            </div>
                          </div>
                        )}
                        
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

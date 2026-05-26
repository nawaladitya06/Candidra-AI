"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  FileText, Trash2, Edit2, ShieldAlert, Search, RefreshCw,
  Loader2, Plus, Calendar, Clock, ChevronDown, Tag, Link2
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const ADMIN_EMAILS = ["nawaladitya06@gmail.com"];

type Blog = {
  id: string;
  title: string;
  category: string;
  content: string;
  readTime: string;
  date: string;
  slug: string;
  createdAt: string;
};

export default function AdminBlogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [creatingBlog, setCreatingBlog] = useState<Partial<Blog> | null>(null);
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

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.blogs) setBlogs(data.blogs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && ADMIN_EMAILS.includes(session?.user?.email || "")) {
      fetchBlogs();
    }
  }, [status, session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Blog post deleted");
      setBlogs(b => b.filter(x => x.id !== id));
    } catch {
      toast.error("Failed to delete blog post");
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBlog),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast.success("Blog updated successfully");
      setBlogs(b => b.map(x => x.id === editingBlog.id ? editingBlog : x));
      setEditingBlog(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingBlog) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...creatingBlog,
          readTime: creatingBlog.readTime || "5 min read",
          date: creatingBlog.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Creation failed");
      toast.success("Blog created successfully!");
      setBlogs(b => [data.blog, ...b]);
      setCreatingBlog(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to create blog");
    } finally {
      setSaving(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const q = search.toLowerCase();
      return (
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q)
      );
    });
  }, [blogs, search]);

  // Auto-generate slug from title during creation/editing
  const updateSlug = (title: string, isNew: boolean) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    if (isNew) {
      setCreatingBlog(prev => ({ ...prev, title, slug }));
    } else {
      setEditingBlog(prev => prev ? { ...prev, title, slug } : null);
    }
  };

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
              <FileText className="w-9 h-9 text-emerald-400" />
              Blog <span className="text-emerald-400">Manager</span>
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm tracking-tight">
              Manage articles rendered on the front page of the website
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCreatingBlog({ title: "", category: "Engineering", content: "", slug: "", readTime: "5 min read", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) })}
              className="flex items-center gap-2 bg-emerald-400 hover:bg-white text-black hover:text-black border-2 border-emerald-400 hover:border-black px-4 py-2 uppercase tracking-widest text-xs font-black transition-all brutal-shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Article
            </button>
            <button
              onClick={fetchBlogs}
              disabled={loading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-primary/50 px-4 py-2 uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-40"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Summary Stats ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Articles", val: blogs.length, color: "border-white/20 text-white" },
            { label: "Engineering",    val: blogs.filter(b => b.category.toLowerCase() === "engineering").length, color: "border-emerald-500/40 text-emerald-400" },
            { label: "Interviews",     val: blogs.filter(b => b.category.toLowerCase() === "interviews").length, color: "border-blue-500/40 text-blue-400" },
            { label: "Guides & Company", val: blogs.filter(b => b.category.toLowerCase() !== "engineering" && b.category.toLowerCase() !== "interviews").length, color: "border-purple-500/40 text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className={cn("p-4 border-2 bg-black brutal-shadow-sm text-center", stat.color)}>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">{stat.label}</span>
              <span className="text-3xl font-black">{stat.val}</span>
            </div>
          ))}
        </div>

        {/* ── Search Bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center bg-[#111] border-2 border-white/10 px-4 py-3 brutal-shadow-sm">
          <Search className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search articles by title, content, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-600 uppercase tracking-tight"
          />
        </div>

        {/* ── Table Container ─────────────────────────────────────────────────── */}
        <div className="border-4 border-white/20 bg-black brutal-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-white/20 bg-white/[0.02]">
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Article Title</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Category</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Read Time</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 font-mono">Slug</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Publish Date</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                        <span className="uppercase tracking-widest text-xs font-bold">Fetching articles...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-500 uppercase tracking-widest text-xs font-bold">
                      No articles found
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map(b => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white max-w-sm leading-snug uppercase">{b.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1 max-w-sm line-clamp-1 italic">{b.content}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border border-emerald-500/40 text-emerald-400 bg-emerald-500/5 font-mono">
                          {b.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 font-mono text-xs uppercase tracking-tight">
                        {b.readTime}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-xs max-w-[150px] truncate">
                        {b.slug}
                      </td>
                      <td className="p-4 text-slate-400 text-xs font-mono">
                        {b.date}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingBlog(b)}
                            className="p-2 border-2 border-white/20 hover:border-emerald-400 text-slate-400 hover:text-emerald-400 bg-black brutal-shadow-sm transition-all"
                            title="Edit Article"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            disabled={deleting === b.id}
                            className="p-2 border-2 border-white/20 hover:border-red-500 text-slate-400 hover:text-red-500 bg-black brutal-shadow-sm transition-all disabled:opacity-40"
                            title="Delete Article"
                          >
                            {deleting === b.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
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

      </div>

      {/* ── Create / Edit Dialogs ───────────────────────────────────────────── */}
      <AnimatePresence>
        {(creatingBlog || editingBlog) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => { setCreatingBlog(null); setEditingBlog(null); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="bg-black border-4 border-emerald-400 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto brutal-shadow"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-7 h-7 text-emerald-400" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {creatingBlog ? "Add New Article" : "Edit Article"}
                </h2>
              </div>

              <form onSubmit={creatingBlog ? handleCreate : handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Article Title</label>
                    <input
                      type="text"
                      required
                      value={(creatingBlog ? creatingBlog.title : editingBlog?.title) || ""}
                      onChange={e => updateSlug(e.target.value, !!creatingBlog)}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                      placeholder="E.g., Low Latency LLM Pipelines"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> Slug (SEO-friendly url)
                    </label>
                    <input
                      type="text"
                      required
                      value={(creatingBlog ? creatingBlog.slug : editingBlog?.slug) || ""}
                      onChange={e => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
                        if (creatingBlog) setCreatingBlog(p => ({ ...p, slug: val }));
                        else setEditingBlog(p => p ? { ...p, slug: val } : null);
                      }}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                      placeholder="E.g., low-latency-llm"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Category
                    </label>
                    <div className="relative">
                      <select
                        value={(creatingBlog ? creatingBlog.category : editingBlog?.category) || "Engineering"}
                        onChange={e => {
                          if (creatingBlog) setCreatingBlog(p => ({ ...p, category: e.target.value }));
                          else setEditingBlog(p => p ? { ...p, category: e.target.value } : null);
                        }}
                        className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors appearance-none font-mono pr-10"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Interviews">Interviews</option>
                        <option value="Company">Company</option>
                        <option value="Guides">Guides</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Read Time */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Read Time
                    </label>
                    <input
                      type="text"
                      required
                      value={(creatingBlog ? creatingBlog.readTime : editingBlog?.readTime) || "5 min read"}
                      onChange={e => {
                        if (creatingBlog) setCreatingBlog(p => ({ ...p, readTime: e.target.value }));
                        else setEditingBlog(p => p ? { ...p, readTime: e.target.value } : null);
                      }}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                      placeholder="E.g., 8 min read"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Publish Date
                    </label>
                    <input
                      type="text"
                      required
                      value={(creatingBlog ? creatingBlog.date : editingBlog?.date) || ""}
                      onChange={e => {
                        if (creatingBlog) setCreatingBlog(p => ({ ...p, date: e.target.value }));
                        else setEditingBlog(p => p ? { ...p, date: e.target.value } : null);
                      }}
                      className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors font-mono"
                      placeholder="E.g., May 10, 2026"
                    />
                  </div>

                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Article Content</label>
                  <textarea
                    required
                    rows={8}
                    value={(creatingBlog ? creatingBlog.content : editingBlog?.content) || ""}
                    onChange={e => {
                      if (creatingBlog) setCreatingBlog(p => ({ ...p, content: e.target.value }));
                      else setEditingBlog(p => p ? { ...p, content: e.target.value } : null);
                    }}
                    className="w-full bg-black border-2 border-white/20 p-3 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors font-mono resize-y"
                    placeholder="Write article content here..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setCreatingBlog(null); setEditingBlog(null); }}
                    className="flex-1 py-3 border-2 border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm transition-colors font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 border-2 border-emerald-400 bg-emerald-400 text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors font-mono flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : null}
                    {creatingBlog ? "Create Article" : "Save Changes"}
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

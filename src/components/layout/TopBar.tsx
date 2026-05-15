import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Command, CheckCircle2, AlertTriangle, MessageSquare, Loader2 } from "lucide-react";
import { useAppStore, Notification as AppNotification } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export function TopBar() {
  const { user } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = (await res.json()) as AppNotification[];
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications", { method: "POST" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All caught up!");
      }
    } catch (error) {
      toast.error("Failed to update notifications");
    } finally {
      setIsLoading(false);
      setShowNotifications(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header
      className="fixed top-0 lg:left-64 left-0 right-0 z-40 flex items-center justify-between px-8 h-20 bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      {/* ... Search ... */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:bg-white/10 transition-all cursor-pointer group">
         <Search className="w-4 h-4" />
         <span className="text-xs font-bold">Search platform...</span>
         <div className="flex items-center gap-1 ml-8 px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[9px] font-black tracking-widest text-slate-600">
            <Command className="w-2.5 h-2.5" /> K
         </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
           <button 
             onClick={() => setShowNotifications(!showNotifications)}
             className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:border-white/20"
           >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              )}
           </button>

           <AnimatePresence>
             {showNotifications && (
               <>
                 <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                 <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   transition={{ duration: 0.2 }}
                   className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                 >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                       <h4 className="font-bold text-white">Notifications</h4>
                       {unreadCount > 0 && (
                         <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                           {unreadCount} New
                         </span>
                       )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto">
                       {notifications.length === 0 ? (
                         <div className="p-12 text-center">
                            <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                            <p className="text-xs font-bold text-slate-500">No notifications yet</p>
                         </div>
                       ) : (
                         notifications.map((notif) => {
                           const Icon = notif.type === 'interview' ? CheckCircle2 : notif.type === 'coding' ? MessageSquare : AlertTriangle;
                           return (
                             <div key={notif.id} className={cn(
                               "p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-4",
                               !notif.isRead && "bg-white/[0.02]"
                             )}>
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-white/5",
                                  !notif.isRead ? "text-purple-400" : "text-slate-500"
                                )}>
                                   <Icon className="w-4.5 h-4.5" />
                                </div>
                                <div className="min-w-0">
                                   <p className={cn("text-sm mb-0.5 truncate", notif.isRead ? "text-slate-400" : "text-white font-bold")}>{notif.title}</p>
                                   <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">{notif.message}</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                     {new Date(notif.createdAt).toLocaleDateString()}
                                   </p>
                                </div>
                             </div>
                           );
                         })
                       )}
                    </div>
                    
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        disabled={isLoading}
                        className="w-full p-3 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                      >
                         {isLoading ? (
                           <Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-500" />
                         ) : (
                           <p className="text-xs font-bold text-slate-400">Mark all as read</p>
                         )}
                      </button>
                    )}
                 </motion.div>
               </>
             )}
           </AnimatePresence>
        </div>

        {/* User Profile Summary */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
           <div className="hidden md:block text-right">
              <p className="text-xs font-black text-white">{user?.name}</p>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Master Level</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-xl">
              {user?.name?.[0] || "U"}
           </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Search, Eye, Trash2, Mail, Download, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/common/services/apiClient";
import Modal from "@/common/components/elements/Modal";

interface ContactMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  receivedAt: string;
}

export default function MessagesPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await apiClient("/messages");
      if (fetchError) throw new Error(fetchError);
      setMessages(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchMessages();
  }, [token, authLoading]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiClient(`/messages/${id}/read`, { method: "PUT" });
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const { error: deleteError } = await apiClient(`/messages/${id}`, { method: "DELETE" });
      if (deleteError) throw new Error(deleteError);
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkAsRead(msg.id);
    }
  };

  const exportToCSV = () => {
    if (messages.length === 0) return;

    const headers = ["ID", "Sender Name", "Sender Email", "Message", "Is Read", "Received At"];
    const rows = filteredMessages.map(msg => [
      msg.id,
      `"${msg.senderName.replace(/"/g, '""')}"`,
      `"${msg.senderEmail}"`,
      `"${msg.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      msg.isRead ? "Yes" : "No",
      new Date(msg.receivedAt).toISOString()
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contact_messages_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMessages = messages.filter(msg => 
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.senderEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">General messages from the contact form</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToCSV}
            disabled={filteredMessages.length === 0}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 disabled:opacity-50 dark:text-emerald-400"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download CSV</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No messages found</h3>
            <p className="text-sm text-muted-foreground mt-1">General contact messages will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Sender</th>
                  <th className="px-6 py-4 font-medium">Message Snapshot</th>
                  <th className="px-6 py-4 font-medium">Date Received</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMessages.map((msg, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={msg.id} 
                    className={`transition-colors hover:bg-secondary/30 ${!msg.isRead ? 'bg-primary/5 font-medium' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {!msg.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                        <div>
                          <div className="text-foreground">{msg.senderName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 font-normal">{msg.senderEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-1 max-w-[300px] text-muted-foreground font-normal">
                        {msg.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-normal">
                      {new Date(msg.receivedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleViewMessage(msg)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        title="View Message"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!selectedMessage} 
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        maxWidth="max-w-2xl"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {selectedMessage.senderName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedMessage.senderName}</h3>
                  <a href={`mailto:${selectedMessage.senderEmail}`} className="text-sm text-primary hover:underline">
                    {selectedMessage.senderEmail}
                  </a>
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {new Date(selectedMessage.receivedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <div className="mt-1">
                  {new Date(selectedMessage.receivedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/30 p-6 min-h-[200px] whitespace-pre-wrap leading-relaxed border border-border">
              {selectedMessage.message}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {selectedMessage.isRead && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Marked as read
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Delete Message
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type Message, type UserProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Search,
  MessageSquare,
  ShieldAlert,
  Clock,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AdminChatInspectionPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [user1, setUser1] = useState<string>("");
  const [user2, setUser2] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspecting, setInspecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        toast({
          title: "Access Denied",
          description: "You must be an administrator to view this page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const handleInspect = async () => {
    if (!user1 || !user2) {
      toast({
        title: "Selection Required",
        description: "Please select two users to inspect their conversation.",
      });
      return;
    }

    if (user1 === user2) {
      toast({
        title: "Invalid Selection",
        description: "Select two different users.",
        variant: "destructive",
      });
      return;
    }

    setInspecting(true);
    try {
      const history = await api.inspectChatHistory(user1, user2);
      setMessages(history);
      if (history.length === 0) {
        toast({
          title: "No History",
          description: "No messages found between these users.",
        });
      }
    } catch (error) {
      toast({
        title: "Inspection Failed",
        description:
          error instanceof Error ? error.message : "Error fetching history",
        variant: "destructive",
      });
    } finally {
      setInspecting(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString([], {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getUserDetails = (username: string) => {
    return users.find((u) => u.username === username);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="min-h-screen pt-16 md:pt-0 md:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-emerald-500" />
                Chat Inspection
              </h1>
              <p className="text-gray-500">
                Monitor and audit system communication history
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-md">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg">Conversation Audit</CardTitle>
                <CardDescription>
                  Select two users to view their private chat logs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      First User
                    </label>
                    <Select value={user1} onValueChange={setUser1}>
                      <SelectTrigger className="bg-white border-gray-200 h-10">
                        <SelectValue placeholder="Select user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.username} value={u.username}>
                            {u.firstName} {u.lastName} (@{u.username})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="hidden md:block pb-2 text-gray-300">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      Second User
                    </label>
                    <Select value={user2} onValueChange={setUser2}>
                      <SelectTrigger className="bg-white border-gray-200 h-10">
                        <SelectValue placeholder="Select user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.username} value={u.username}>
                            {u.firstName} {u.lastName} (@{u.username})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleInspect}
                    disabled={inspecting || loading || !user1 || !user2}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 px-8 h-10 mt-2 md:mt-0 grow-0 shrink-0"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {inspecting ? "Loading..." : "Inspect Log"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logs Area */}
            <Card className="border-0 shadow-lg overflow-hidden bg-white min-h-[400px] flex flex-col">
              {messages.length > 0 ? (
                <>
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="bg-white border-emerald-200 text-emerald-700"
                      >
                        {messages.length} Messages Found
                      </Badge>
                      <div className="text-sm text-gray-400 font-medium flex items-center gap-2">
                        <User1Badge user={getUserDetails(user1)} />
                        <ChevronRight className="w-3 h-3" />
                        <User1Badge user={getUserDetails(user2)} />
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 max-h-[500px] md:max-h-[600px]">
                    <div className="p-6 space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div
                            className={`flex items-center gap-2 ${msg.sender === user1 ? "text-blue-600" : "text-amber-600"}`}
                          >
                            <span className="text-xs font-black uppercase">
                              {msg.sender === user1 ? "USR 1" : "USR 2"}
                            </span>
                            <span className="text-sm font-bold">
                              {msg.sender}
                            </span>
                            <span className="text-[10px] text-gray-300 font-medium ml-auto flex items-center gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <div
                            className={`p-4 rounded-xl text-sm ${
                              msg.sender === user1
                                ? "bg-blue-50 border border-blue-100 text-blue-900"
                                : "bg-amber-50 border border-amber-100 text-amber-900"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                  <p>
                    Select users and click "Inspect Log" to view conversation
                    history
                  </p>
                  <p className="text-xs mt-2">
                    Audit logs are restricted to system administrators
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function User1Badge({ user }: { user?: UserProfile }) {
  if (!user) return null;
  return (
    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">
      {user.firstName} {user.lastName}
    </span>
  );
}

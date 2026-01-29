"use client";

import { useState, useEffect, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  User,
  MessageSquare,
  Search,
  RefreshCw,
  Clock,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, users] = await Promise.all([
          api.getProfile(),
          api.getUsers(),
        ]);
        setCurrentUser(profile);
        // Filter out self and keep only relevant roles (admin, pharmacist, supplier)
        const filteredContacts = users.filter((u) => {
          if (u.username === profile.username) return false;
          if (!["admin", "pharmacist", "supplier"].includes(u.role))
            return false;

          const myRole = profile.role.toLowerCase();
          const targetRole = u.role.toLowerCase();

          if (myRole === "supplier") {
            // Suppliers can only message Pharmacists and Admins
            return targetRole === "pharmacist" || targetRole === "admin";
          }

          // Admins and Pharmacists can message anyone (including other suppliers)
          return true;
        });
        setContacts(filteredContacts);
      } catch (error) {
        console.error("Failed to fetch contacts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      const fetchHistory = async () => {
        try {
          const history = await api.getChatHistory(selectedContact.username);
          setMessages(history);
        } catch (error) {
          console.error("Failed to fetch chat history", error);
        }
      };
      fetchHistory();

      // Auto-refresh messages every 10 seconds
      const interval = setInterval(fetchHistory, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      await api.sendMessage({
        receiver: selectedContact.username,
        content: newMessage,
      });
      // Optimized: instead of waiting for interval, add message locally and refresh
      const sentMessage: Message = {
        sender: currentUser?.username || "me",
        receiver: selectedContact.username,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.username}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen bg-transparent p-4 md:p-8 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-emerald-500" />
            Messages
          </h1>
          <p className="text-gray-600">Secure communication with partners</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative">
        {/* Contacts Sidebar */}
        <Card
          className={cn(
            "w-full md:w-80 border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col transition-all duration-300",
            showChatOnMobile && "hidden md:flex",
          )}
        >
          <CardHeader className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search people..."
                className="pl-9 h-10 border-gray-100 bg-gray-50/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 animate-pulse rounded-lg m-2"
                  />
                ))
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.username}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowChatOnMobile(true);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                      selectedContact?.username === contact.username
                        ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                        : "hover:bg-gray-50 text-gray-700",
                    )}
                  >
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        {contact.firstName?.[0]}
                        {contact.lastName?.[0]}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold truncate">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span className="capitalize">{contact.role}</span>
                        {/* Status/Time could go here */}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  No contacts found
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card
          className={cn(
            "flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col transition-all duration-300",
            !showChatOnMobile && "hidden md:flex",
          )}
        >
          {selectedContact ? (
            <>
              <CardHeader className="border-b border-gray-100/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden -ml-2 text-gray-400"
                      onClick={() => setShowChatOnMobile(false)}
                    >
                      <User className="w-5 h-5" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                      {selectedContact.firstName?.[0]}
                      {selectedContact.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {selectedContact.firstName} {selectedContact.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 h-4 border-emerald-200 text-emerald-700 bg-emerald-50/50"
                        >
                          {selectedContact.role.toUpperCase()}
                        </Badge>
                        <span className="text-emerald-500 flex items-center gap-1 font-medium">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-emerald-500"
                    >
                      <RefreshCw
                        className="w-4 h-4"
                        onClick={() => {
                          api
                            .getChatHistory(selectedContact.username)
                            .then(setMessages);
                        }}
                      />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 px-6">
                <div className="py-6 space-y-6">
                  {messages.length > 0 ? (
                    messages.map((msg, i) => {
                      const isMe = msg.sender === currentUser?.username;
                      const showAvatar =
                        i === 0 || messages[i - 1].sender !== msg.sender;

                      return (
                        <div
                          key={msg.id || i}
                          className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                        >
                          {!isMe && showAvatar && (
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-600 font-bold shrink-0">
                              {selectedContact.firstName?.[0]}
                            </div>
                          )}
                          {!isMe && !showAvatar && <div className="w-6" />}

                          <div
                            className={`max-w-[70%] group flex flex-col ${isMe ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`px-4 py-2 rounded-2xl text-sm shadow-sm transition-all ${
                                isMe
                                  ? "bg-emerald-500 text-white rounded-br-none"
                                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <Clock className="w-3 h-3 text-gray-300" />
                              <span className="text-[10px] text-gray-400">
                                {formatTime(msg.timestamp)}
                              </span>
                              {isMe && (
                                <CheckCheck className="w-3 h-3 text-emerald-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-300">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm italic">
                        Start a conversation with {selectedContact.firstName}
                      </p>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="p-6 pt-0">
                <form
                  onSubmit={handleSendMessage}
                  className="p-1 pl-4 bg-white border border-gray-100 shadow-xl shadow-emerald-900/5 rounded-2xl flex items-center gap-2"
                >
                  <Input
                    placeholder="Type your message..."
                    className="border-0 bg-transparent focus-visible:ring-0 px-0"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    {sending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="mr-2 hidden sm:inline">Send</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                Your Conversations
              </h2>
              <p className="text-gray-500 max-w-sm mb-8">
                Select a contact from the left to start messaging. Keep track of
                your restock requests and supplier responses in real-time.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-left">
                  <div className="text-emerald-500 font-bold mb-1">
                    Pharmacists
                  </div>
                  <div className="text-xs text-gray-400">
                    Collaborate on stock management
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-left">
                  <div className="text-emerald-500 font-bold mb-1">
                    Suppliers
                  </div>
                  <div className="text-xs text-gray-400">
                    Direct link for restock updates
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Send, Paperclip, Smile, Phone, MoreVertical, ArrowLeft,
  Pin, Check, CheckCheck, FileText, Image, Plus, Home, MessageSquare,
  Building2, Award, Settings, Sparkles, X, Clock, ChevronDown,
  Mail, HelpCircle, LogOut
} from "lucide-react";

type Thread = {
  id: string; name: string; role: string; company?: string;
  lastMessage: string; time: string; unread: number;
  online: boolean; avatar: string; category: "placify"|"company"|"expert";
};

type Message = {
  id: string; text: string; sender: "me"|"them"; time: string;
  status?: "sent"|"delivered"|"seen"; attachment?: {name:string; size:string; type:string};
};

const THREADS: Thread[] = [
  { id:"t1", name:"Verification", role:"Your ID has been confirmed.", company:"Placify", lastMessage:"Your identity verification is complete. You can now proceed to work sample submission.", time:"", unread:0, online:true, avatar:"V", category:"placify" },
  { id:"t2", name:"Stripe", role:"Senior UX Designer", company:"Stripe", lastMessage:"Hi Alex! We've reviewed your portfolio...", time:"3m", unread:1, online:true, avatar:"S", category:"company" },
  { id:"t3", name:"Vercel", role:"Frontend Lead", company:"Vercel", lastMessage:"Thanks for submitting the design challenge...", time:"1h", unread:0, online:false, avatar:"V", category:"company" },
  { id:"t4", name:"Senior Architect", role:"Validation complete", company:"Expert Review", lastMessage:"Your work sample has been reviewed and scored.", time:"2h", unread:0, online:false, avatar:"E", category:"expert" },
];

const MESSAGES_DATA: Record<string, Message[]> = {
  t2: [
    { id:"m1", text:"Hi Alex! We've reviewed your portfolio and were really impressed with the architecture of your recent design system project. Would you be available for a sync on Friday at 2 PM PST?", sender:"them", time:"11:04 AM" },
    { id:"m2", text:"Thanks for reaching out! Friday at 2 PM works perfectly for me. I've attached my latest resume update below for your records.", sender:"me", time:"11:15 AM", status:"seen" },
    { id:"m3", text:"", sender:"me", time:"11:16 AM", status:"seen", attachment:{name:"Alex_CV_2024.pdf", size:"1.2 MB", type:"PDF"} },
  ],
  t1: [
    { id:"m1", text:"Welcome to Placify! Your account has been created successfully.", sender:"them", time:"9:00 AM" },
    { id:"m2", text:"Your identity has been verified through our secure verification pipeline. You can now proceed to the work sample stage.", sender:"them", time:"9:42 AM" },
  ],
  t3: [
    { id:"m1", text:"Hi Alex, thanks for your interest in the Frontend Lead position. We'd like to invite you for a technical discussion.", sender:"them", time:"Yesterday" },
    { id:"m2", text:"I'd love to discuss this opportunity. I'm available next week.", sender:"me", time:"Yesterday", status:"seen" },
  ],
  t4: [
    { id:"m1", text:"Your work sample for the Design Systems challenge has been reviewed. Score: 9.4/10. Excellent execution of component architecture.", sender:"them", time:"2h ago" },
  ],
};

const JOB_DETAILS: Record<string, {company:string;location:string;role:string;salary:string;phase:string;phasePct:number;assets:{name:string;date:string;icon:string}[]}> = {
  t2: { company:"Stripe", location:"Dublin/Remote", role:"Senior UX Designer", salary:"$160k - $220k", phase:"Interviewing", phasePct:70, assets:[{name:"Portfolio_Case_Study.pdf", date:"Oct 12", icon:"doc"},{name:"Figma Prototype", date:"Oct 14", icon:"link"}] },
  t3: { company:"Vercel", location:"Remote", role:"Frontend Lead", salary:"$210k - $275k", phase:"Applied", phasePct:30, assets:[] },
};

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<string>("t2");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState(MESSAGES_DATA);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [aiSuggestion] = useState("Draft a response for the interview sync?");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedThread]);

  // Simulate typing indicator
  useEffect(() => {
    if (selectedThread === "t2") {
      const timer = setTimeout(() => setIsTyping(true), 2000);
      return () => clearTimeout(timer);
    }
    setIsTyping(false);
  }, [selectedThread]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const threadMsgs = messages[selectedThread] || [];
    setMessages(prev => ({
      ...prev,
      [selectedThread]: [...threadMsgs, {
        id: `m${Date.now()}`, text: newMessage, sender: "me" as const,
        time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}),
        status: "sent" as const,
      }],
    }));
    setNewMessage("");
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const filteredThreads = THREADS.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeThread = THREADS.find(t => t.id === selectedThread);
  const threadMessages = messages[selectedThread] || [];
  const jobDetail = JOB_DETAILS[selectedThread];

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Navigation */}
      <nav className="w-[68px] bg-[#F8F9FB] border-r border-zinc-200/60 flex flex-col items-center py-5 gap-1 flex-shrink-0 hidden lg:flex">
        <div className="mb-4">
          <div className="text-[#0052CC] font-black text-[10px] leading-tight text-center">
            PLACIFY<br/><span className="text-[8px] font-bold text-zinc-400 tracking-[0.1em]">INTELLIGENCE HUB</span>
          </div>
        </div>
        <div className="space-y-1 w-full px-2">
          {[
            { icon:Home, label:"Home", href:"/dashboard" },
            { icon:MessageSquare, label:"Messages", href:"/messages", active:true },
            { icon:Building2, label:"Companies", href:"/jobs" },
            { icon:Award, label:"Expert Reviews", href:"/dashboard" },
            { icon:Settings, label:"Settings", href:"/dashboard" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={() => item.href && (window.location.href = item.href)}
                className={`w-full flex flex-col items-center gap-1 py-2.5 rounded-xl text-[9px] font-bold transition-all ${item.active ? "bg-[#0052CC] text-white" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"}`}>
                <Icon className="w-4 h-4"/>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Thread List */}
      <div className={`w-80 border-r border-zinc-200/60 bg-white flex flex-col flex-shrink-0 ${!showMobileSidebar && selectedThread ? "hidden lg:flex" : "flex"}`}>
        <div className="p-4 border-b border-zinc-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"/>
            <input className="w-full bg-[#F5F7FA] border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:bg-white transition-all"
              placeholder="Search threads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Placify Team */}
          {filteredThreads.filter(t => t.category === "placify").length > 0 && (
            <div className="px-4 pt-4 pb-1">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Placify Team</div>
            </div>
          )}
          {filteredThreads.filter(t => t.category === "placify").map(thread => (
            <ThreadItem key={thread.id} thread={thread} active={selectedThread === thread.id}
              onClick={() => { setSelectedThread(thread.id); setShowMobileSidebar(false); }}/>
          ))}

          {/* Company Chats */}
          {filteredThreads.filter(t => t.category === "company").length > 0 && (
            <div className="px-4 pt-5 pb-1">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Company Chats</div>
            </div>
          )}
          {filteredThreads.filter(t => t.category === "company").map(thread => (
            <ThreadItem key={thread.id} thread={thread} active={selectedThread === thread.id}
              onClick={() => { setSelectedThread(thread.id); setShowMobileSidebar(false); }}/>
          ))}

          {/* Expert Reviews */}
          {filteredThreads.filter(t => t.category === "expert").length > 0 && (
            <div className="px-4 pt-5 pb-1">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Expert Reviews</div>
            </div>
          )}
          {filteredThreads.filter(t => t.category === "expert").map(thread => (
            <ThreadItem key={thread.id} thread={thread} active={selectedThread === thread.id}
              onClick={() => { setSelectedThread(thread.id); setShowMobileSidebar(false); }}/>
          ))}
        </div>

        {/* New Message Button */}
        <div className="p-4 border-t border-zinc-100">
          <button className="w-full bg-[#0052CC] hover:bg-[#003FA3] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4"/>
            New Message
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${showMobileSidebar && !selectedThread ? "hidden lg:flex" : "flex"}`}>
        {activeThread ? (
          <>
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-zinc-200/60 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 mr-1" onClick={() => setShowMobileSidebar(true)}>
                  <ArrowLeft className="w-5 h-5 text-zinc-500"/>
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${activeThread.category === "placify" ? "bg-[#0052CC]" : activeThread.category === "expert" ? "bg-zinc-600" : "bg-zinc-900"}`}>
                  {activeThread.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-900">{activeThread.company || activeThread.name} {activeThread.category === "company" ? "Hiring Team" : ""}</div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    {activeThread.online && <span className="w-2 h-2 bg-emerald-400 rounded-full"/>}
                    {activeThread.online ? "Active now" : "Last active 2h ago"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"><Pin className="w-4 h-4"/></button>
                <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"><Phone className="w-4 h-4"/></button>
                <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"><MoreVertical className="w-4 h-4"/></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#FAFBFC]">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
              </div>

              {threadMessages.map((msg, i) => (
                <motion.div key={msg.id} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${msg.sender === "me" ? "" : ""}`}>
                    {msg.sender === "them" && (
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 ${activeThread.category === "placify" ? "bg-[#0052CC]" : "bg-zinc-900"}`}>
                          {activeThread.avatar}
                        </div>
                        <div>
                          {msg.text && (
                            <div className="bg-white border border-zinc-200/60 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-zinc-800 leading-relaxed shadow-sm">
                              {msg.text}
                            </div>
                          )}
                          <div className="text-[10px] text-zinc-400 mt-1 ml-1">{msg.time}</div>
                        </div>
                      </div>
                    )}
                    {msg.sender === "me" && (
                      <div>
                        {msg.text && (
                          <div className="bg-[#0052CC] text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed">
                            {msg.text}
                          </div>
                        )}
                        {msg.attachment && (
                          <div className="mt-2 bg-white border border-zinc-200 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-blue-200 transition-all">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-red-500"/>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-zinc-900">{msg.attachment.name}</div>
                              <div className="text-xs text-zinc-400">{msg.attachment.size} &middot; {msg.attachment.type}</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-1 mt-1 mr-1">
                          <span className="text-[10px] text-zinc-400">{msg.time}</span>
                          {msg.status === "seen" && <CheckCheck className="w-3 h-3 text-[#0052CC]"/>}
                          {msg.status === "delivered" && <CheckCheck className="w-3 h-3 text-zinc-400"/>}
                          {msg.status === "sent" && <Check className="w-3 h-3 text-zinc-400"/>}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${activeThread.category === "placify" ? "bg-[#0052CC]" : "bg-zinc-900"}`}>
                    {activeThread.avatar}
                  </div>
                  <div className="bg-white border border-zinc-200/60 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                          animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:i*0.15}}/>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-400 ml-1 italic">Hiring Team is typing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef}/>
            </div>

            {/* AI Assistant Banner */}
            {activeThread.category === "company" && (
              <div className="px-5 py-2 border-t border-zinc-100 bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0052CC]"/>
                      <span className="text-[10px] font-black text-[#0052CC] uppercase tracking-wider">AI Assistant</span>
                    </div>
                    <span className="text-xs text-zinc-600">{aiSuggestion}</span>
                  </div>
                  <button className="bg-[#0052CC] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#003FA3] transition-colors">
                    Generate Draft
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-5 py-3 border-t border-zinc-200/60 bg-white">
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <button className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                    <Paperclip className="w-4 h-4"/>
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                    <Smile className="w-4 h-4"/>
                  </button>
                </div>
                <div className="flex-1 relative">
                  <input ref={inputRef} className="w-full bg-[#F5F7FA] border-0 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#0052CC]/20 focus:bg-white transition-all pr-12"
                    placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}/>
                </div>
                <button onClick={sendMessage}
                  className={`p-3 rounded-xl transition-all ${newMessage.trim() ? "bg-[#0052CC] text-white hover:bg-[#003FA3] shadow-sm" : "bg-zinc-100 text-zinc-400"}`}>
                  <Send className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#FAFBFC]">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-3"/>
              <h3 className="text-lg font-bold text-zinc-600">Select a conversation</h3>
              <p className="text-sm text-zinc-400 mt-1">Choose a thread to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel — Job Details */}
      {jobDetail && activeThread?.category === "company" && (
        <div className="w-72 border-l border-zinc-200/60 bg-white overflow-y-auto flex-shrink-0 hidden xl:block">
          <div className="p-5 space-y-5">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-3">Job Details</div>
              <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-zinc-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                    {jobDetail.company[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">{jobDetail.company}</div>
                    <div className="text-[10px] text-zinc-400">{jobDetail.location}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-zinc-900 mb-1">{jobDetail.role}</div>
                <div className="text-xs font-bold text-[#0052CC] mb-3">{jobDetail.salary}</div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                    <span>Hiring Phase: {jobDetail.phase}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#0052CC] rounded-full" initial={{width:0}} animate={{width:`${jobDetail.phasePct}%`}} transition={{duration:0.8}}/>
                  </div>
                </div>
              </div>
            </div>

            {jobDetail.assets.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-3">Shared Assets</div>
                <div className="space-y-2">
                  {jobDetail.assets.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl border border-zinc-100 cursor-pointer hover:border-blue-200 transition-all">
                      <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0"/>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{a.name}</div>
                        <div className="text-[10px] text-zinc-400">{a.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="w-full bg-white border border-zinc-200 text-zinc-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors">
              <Clock className="w-3.5 h-3.5"/>
              Schedule Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ThreadItem({ thread, active, onClick }: { thread: Thread; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${active ? "bg-blue-50/70 border-r-2 border-[#0052CC]" : "hover:bg-zinc-50"}`}>
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${thread.category === "placify" ? "bg-[#0052CC]" : thread.category === "expert" ? "bg-zinc-600" : "bg-zinc-900"}`}>
          {thread.avatar}
        </div>
        {thread.online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"/>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-900 truncate">{thread.name}</span>
          {thread.time && <span className="text-[10px] text-zinc-400 flex-shrink-0">{thread.time}</span>}
        </div>
        <div className="text-xs text-zinc-500 truncate">{thread.role}</div>
      </div>
      {thread.unread > 0 && (
        <span className="w-5 h-5 bg-[#0052CC] text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
          {thread.unread}
        </span>
      )}
    </button>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { HelpCircle, Plus, Search, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function SupportCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ subject: "", category: "General", description: "" });

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data: cu } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!cu) return;
      setCompanyId(cu.id);
      
      const { data } = await supabase.from('support_tickets').select('*').eq('company_id', cu.id).order('created_at', { ascending: false });
      setTickets(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
      if (!formData.subject || !formData.description) return toast("error", "Error", "Fill all fields");
      try {
          const { data, error } = await supabase.from('support_tickets').insert({
              company_id: companyId,
              subject: formData.subject,
              category: formData.category,
              status: 'open'
          }).select().single();
          
          if (error) throw error;
          
          await supabase.from('support_messages').insert({
              ticket_id: data.id,
              sender_id: user?.id,
              content: formData.description
          });
          
          toast("success", "Ticket Created", "Our support team will get back to you shortly.");
          setShowNew(false);
          setFormData({ subject: "", category: "General", description: "" });
          fetchTickets();
      } catch (err: any) {
          toast("error", "Failed", err.message);
      }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HelpCircle className="text-blue-600" size={32}/> Support Center
          </h1>
          <p className="text-gray-500 mt-1">Get help with ATS matching, billing, or technical issues.</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={18}/> New Ticket
        </button>
      </div>

      {showNew && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold">Create Support Ticket</h2>
              <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">Subject</label>
                      <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full rounded-xl border-gray-200" placeholder="e.g. ATS Matching not returning candidates" />
                  </div>
                  <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full rounded-xl border-gray-200">
                          <option>Technical</option>
                          <option>Billing</option>
                          <option>ATS</option>
                          <option>Verification</option>
                          <option>Hiring</option>
                          <option>General</option>
                      </select>
                  </div>
                  <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">Description</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border-gray-200 h-32" placeholder="Describe your issue in detail..." />
                  </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowNew(false)} className="px-5 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                  <button onClick={handleCreate} className="px-5 py-2 bg-zinc-900 text-white font-bold rounded-xl">Submit Ticket</button>
              </div>
          </div>
      )}

      {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600 w-8 h-8"/></div>
      ) : (
          <div className="space-y-4">
              {tickets.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                      <p className="font-bold text-gray-900">No support tickets.</p>
                      <p className="text-gray-500 text-sm">You haven&apos;t opened any support requests yet.</p>
                  </div>
              ) : (
                  tickets.map(t => (
                      <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md cursor-pointer transition-all">
                          <div>
                              <div className="flex items-center gap-3 mb-1">
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${t.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {t.status}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t.category}</span>
                              </div>
                              <h3 className="font-bold text-gray-900">{t.subject}</h3>
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                              {new Date(t.created_at).toLocaleDateString()}
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { CreditCard, Download, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function CompanyBilling() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    if (user) fetchBilling();
  }, [user]);

  const fetchBilling = async () => {
    try {
      const { data: cu } = await supabase.from('companies').select('id').eq('user_id', user?.id).single();
      if (!cu) return;
      
      const { data: s } = await supabase.from('company_subscriptions').select('*').eq('company_id', cu.id).single();
      setSub(s || { plan_name: "Free Tier", status: "active" });
      
      const { data: i } = await supabase.from('billing_invoices').select('*').eq('company_id', cu.id).order('created_at', { ascending: false });
      setInvoices(i || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="text-blue-600" size={32}/> Billing & Subscriptions
        </h1>
        <p className="text-gray-500 mt-1">Manage your plan, success fees, and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Current Plan</h2>
                      <div className="text-3xl font-black text-gray-900">{sub?.plan_name}</div>
                      <div className="flex items-center gap-1.5 mt-2 text-sm font-semibold text-emerald-600">
                          <CheckCircle2 size={16}/> Active Subscription
                      </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-100">Upgrade Plan</button>
              </div>
              <p className="text-sm text-gray-500">Your next billing cycle begins on {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "the 1st of next month"}.</p>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between">
              <div>
                  <h2 className="text-sm font-bold text-zinc-400 uppercase mb-1">Pending Success Fees</h2>
                  <div className="text-3xl font-black">₹0</div>
              </div>
              <p className="text-xs text-zinc-400 mt-4">You currently have no pending invoices for successful hires.</p>
          </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Invoice History</h2>
          </div>
          
          {invoices.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                  <p className="font-bold text-gray-900">No invoices yet.</p>
                  <p className="text-sm">Your payment history will appear here.</p>
              </div>
          ) : (
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                          <th className="p-4 pl-6">Invoice</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right pr-6">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                      {invoices.map((inv: any) => (
                          <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4 pl-6 text-gray-900">{inv.description || "Subscription Charge"}</td>
                              <td className="p-4">₹{inv.amount}</td>
                              <td className="p-4">
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {inv.status}
                                  </span>
                              </td>
                              <td className="p-4 text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                              <td className="p-4 pr-6 text-right">
                                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                                      <Download size={16}/>
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </div>
    </div>
  );
}

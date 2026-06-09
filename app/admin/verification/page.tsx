"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Check, X, FileText, AlertCircle, Clock } from "lucide-react";

export default function VerificationCenter() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  async function fetchVerifications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setVerifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string, userId: string) => {
    try {
      const { error } = await supabase
        .from("verifications")
        .update({ 
          status: newStatus, 
          verified_at: newStatus === "approved" ? new Date().toISOString() : null 
        })
        .eq("id", id);
      
      if (error) throw error;

      // Update audit log
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: `verification_${newStatus}`,
        entity_type: "verification",
        entity_id: id,
        metadata: { new_status: newStatus }
      });

      // Update local state
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Center</h1>
        <p className="text-gray-500 mt-2">Approve or reject verification requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Type</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">User ID</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Document</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Status</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <Clock className="animate-spin w-5 h-5" /> Loading verifications...
                  </div>
                </td>
              </tr>
            ) : verifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No verifications found.
                </td>
              </tr>
            ) : (
              verifications.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.type || "Document"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                    {item.user_id?.slice(0, 8)}...
                  </td>
                  <td className="py-4 px-6">
                    {item.document_url ? (
                      <a href={item.document_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                        View Doc
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No doc</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {item.status === "pending" || !item.status ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(item.id, "approved", item.user_id)}
                          className="p-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item.id, "rejected", item.user_id)}
                          className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Done</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

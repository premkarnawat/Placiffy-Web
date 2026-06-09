"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Clock, Search, Filter } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      if (data) setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Audit Logs</h1>
          <p className="text-gray-500 mt-2">Track admin actions and system events.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="border-none outline-none text-sm w-48"
            />
          </div>
          <button className="bg-white border border-gray-200 rounded-lg p-2 text-gray-600 hover:bg-gray-50 shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Timestamp</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Action</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">User ID</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Entity</th>
              <th className="py-4 px-6 font-medium text-gray-500 text-sm">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <Clock className="animate-spin w-5 h-5" /> Loading logs...
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="w-8 h-8 text-gray-300" />
                    <p>No audit logs found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-3 px-6 text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600 font-mono">
                    {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider mr-1">
                      {log.entity_type}
                    </span>
                    {log.entity_id ? log.entity_id.slice(0, 8) : ''}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500">
                    <pre className="max-w-[200px] truncate">
                      {JSON.stringify(log.metadata)}
                    </pre>
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

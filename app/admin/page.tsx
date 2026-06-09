"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Users, Building2, Briefcase, Clock, 
  Activity, Shield, TrendingUp, CheckCircle, List
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    candidates: 0,
    companies: 0,
    activeJobs: 0,
    pendingVerifications: 0,
    totalLogs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: candCount },
          { count: compCount },
          { count: jobsCount },
          { count: verifCount },
          { count: logsCount }
        ] = await Promise.all([
          supabase.from("candidates").select("*", { count: "exact", head: true }),
          supabase.from("companies").select("*", { count: "exact", head: true }),
          supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
          supabase.from("verifications").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("audit_logs").select("*", { count: "exact", head: true })
        ]);

        setStats({
          candidates: candCount || 0,
          companies: compCount || 0,
          activeJobs: jobsCount || 0,
          pendingVerifications: verifCount || 0,
          totalLogs: logsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Placify Admin Portal</h1>
          <p className="text-gray-500 mt-2">High-level system metrics and overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/verification" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Verification Center
          </Link>
          <Link href="/admin/logs" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <List className="w-4 h-4 text-blue-600" />
            Audit Logs
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <Activity className="w-8 h-8 animate-spin" />
          <span className="ml-3">Loading system metrics...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Candidates"
              value={stats.candidates}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-50"
            />
            <StatCard
              title="Total Companies"
              value={stats.companies}
              icon={<Building2 className="w-6 h-6 text-purple-600" />}
              bg="bg-purple-50"
            />
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={<Briefcase className="w-6 h-6 text-green-600" />}
              bg="bg-green-50"
            />
            <StatCard
              title="Pending Verifications"
              value={stats.pendingVerifications}
              icon={<Clock className="w-6 h-6 text-orange-600" />}
              bg="bg-orange-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-48 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-50/50 transform scale-0 group-hover:scale-100 transition-transform rounded-xl -z-10" />
              <Shield className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">System Security</h3>
              <p className="text-sm text-gray-500 text-center px-4 mt-2">
                Monitoring access and actions. Currently tracking {stats.totalLogs} audit events.
              </p>
              <Link href="/admin/logs" className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                View Audit Logs &rarr;
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-48 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-green-50/50 transform scale-0 group-hover:scale-100 transition-transform rounded-xl -z-10" />
              <TrendingUp className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Platform Growth</h3>
              <p className="text-sm text-gray-500 text-center px-4 mt-2">
                User acquisition and job postings are active. Check the verification queue for new registrations.
              </p>
              <Link href="/admin/verification" className="mt-4 text-green-600 text-sm font-medium hover:underline">
                Review Pending Verifications &rarr;
              </Link>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden"
    >
      <div className={`p-4 rounded-lg ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, ChevronRight, User, CheckCircle, Briefcase, FileText } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  role: string;
  ats_score: number;
  trust_score: number;
  expected_salary: string;
  notice_period: string;
  fraud_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  verification_stage: string;
}

const INITIAL_CANDIDATES: Candidate[] = [
  { id: "c1", name: "Sarah Jenkins", role: "React Developer", ats_score: 94, trust_score: 95, expected_salary: "$130k", notice_period: "Immediate", fraud_risk: "LOW", verification_stage: "Verified" },
  { id: "c2", name: "David Chen", role: "Frontend Architect", ats_score: 88, trust_score: 87, expected_salary: "$160k", notice_period: "30 Days", fraud_risk: "LOW", verification_stage: "Verified" },
  { id: "c3", name: "Elena Rostova", role: "React Native Dev", ats_score: 82, trust_score: 91, expected_salary: "$120k", notice_period: "15 Days", fraud_risk: "LOW", verification_stage: "Verification" },
  { id: "c4", name: "Marcus Brodie", role: "UI/UX Developer", ats_score: 91, trust_score: 65, expected_salary: "$140k", notice_period: "Immediate", fraud_risk: "MEDIUM", verification_stage: "Interested" },
  { id: "c5", name: "Aisha Rahman", role: "React Engineer", ats_score: 85, trust_score: 0, expected_salary: "$115k", notice_period: "45 Days", fraud_risk: "LOW", verification_stage: "ATS Matched" },
  { id: "c6", name: "Liam O'Connor", role: "Next.js Specialist", ats_score: 79, trust_score: 0, expected_salary: "$125k", notice_period: "30 Days", fraud_risk: "LOW", verification_stage: "All Applicants" }
];

const COLUMNS = [
  { id: "All Applicants", title: "All Applicants" },
  { id: "ATS Matched", title: "ATS Matched" },
  { id: "Interested", title: "Interested" },
  { id: "Verification", title: "Verification" },
  { id: "Verified", title: "Verified" }
];

export default function KanbanBoard({ onSelectCandidate }: { onSelectCandidate: (c: any) => void }) {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const moveCandidate = (id: string, newStage: string) => {
    setCandidates(prev => 
      prev.map(c => {
        if (c.id === id) {
          const updatedScore = newStage === "Verified" && c.trust_score === 0 ? 86 : c.trust_score;
          return { ...c, verification_stage: newStage, trust_score: updatedScore };
        }
        return c;
      })
    );
  };

  const onDragStart = (id: string) => {
    setDraggingId(id);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (columnId: string) => {
    if (draggingId) {
      moveCandidate(draggingId, columnId);
      setDraggingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 overflow-hidden text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Job Folder Workspace: React Developer</h3>
            <p className="text-xs text-slate-500">6 candidates matching parameters • Self Hiring mode</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
            ATS active
          </span>
          <span className="text-xs bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-md font-mono">
            Rules: Experience &gt; 3 yrs • React, Tailwind
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => {
          const columnCandidates = candidates.filter(c => c.verification_stage === column.id);
          
          return (
            <div 
              key={column.id}
              onDragOver={onDragOver}
              onDrop={() => onDrop(column.id)}
              className="flex flex-col min-w-[240px] bg-slate-900/20 rounded-2xl border border-slate-900 p-4 min-h-[500px]"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-300">{column.title}</span>
                  <span className="text-xs bg-slate-900 text-slate-500 font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-800">
                    {columnCandidates.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <AnimatePresence>
                  {columnCandidates.map(candidate => (
                    <motion.div
                      key={candidate.id}
                      layoutId={candidate.id}
                      draggable
                      onDragStart={() => onDragStart(candidate.id)}
                      onClick={() => onSelectCandidate(candidate)}
                      className="cursor-pointer bg-slate-950 border border-slate-800 hover:border-slate-700/60 p-4 rounded-xl space-y-3 relative transition-all group hover:-translate-y-0.5 active:scale-95"
                    >
                      {candidate.verification_stage === "Verified" && (
                        <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-full blur-sm" />
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold group-hover:text-orange-400 transition-colors">
                            {candidate.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{candidate.role}</p>
                        </div>
                        <CheckCircle className={`w-4 h-4 ${candidate.verification_stage === "Verified" ? "text-emerald-500" : "text-slate-800"}`} />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">ATS Score</span>
                          <span className="text-xs font-black text-slate-300 mt-0.5">{candidate.ats_score}%</span>
                        </div>
                        {candidate.trust_score > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Trust Score</span>
                            <span className="text-xs font-black text-emerald-400 mt-0.5 flex items-center gap-0.5">
                              <Shield className="w-2.5 h-2.5" /> {candidate.trust_score}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Status</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Not Verified</span>
                          </div>
                        )}
                      </div>

                      {candidate.verification_stage !== "All Applicants" && candidate.verification_stage !== "ATS Matched" && (
                        <div className="flex gap-2 text-[9px] bg-slate-900/40 border border-slate-900 rounded p-1.5 text-slate-400">
                          <div>
                            <span className="text-slate-500">Sal:</span> {candidate.expected_salary}
                          </div>
                          <div>
                            <span className="text-slate-500">Notice:</span> {candidate.notice_period}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {columnCandidates.length === 0 && (
                  <div className="border border-dashed border-slate-900 rounded-xl h-24 flex items-center justify-center text-xs text-slate-600">
                    Drag candidates here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

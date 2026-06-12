"use client";
import React, { useState } from 'react';
import { Activity, BrainCircuit, Play, BarChart, Users, Settings2, Target } from 'lucide-react';

export default function ATSCenterAdmin() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const triggerCalibration = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setRunning(false);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ATS Vector Center</h1>
        <p className="text-slate-500 font-medium">Monitor and calibrate the Applicant Tracking System AI Engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-bl-full -z-10"></div>
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Embedding Engine Health</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">The semantic search vector database is online and connected via Supabase pgvector.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-600">Vector Index Sync</span>
                <span className="text-emerald-600">99.9%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[99%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-600">Candidate Parsing Queue</span>
                <span className="text-blue-600">Clear (0 pending)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[100%]"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={triggerCalibration}
              disabled={running}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {running ? <Activity className="animate-pulse" size={20}/> : <Play size={20}/>} 
              {running ? `Calibrating Weights (${progress}%)` : 'Run Manual Algorithm Calibration'}
            </button>
            {running && (
              <div className="w-full bg-slate-100 rounded-full h-1 mt-3 overflow-hidden">
                <div className="bg-blue-500 h-1 transition-all duration-100" style={{width: `${progress}%`}}></div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Target size={20} className="text-blue-400"/> Current Match Accuracies</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-sm font-medium text-slate-300">Skills Weight</span>
                <span className="font-bold text-emerald-400">45%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-sm font-medium text-slate-300">Experience Weight</span>
                <span className="font-bold text-emerald-400">30%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-sm font-medium text-slate-300">Semantic Matching</span>
                <span className="font-bold text-emerald-400">25%</span>
              </div>
              <button className="w-full text-xs font-bold text-blue-400 hover:text-white flex items-center justify-center gap-1 mt-4 transition-colors"><Settings2 size={14}/> Adjust ATS Weights</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

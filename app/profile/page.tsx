"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Edit3, CheckCircle, MapPin, Mail, Phone, Globe, Github,
  Linkedin, Briefcase, GraduationCap, Award, Shield, FileText,
  Upload, Sparkles, ExternalLink, Calendar, ChevronRight
} from "lucide-react";

const VERIFICATION_STEPS = [
  { id:1, label:"Resume", completed:true },
  { id:2, label:"Portfolio", completed:true },
  { id:3, label:"Expert Review", completed:true },
  { id:4, label:"Trust Score", completed:false, active:true },
  { id:5, label:"Passport", completed:false },
];

const SKILLS = ["Design Systems","AI Prompting","React / Framer","UX Research","Product Strategy","Visual Design","Python Automation"];
const EXPERIENCE = [
  { role:"Senior Design Orchestrator", company:"Stripe Intelligence", period:"2021 - PRESENT", description:"Leading cross-functional design systems for next-gen financial AI modules. Improved design velocity by 40% through automated asset pipelines.", logo:"S", color:"bg-violet-100 text-violet-600" },
  { role:"Product Designer", company:"Nova Systems", period:"2018 - 2021", description:"Owned the core user journey for 500k+ monthly active users. Reduced user churn by 12% via data-driven UX iterations.", logo:"N", color:"bg-emerald-100 text-emerald-600" },
];
const EDUCATION = [
  { degree:"MFA in Interaction Design", institution:"Stanford University", year:"Class of 2018" },
  { degree:"BFA in Visual Communication", institution:"RISD", year:"Class of 2016" },
];

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const trustScore = 842;
  const trustMax = 1000;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <header className="border-b border-zinc-200/60 bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[#0052CC] font-black text-base tracking-tight">PLACIFY</span>
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-500">
              <a href="/jobs" className="hover:text-zinc-900 transition-colors">Find Jobs</a>
              <a href="/jobs" className="hover:text-zinc-900 transition-colors">Companies</a>
              <a href="/profile" className="text-zinc-900 font-bold border-b-2 border-[#0052CC] pb-0.5">Passport</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Shield className="w-4 h-4"/></button>
            <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><FileText className="w-4 h-4"/></button>
            <button className="bg-[#0052CC] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#003FA3] transition-colors">Support</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-48 border-r border-zinc-100 min-h-screen py-6 px-4 hidden lg:block">
          <div className="mb-6">
            <div className="text-[#0052CC] font-black text-sm">Candidate Hub</div>
            <div className="text-[10px] text-zinc-400 font-medium">Hiring OS</div>
          </div>
          <nav className="space-y-1">
            {[
              { label:"Dashboard", href:"/dashboard", icon:FileText },
              { label:"Jobs", href:"/jobs", icon:Briefcase },
              { label:"Applications", href:"/dashboard", icon:FileText },
              { label:"Verification", href:"/dashboard", icon:Shield },
              { label:"Trust Score", href:"/dashboard", icon:Award },
              { label:"Passport", href:"/profile", icon:FileText, active:true },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a key={i} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${item.active ? "bg-[#0052CC] text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"}`}>
                  <Icon className="w-4 h-4"/>
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="mt-auto pt-8 space-y-2">
            <button className="w-full bg-emerald-50 text-emerald-700 text-xs font-bold py-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5">
              <ExternalLink className="w-3 h-3"/> Refer a Friend
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Profile Header */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="flex flex-col md:flex-row items-start gap-5 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-zinc-200 border-4 border-white shadow-md flex items-center justify-center text-2xl font-black text-zinc-400">
                AM
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#0052CC] rounded-full flex items-center justify-center text-white shadow-md">
                <Edit3 className="w-3 h-3"/>
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-zinc-900">Alex Montgomery</h1>
              <p className="text-sm text-zinc-600 font-medium">Senior Product Designer & AI Orchestrator</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle className="w-3 h-3"/> Verified Elite
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> San Francisco, CA</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
                <Upload className="w-3.5 h-3.5"/> Import LinkedIn
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003FA3] transition-colors">
                Publish Passport
              </button>
            </div>
          </motion.div>

          {/* Verification Journey */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
            className="bg-[#F8F9FB] rounded-2xl p-5 border border-zinc-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold text-zinc-500">Verification Journey</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold bg-blue-50 text-[#0052CC] border border-blue-200 px-2 py-0.5 rounded">Step 4/5</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-400 font-medium">Trust Score Estimation</div>
                <div className="text-2xl font-black text-zinc-900">{trustScore} <span className="text-sm text-zinc-400 font-medium">/ {trustMax}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {VERIFICATION_STEPS.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      step.completed ? "bg-[#0052CC] border-[#0052CC] text-white" :
                      step.active ? "bg-white border-[#0052CC] text-[#0052CC]" :
                      "bg-zinc-100 border-zinc-200 text-zinc-400"
                    }`}>
                      {step.completed ? <CheckCircle className="w-4 h-4"/> : step.id}
                    </div>
                    <span className={`text-[10px] font-bold ${step.completed || step.active ? "text-zinc-700" : "text-zinc-400"}`}>{step.label}</span>
                  </div>
                  {i < VERIFICATION_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full mb-5 ${step.completed ? "bg-[#0052CC]" : "bg-zinc-200"}`}/>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Insight */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
                className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0052CC] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white"/>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">AI-Extracted Data Insight</div>
                    <div className="text-xs text-zinc-600">We've identified strong leadership patterns in your recent 4 years of experience.</div>
                  </div>
                </div>
                <button className="bg-[#0052CC] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#003FA3] transition-colors whitespace-nowrap">
                  Verify Analysis
                </button>
              </motion.div>

              {/* Personal Information */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-zinc-900">Personal Information</h2>
                  <button className="text-xs text-[#0052CC] font-bold hover:underline">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</div>
                    <div className="text-sm text-zinc-900 font-medium mt-0.5">alex.m@example.design</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone Number</div>
                    <div className="text-sm text-zinc-900 font-medium mt-0.5">+1 (415) 555-0192</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Website / Portfolio</div>
                    <a href="#" className="text-sm text-[#0052CC] font-medium mt-0.5 hover:underline">www.alexmontgomery.studio</a>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</div>
                    <div className="text-sm text-zinc-900 font-medium mt-0.5">San Francisco, California, USA</div>
                  </div>
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
                className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-zinc-900">Experience</h2>
                  <button className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><Edit3 className="w-3 h-3 text-zinc-500"/></button>
                </div>
                <div className="space-y-5">
                  {EXPERIENCE.map((exp, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-9 h-9 rounded-xl ${exp.color} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                        {exp.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-bold text-zinc-900">{exp.role}</div>
                            <div className="text-xs text-[#0052CC] font-bold">{exp.company}</div>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{exp.period}</span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
                className="bg-white border border-zinc-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-zinc-900">Skills</h2>
                  <button className="p-1"><Edit3 className="w-3.5 h-3.5 text-zinc-400"/></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SKILLS.map((skill, i) => (
                    <span key={i} className="text-[11px] font-bold text-[#0052CC] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Verified Tools</div>
                  <div className="flex gap-2">
                    {["Figma","Sketch","Framer"].map((tool, i) => (
                      <div key={i} className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                        {tool[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Education */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                className="bg-white border border-zinc-100 rounded-2xl p-5">
                <h2 className="text-base font-bold text-zinc-900 mb-3">Education</h2>
                <div className="space-y-3">
                  {EDUCATION.map((edu, i) => (
                    <div key={i}>
                      <div className="text-sm font-bold text-zinc-900">{edu.degree}</div>
                      <div className="text-xs text-zinc-500">{edu.institution}</div>
                      <div className="text-[10px] text-[#0052CC] font-bold mt-0.5">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Passport Badge */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
                className="bg-[#0052CC] rounded-2xl p-5 text-white">
                <h3 className="text-lg font-black mb-1">Elite Passport</h3>
                <p className="text-xs text-blue-200 mb-4">Your verification level is in the top 2% of candidates globally.</p>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">Passing Grade</div>
                    <div className="text-4xl font-black">A+</div>
                  </div>
                  <Award className="w-10 h-10 text-blue-300/50"/>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

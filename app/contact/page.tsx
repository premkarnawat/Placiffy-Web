'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Placify Hiring Service',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'Placify Hiring Service',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="PLACIFY" className="h-10 w-10 rounded-xl object-cover" />
            <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">PLACIFY</span>
          </a>
          <a href="/" className="text-sm font-bold text-[#0052CC] hover:underline flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Get In Touch</h1>
            <p className="text-slate-500 text-xs font-semibold mb-8">Send us an inquiry or schedule a 1-on-1 demo call.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-xs font-bold text-slate-600 uppercase block mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="text-xs font-bold text-slate-600 uppercase block mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone" 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-bold text-slate-600 uppercase block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com" 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="text-xs font-bold text-slate-600 uppercase block mb-2">Inquiry For</label>
                <select 
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors"
                >
                  <option>Placify Hiring Service</option>
                  <option>Self Hiring Solution</option>
                  <option>Bulk Resume ATS Shortlisting</option>
                  <option>Academic Software Projects</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-bold text-slate-600 uppercase block mb-2">Message</label>
                <textarea 
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help your team?" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 text-sm outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full px-6 py-4 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0040A3] transition-colors shadow-premium flex items-center justify-center gap-2"
              >
                <span>{submitted ? 'Inquiry Sent ✓' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Contact Details */}
          <div className="lg:col-span-5 space-y-8 lg:pt-10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Contact Details</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Contact Information</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions about our recruitment models, ATS dashboards, or final-year student training? Connect directly with our representatives.
              </p>
            </div>

            <div className="space-y-5 text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Phone size={18} />
                </div>
                <span>7796420465</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Mail size={18} />
                </div>
                <a href="mailto:placiffy.contact@gmail.com" className="hover:underline">placiffy.contact@gmail.com</a>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/60 py-10 text-center text-xs font-semibold text-slate-400">
        <p>&copy; {new Date().getFullYear()} PLACIFY. All rights reserved.</p>
      </footer>
    </div>
  );
}

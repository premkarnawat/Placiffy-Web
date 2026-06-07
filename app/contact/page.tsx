'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp,
  Zap, Building2, Users, Globe, Shield, MessageSquare, Send,
  Twitter, Linkedin, Github, Instagram, Check, ArrowLeft
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const slideLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
const slideRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };

/* ============ FAQ ACCORDION ============ */
function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={false}
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#1A56DB]/20 bg-blue-50/30 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-bold text-[#111827] text-sm pr-4">{question}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-[#1A56DB] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-5 pb-5 text-sm text-[#6B7280] leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============ HEADER ============ */
function ContactHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#3B82F6] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#111827]">PLACIFY</span>
        </a>
        <a href="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>
      </div>
    </header>
  );
}

/* ============ MAIN CONTACT PAGE ============ */
export default function ContactPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: '-60px' });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: '-60px' });
  const mapRef = useRef(null);
  const mapInView = useInView(mapRef, { once: true, margin: '-60px' });

  const [formData, setFormData] = useState({
    name: '', email: '', company: '', companySize: '', subject: '', message: ''
  });
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    { q: 'How does PLACIFY verify candidates?', a: 'PLACIFY uses a multi-layered verification system that includes identity checks, employment history validation, education verification, skill assessments, and our proprietary AI Trust Score algorithm that aggregates 12+ data signals.' },
    { q: 'What is the AI Trust Score?', a: 'The AI Trust Score is a proprietary reliability index that combines background verification results, skill assessment performance, behavioral analysis, and commitment indicators into a single score, helping you make data-driven hiring decisions.' },
    { q: 'Can I integrate PLACIFY with my existing ATS?', a: 'Yes! PLACIFY offers seamless integrations with popular ATS platforms including Greenhouse, Lever, Workday, and more. Our Enterprise plan also includes custom API access for bespoke integrations.' },
    { q: 'What industries does PLACIFY support?', a: 'PLACIFY is designed for all industries but has specialized modules for AI/ML, DevOps & Cloud, UI/UX Design, Media & Crypto, FinTech, Healthcare, and more. Each module is calibrated with industry-specific skill taxonomies.' },
    { q: 'Is there a free trial available?', a: 'Yes, we offer a 14-day free trial on our Startup plan. No credit card required. You can also book a personalized demo with our team to see PLACIFY in action.' },
    { q: 'How is my data protected?', a: 'PLACIFY is SOC2 Type II compliant and ISO 27001 certified. All data is encrypted at rest and in transit. We follow strict GDPR and CCPA compliance protocols, and our platform undergoes regular third-party security audits.' },
  ];

  const contactInfo = [
    { icon: MapPin, label: 'Office Address', value: '100 Market Street, Suite 400\nSan Francisco, CA 94105', color: 'bg-blue-50 text-[#1A56DB]' },
    { icon: Mail, label: 'Email Us', value: 'hello@placify.io\nsupport@placify.io', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Phone, label: 'Call Us', value: '+1 (415) 555-0142\n+1 (415) 555-0198', color: 'bg-purple-50 text-purple-600' },
    { icon: Clock, label: 'Office Hours', value: 'Mon - Fri: 9:00 AM - 6:00 PM PST\nSat: 10:00 AM - 2:00 PM PST', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <main className="min-h-screen bg-white font-sans">
      <ContactHeader />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-[#1A56DB] to-[#1E40AF]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/90">Contact Us</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-5">
            Let&apos;s Build Your<br/>Dream Team Together
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto">
            Have questions about PLACIFY? Want a personalized demo? Our team is ready to help you transform your hiring process.
          </motion.p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section ref={formRef} className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Form */}
            <motion.div initial="hidden" animate={formInView ? 'visible' : 'hidden'} variants={slideLeft} transition={{ duration: 0.6 }}
              className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
                <h2 className="font-bold text-2xl text-[#111827] mb-2">Send Us a Message</h2>
                <p className="text-sm text-[#6B7280] mb-8">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Full Name *</label>
                      <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Work Email *</label>
                      <input type="email" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Company</label>
                      <input type="text" placeholder="Acme Inc." value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Company Size</label>
                      <select value={formData.companySize} onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all appearance-none">
                        <option value="">Select size</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1,000 employees</option>
                        <option value="1000+">1,000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Subject</label>
                    <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all appearance-none">
                      <option value="">Select a subject</option>
                      <option value="demo">Book a Demo</option>
                      <option value="pricing">Pricing Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 block">Message *</label>
                    <textarea rows={5} placeholder="Tell us about your hiring needs, team size, or any questions you have..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20 focus:border-[#1A56DB] transition-all resize-none" />
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[#1A56DB] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(26,86,219,0.35)] hover:bg-[#1E40AF] transition-colors">
                    <Send className="w-4 h-4" /> Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial="hidden" animate={formInView ? 'visible' : 'hidden'} variants={slideRight} transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6">
              {contactInfo.map((info, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={formInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0`}>
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111827] text-sm mb-1">{info.label}</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">{info.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick links */}
              <div className="bg-gradient-to-br from-[#1A56DB] to-[#1E40AF] rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-3">Quick Links</h3>
                <div className="space-y-2">
                  {['Book a Demo', 'View Pricing', 'Read Documentation', 'API Reference'].map(link => (
                    <a key={link} href="#" className="flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" /> {link}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section ref={mapRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate={mapInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6 }}
            className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-[#111827] mb-3">Our Office</h2>
            <p className="text-[#6B7280]">Visit us at our San Francisco headquarters</p>
          </motion.div>
          <motion.div initial="hidden" animate={mapInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] bg-gradient-to-br from-[#1A56DB]/5 via-blue-100/30 to-indigo-100/20 border border-gray-200">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-[#1A56DB]/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1A56DB]/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#1A56DB]" />
                  </div>
                </motion.div>
                <p className="font-bold text-[#111827]">100 Market Street, Suite 400</p>
                <p className="text-sm text-[#6B7280]">San Francisco, CA 94105</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" animate={faqInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 bg-blue-50 text-[#1A56DB] border border-blue-100">FAQ</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#111827] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#6B7280]">Everything you need to know about PLACIFY</p>
          </motion.div>

          <motion.div initial="hidden" animate={faqInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} isOpen={openFAQ === i} onToggle={() => setOpenFAQ(openFAQ === i ? null : i)} />
            ))}
          </motion.div>

          <motion.div initial="hidden" animate={faqInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-[#111827] mb-2">Still have questions?</h3>
            <p className="text-sm text-[#6B7280] mb-5">Our team is here to help you with anything you need.</p>
            <a href="mailto:hello@placify.io" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(26,86,219,0.35)] hover:bg-[#1E40AF] transition-colors">
              <Mail className="w-4 h-4" /> Email Our Team
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8FAFC] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#3B82F6] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#111827]">PLACIFY</span>
            </div>
            <p className="text-sm text-[#6B7280]">&copy; 2026 Placify Hiring Intelligence. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#6B7280] hover:text-[#1A56DB] hover:border-blue-200 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
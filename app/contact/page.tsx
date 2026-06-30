'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Award, Info, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);
    
    // Simulate API contact message submission
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Auto close success alert
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="glass p-8 rounded-3xl glow-primary space-y-3">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
            <Mail className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.contact.title}
            </h1>
            <p className="text-xs text-slate-400">
              Biz bilan bog‘lanish va tadqiqot bo‘yicha fikr-mulohazalarni qoldirish oynasi
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Form (Left 2 cols) */}
        <div className="md:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg p-6 md:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <Send className="w-5 h-5 text-secondary" />
            <span>Fikr-mulohaza yuborish shakli</span>
          </h3>

          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-3 text-xs font-semibold animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Xabaringiz muvaffaqiyatli yuborildi. Rahmat!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name field */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.contact.nameLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {t.contact.emailLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Message field */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {t.contact.messageLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:shadow-sky-500/20 hover:scale-[1.01] transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.contact.sendBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info (Right 1 col) */}
        <div className="space-y-6">
          
          {/* Quick Contacts Panel */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-sky-400" />
              <span>{t.contact.infoTitle}</span>
            </h3>

            <ul className="space-y-4 text-xs">
              <li className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">{t.contact.phone}</span>
                <a href="tel:+998888000251" className="text-white hover:text-sky-400 transition-colors font-semibold">
                  +998 (88) 800-02-51
                </a>
              </li>

              <li className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">{t.contact.email}</span>
                <a href="mailto:maruf79@bk.ru" className="text-white hover:text-sky-400 transition-colors font-semibold">
                  maruf79@bk.ru
                </a>
              </li>

              <li className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">{t.contact.address}</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {t.contact.address}
                </p>
              </li>
            </ul>
          </div>

          {/* Academic Affiliation Note */}
          <div className="p-4 bg-sky-50 dark:bg-sky-950/15 border border-sky-100 dark:border-sky-900/30 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-primary dark:text-sky-400 flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>Ilmiy hamkorlik:</span>
            </span>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Taqdim etilgan platforma yuzasidan savollar, metodik takliflar va eksperiment o‘tkazish bo‘yicha maktab hamkorligi uchun biz bilan bog‘lanishingiz mumkin.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

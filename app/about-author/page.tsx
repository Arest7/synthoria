'use client';

import React, { useState, useEffect } from 'react';
import { Award, BookOpen, GraduationCap, Mail, Phone, MapPin, Newspaper, ChevronRight, Loader2, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface Publication {
  id: string;
  title: string;
  content: string;
  category: 'RESEARCH' | 'METHODICAL' | 'NEWS';
  fileUrl: string | null;
  date: string;
}

export default function AboutAuthorPage() {
  const { t } = useLanguage();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch publications from API to show the latest works
  useEffect(() => {
    setLoading(true);
    fetch('/api/publications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort or slice to show latest top 5
          setPublications(data.slice(0, 5));
        }
      })
      .catch((err) => console.error('Error fetching publications on profile:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Profile Section Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden flex flex-col md:flex-row glow-primary">
        
        {/* Left Side: Avatar Panel */}
        <div className="md:w-1/3 bg-gradient-to-b from-primary via-slate-900 to-slate-950 text-white p-8 flex flex-col items-center justify-center text-center space-y-4 relative min-h-[320px]">
          {/* Abstract vector avatar graphic */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-secondary to-accent p-1 shadow-lg relative flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <GraduationCap className="w-16 h-16 text-sky-400" />
            </div>
            {/* Ambient pulse badge */}
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center" title="Active researcher" />
          </div>

          <div>
            <h2 className="text-sm font-bold font-display tracking-tight text-white leading-tight">
              {t.author.name}
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-2 uppercase tracking-wider">
              {t.author.role}
            </p>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-4 w-full text-center leading-relaxed">
            {t.author.uni}
          </div>
        </div>

        {/* Right Side: Quick facts */}
        <div className="md:w-2/3 p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
              {t.author.dissTitle}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 font-display leading-tight">
              {t.author.dissName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.author.uni} • {t.author.department}
            </p>
          </div>

          {/* Research Interests tags */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.author.interests}
            </span>
            <div className="flex flex-wrap gap-2">
              {t.author.interestsList.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200/50 dark:border-slate-700/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Biography & Scientific Publications details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Bio & Publications */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Biography */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white font-display flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span>{t.author.biography}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.author.bioDesc}
            </p>
          </div>

          {/* Scientific Publications */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-white font-display flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-secondary" />
                <span>{t.author.publications}</span>
              </h3>

              <Link
                href="/research"
                className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Barchasi</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10 gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                <span>Maqolalar yuklanmoqda...</span>
              </div>
            ) : publications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">Nashrlar ro'yxati topilmadi.</p>
            ) : (
              <div className="space-y-4">
                {publications.map((pub, idx) => (
                  <div key={pub.id} className="flex gap-3 text-xs leading-relaxed border-b border-slate-100 dark:border-slate-800/60 last:border-0 pb-4 last:pb-0">
                    <div className="w-6 h-6 rounded-md bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {pub.title}
                      </h4>
                      <p className="text-slate-400 text-[10px] font-medium">
                        {pub.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 col: Contacts */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-400" />
              <span>{t.contact.infoTitle}</span>
            </h3>

            <ul className="space-y-4 text-xs">
              
              {/* Shaxsiy Telefon */}
              <li className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Shaxsiy Telefon</span>
                <a href="tel:+998888000251" className="text-white hover:text-sky-400 transition-colors font-semibold">
                  +998 (88) 800-02-51
                </a>
              </li>

              {/* Shaxsiy Email */}
              <li className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Shaxsiy Pochta</span>
                <a href="mailto:maruf79@bk.ru" className="text-white hover:text-sky-400 transition-colors font-semibold">
                  maruf79@bk.ru
                </a>
              </li>

              {/* O'quv yurti & Kafedra */}
              <li className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Ilmiy Muassasa</span>
                <p className="text-slate-200 font-semibold leading-relaxed text-[11px]">
                  Andijon davlat pedagogika instituti (ADPI)
                </p>
                <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">
                  Tasviriy san’at va musiqa ta’limi kafedrasi
                </p>
              </li>

              {/* Institut Aloqalari */}
              <li className="space-y-1 border-t border-slate-800 pt-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Institut Ma'lumotlari</span>
                
                {/* Manzil */}
                <div className="flex gap-1.5 items-start mt-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-[10px] leading-relaxed">
                    Andijon sh., Do‘stlik ko‘chasi, 4-uy (Taxtako‘prik MFY)
                  </span>
                </div>

                {/* ADPI Tel */}
                <div className="flex gap-1.5 items-center mt-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href="tel:+998742240170" className="text-slate-300 hover:text-sky-400 text-[10px]">
                    +998 (74) 224-01-70
                  </a>
                </div>

                {/* ADPI Email */}
                <div className="flex gap-1.5 items-center mt-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href="mailto:adpi@edu.uz" className="text-slate-300 hover:text-sky-400 text-[10px]">
                    adpi@edu.uz
                  </a>
                </div>

                {/* ADPI Website */}
                <div className="flex gap-1.5 items-center mt-2">
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href="https://adpi.uz/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-[10px] font-semibold flex items-center gap-0.5">
                    <span>adpi.uz</span>
                    <ChevronRight size={10} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, ChevronRight, Calendar, FileSpreadsheet, Search, BookOpen, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import StatsCharts from '@/components/charts/StatsCharts';

interface TimelineStep {
  titleKey: 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6';
  descKey: 'step1Desc' | 'step2Desc' | 'step3Desc' | 'step4Desc' | 'step5Desc' | 'step6Desc';
  stepNum: number;
}

interface Publication {
  id: string;
  title: string;
  content: string;
  category: 'RESEARCH' | 'METHODICAL' | 'NEWS';
  fileUrl: string | null;
  date: string;
}

export default function ResearchPage() {
  const { t } = useLanguage();
  
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Fetch publications from API
  useEffect(() => {
    setLoading(true);
    fetch('/api/publications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPublications(data);
        }
      })
      .catch((err) => console.error('Error fetching publications:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter and search logic
  const filteredPubs = useMemo(() => {
    let list = publications;

    if (selectedTab !== 'all') {
      list = list.filter((p) => p.category === selectedTab);
    }

    if (searchQuery.trim() !== '') {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  }, [publications, selectedTab, searchQuery]);

  const timeline: TimelineStep[] = [
    { stepNum: 1, titleKey: 'step1', descKey: 'step1Desc' },
    { stepNum: 2, titleKey: 'step2', descKey: 'step2Desc' },
    { stepNum: 3, titleKey: 'step3', descKey: 'step3Desc' },
    { stepNum: 4, titleKey: 'step4', descKey: 'step4Desc' },
    { stepNum: 5, titleKey: 'step5', descKey: 'step5Desc' },
    { stepNum: 6, titleKey: 'step6', descKey: 'step6Desc' }
  ];

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Page Header */}
      <div className="glass p-8 rounded-3xl glow-primary space-y-3">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.research.title}
            </h1>
            <p className="text-xs text-slate-400">
              Magistrlik dissertatsiyasining ilmiy konsepsiyasi va eksperimental ko‘rsatkichlari
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t.research.subtitle}
        </p>
      </div>

      {/* Dissertation Purpose Block */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <Award className="w-5 h-5 text-secondary" />
          <span>{t.research.purpose}</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          {t.research.purposeDesc}
        </p>

        {/* Theoretical Novelty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
          <div className="p-4 bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100/50 dark:border-sky-900/30 rounded-xl space-y-2">
            <span className="font-bold text-primary dark:text-sky-400 block">Tadqiqotning ilmiy yangiligi:</span>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Umumta’lim maktablarida musiqa o‘qitishda birinchi marta 3D MIDI vizualizatsiyasi va virtual asboblar integratsiyasi orqali sinesteziya (ko‘rish va eshitish bog‘liqligi) hissi estetik kompetensiyani rivojlantirish omili sifatida ilmiy asoslandi.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl space-y-2">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Amaliy ahamiyati:</span>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              O‘quvchilar uchun darslik kuylari asosida tayyorlangan interaktiv MIDI kutubxonasi va musiqa o‘qituvchilari uchun dars o‘tish bo‘yicha metodik andozalar to‘plami yaratildi va ta’lim jarayoniga muvaffaqiyatli joriy etildi.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Timeline (Xronologiya) */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          <span>{t.research.timelineTitle}</span>
        </h2>

        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8 py-2">
          {timeline.map((step) => {
            const title = t.research[step.titleKey];
            const desc = t.research[step.descKey];

            return (
              <motion.div
                key={step.stepNum}
                className="relative pl-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.stepNum * 0.1 }}
              >
                {/* Timeline Circle */}
                <span className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-secondary to-primary border-4 border-white dark:border-slate-900 shadow-md z-10" />

                <div className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                      Bosqich {step.stepNum}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">
                    {title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Animated Statistics Charts Section */}
      <div className="space-y-6 pt-4">
        <StatsCharts />
      </div>

      {/* 5. SCIENTIFIC PUBLICATIONS SECTION (Ilmiy maqolalar va nashrlar) */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              <span>Ilmiy maqolalar va nashrlar ro'yxati</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Ashurov Ma’rufjon Abdumutalibovichning ilmiy, oʻquv-uslubiy ishlar bazasi ({publications.length} ta)
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'RESEARCH', label: 'Ilmiy maqolalar' },
            { id: 'METHODICAL', label: 'O‘quv va ilmiy adabiyotlar' },
            { id: 'NEWS', label: 'Madaniy-ijodiy nashrlar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Publications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-secondary" />
            <span>Nashrlar yuklanmoqda...</span>
          </div>
        ) : filteredPubs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Ushbu turdagi ilmiy maqola yoki nashr topilmadi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPubs.map((pub, idx) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      pub.category === 'RESEARCH'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : pub.category === 'METHODICAL'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-accent'
                    }`}>
                      {pub.category === 'RESEARCH'
                        ? 'Ilmiy maqola'
                        : pub.category === 'METHODICAL'
                        ? 'O‘quv adabiyoti'
                        : 'Madaniy-ijodiy nashr'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {pub.content.includes('2021') ? '2021-yil' : pub.content.includes('2023') ? '2023-yil' : pub.content.includes('2024') ? '2024-yil' : pub.content.includes('2026') ? '2026-yil' : '2025-yil'}
                    </span>
                  </div>
                  
                  <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {pub.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pub.content}
                  </p>
                </div>

                {pub.fileUrl && (
                  <a
                    href={pub.fileUrl}
                    download
                    className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-center"
                  >
                    <span>Yuklab olish (PDF)</span>
                    <ChevronRight size={12} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Publications Attachment PDF Link */}
      <div className="glass p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <FileSpreadsheet className="w-5 h-5 text-secondary" />
          <span>Eksperiment natijalari va ilmiy maqolalar to‘plami (PDF)</span>
        </div>
        <a
          href="/uploads/didactic_opportunities.pdf"
          download="didactic_opportunities.pdf"
          className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-sky-500 transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Maqolani yuklab olish</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}

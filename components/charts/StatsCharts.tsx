'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export const StatsCharts: React.FC = () => {
  const { t } = useLanguage();

  // Experiment Data
  // Low level, Medium level, High level comparison in %
  const data = [
    {
      labelKey: 'lowLevel' as const,
      control: 40,
      experimental: 12,
    },
    {
      labelKey: 'mediumLevel' as const,
      control: 45,
      experimental: 58,
    },
    {
      labelKey: 'highLevel' as const,
      control: 15,
      experimental: 30,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg glow-primary">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mb-2">
        {t.research.statsTitle}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {t.research.statsDesc}
      </p>

      {/* Chart legend */}
      <div className="flex gap-6 mb-8 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-400 dark:bg-slate-500" />
          <span className="text-slate-600 dark:text-slate-300">{t.research.controlGroup}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gradient-to-r from-secondary to-primary" />
          <span className="text-slate-600 dark:text-slate-300">{t.research.experimentalGroup}</span>
        </div>
      </div>

      {/* SVG Responsive Chart */}
      <div className="space-y-6">
        {data.map((item, index) => {
          const label = t.research[item.labelKey];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-xs font-mono text-slate-400">
                  {t.research.controlGroup}: {item.control}% | {t.research.experimentalGroup}: {item.experimental}%
                </span>
              </div>

              <div className="relative h-10 w-full flex flex-col justify-between gap-1">
                {/* Control Group Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800/40 h-4 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.control}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.2, ease: 'easeOut' }}
                  />
                </div>

                {/* Experimental Group Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800/40 h-4 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.experimental}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.2 + 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Theoretical Analysis Card */}
      <div className="mt-8 p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-xl">
        <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
          <strong>Pedagogik xulosa:</strong> Tajriba guruhidagi o‘quvchilar darsda SeeMusic va virtual klaviaturalardan estetik idrok etishda foydalanganlar. Buning natijasida yuqori estetik darajali o‘quvchilar soni an’anaviy darsga qaraganda <strong>ikki barobarga</strong> oshdi, past darajadagi ko‘rsatkich esa 40% dan 12% ga pasaydi. Bu zamonaviy IT vositalarining yuqori didaktik samaradorligini isbotlaydi.
        </p>
      </div>
    </div>
  );
};
export default StatsCharts;

'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Music, FileText, Newspaper, FileDown, Eye, Play, Sparkles, RefreshCw } from 'lucide-react';

interface StatsCounts {
  midis: number;
  pdfs: number;
  software: number;
  news: number;
  downloads: number;
  plays: number;
}

interface StatLog {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

export default function AdminDashboardHome() {
  const [counts, setCounts] = useState<StatsCounts>({
    midis: 0,
    pdfs: 0,
    software: 0,
    news: 0,
    downloads: 0,
    plays: 0,
  });
  const [logs, setLogs] = useState<StatLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.counts) setCounts(data.counts);
        if (data.recentLogs) setLogs(data.recentLogs);
      })
      .catch((err) => console.error('Error loading stats:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getLogBadge = (type: string) => {
    switch (type) {
      case 'DOWNLOAD_MIDI':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-bold">MIDI DOWN</span>;
      case 'DOWNLOAD_PDF':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">PDF DOWN</span>;
      case 'PLAY_MIDI':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-bold">MIDI PLAY</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[9px] font-bold">VIEW</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white font-display">
            Tizim Statistikasi & Boshqaruv
          </h1>
          <p className="text-xs text-slate-400">
            Tadqiqot platformasidagi barcha kontent va faolliklar monitoringi
          </p>
        </div>
        
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Grid count stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: MIDIs */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MIDI fayllar</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block font-display">{counts.midis}</span>
          </div>
        </div>

        {/* Card 2: PDFs */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PDF notalar</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block font-display">{counts.pdfs}</span>
          </div>
        </div>

        {/* Card 3: Total downloads */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jami yuklashlar</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block font-display">{counts.downloads}</span>
          </div>
        </div>

        {/* Card 4: Plays */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MIDI eshittirishlar</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block font-display">{counts.plays}</span>
          </div>
        </div>

      </div>

      {/* Recent Activities Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Logs Table (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-sky-400" />
            <span>Tizimdagi so‘nggi yuklash va tinglash faolliklari</span>
          </h3>

          {logs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Hozircha hech qanday harakat qayd etilmadi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3">Amal turi</th>
                    <th className="pb-3">Fayl nomi/Sarlavha</th>
                    <th className="pb-3">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="text-slate-600 dark:text-slate-300">
                      <td className="py-3 pr-4">{getLogBadge(log.type)}</td>
                      <td className="py-3 pr-4 font-bold">{log.title}</td>
                      <td className="py-3 text-slate-400 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Panel (Right 1 col) */}
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Tezkor Havolalar</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs font-bold">
            <a
              href="/admin/dashboard/midis"
              className="w-full py-3 px-4 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-center cursor-pointer transition-colors"
            >
              Yangi MIDI yuklash
            </a>

            <a
              href="/admin/dashboard/pdfs"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-center cursor-pointer transition-colors"
            >
              Yangi PDF/Nota yuklash
            </a>

            <a
              href="/admin/dashboard/news"
              className="w-full py-3 px-4 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-center cursor-pointer transition-colors"
            >
              Yangi maqola e’lon qilish
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, FileDown, Music, User, Globe, Calendar, Loader2, Play, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import MidiPlayer from '@/components/music/MidiPlayer';
import Link from 'next/link';

interface MidiPiece {
  id: string;
  title: string;
  composer: string;
  description: string;
  grade: number;
  genre: string;
  difficulty: string;
  fileUrl: string;
  fileSize: string;
  duration: string;
  compatSoftware: string[];
  educationalNote: string;
  downloadCount: number;
  playCount: number;
}

const COMPOSERS = [
  {
    id: 'beethoven',
    name: 'Ludwig van Beethoven',
    lifespan: '1770 – 1827',
    country: 'Germaniya',
    image: '/images/composers/beethoven.png',
    description: 'Nemis kompozitori, pianisti va dirijori. Klassik va romantik musiqiy davrlar o\'rtasidagi o\'tish davrining eng muhim namoyandalaridan biri. Eshitish qobiliyatini yo\'qotganiga qaramay, u o\'zining eng buyuk asarlarini, jumladan 9-simfoniyani yaratdi.',
    accent: 'from-amber-500 to-amber-900',
    glow: 'shadow-amber-500/20 border-amber-500/20',
    hoverGlow: 'hover:shadow-amber-500/30 hover:border-amber-500/40',
    bg: 'bg-amber-500/5',
  },
  {
    id: 'mozart',
    name: 'Wolfgang Amadeus Mozart',
    lifespan: '1756 – 1791',
    country: 'Avstriya',
    image: '/images/composers/mozart.png',
    description: 'Avstriyalik buyuk kompozitor, skripkachi va organchi. G\'arb klassik musiqasining eng sermahsul va ta\'sirchan kompozitorlaridan biri. U 5 yoshida ijod qilishni boshlagan va simfoniya, konsert, opera va xor musiqasi janrida 600 dan ortiq asarlar yaratgan.',
    accent: 'from-rose-500 to-rose-900',
    glow: 'shadow-rose-500/20 border-rose-500/20',
    hoverGlow: 'hover:shadow-rose-500/30 hover:border-rose-500/40',
    bg: 'bg-rose-500/5',
  },
  {
    id: 'chopin',
    name: 'Frédéric Chopin',
    lifespan: '1810 – 1849',
    country: 'Polsha',
    image: '/images/composers/chopin.png',
    description: 'Polshalik buyuk kompozitor va pianinochi, musiqiy romantizmning eng yirik vakillaridan biri. U o\'zining deyarli barcha asarlarini fortepiano uchun yozgan bo\'lib, noktyurnlar, valslar va etudlar orqali fortepiano ijrochiligida yangi inqilob qildi.',
    accent: 'from-sky-500 to-sky-900',
    glow: 'shadow-sky-500/20 border-sky-500/20',
    hoverGlow: 'hover:shadow-sky-500/30 hover:border-sky-500/40',
    bg: 'bg-sky-500/5',
  },
  {
    id: 'verdi',
    name: 'Giuseppe Verdi',
    lifespan: '1813 – 1901',
    country: 'Italiya',
    image: '/images/composers/verdi.png',
    description: 'Italiyalik buyuk opera kompozitori, XIX asr Italiya opera maktabining eng yirik namoyandasi. U "Traviata", "Rigoletto" va "Aida" kabi operalari orqali butun dunyoda opera san\'atining cho\'qqisini zabt etdi va Italiya milliy uyg\'onish harakatining ramziga aylandi.',
    accent: 'from-emerald-500 to-emerald-900',
    glow: 'shadow-emerald-500/20 border-emerald-500/20',
    hoverGlow: 'hover:shadow-emerald-500/30 hover:border-emerald-500/40',
    bg: 'bg-emerald-500/5',
  }
];

export default function ClassicalListeningPage() {
  const { t } = useLanguage();
  const [selectedComposer, setSelectedComposer] = useState<string | null>(null);
  const [pieces, setPieces] = useState<MidiPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // Fetch all classical pieces (grade = 0)
  useEffect(() => {
    setLoading(true);
    fetch('/api/midis?grade=0')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPieces(data);
        }
      })
      .catch((err) => console.error('Error fetching classical midis:', err))
      .finally(() => setLoading(false));
  }, []);

  // Reset pagination when selection or filter changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedComposer, searchQuery]);

  // Filter selected composer details
  const composerDetails = useMemo(() => {
    if (!selectedComposer) return null;
    return COMPOSERS.find(c => c.id === selectedComposer) || null;
  }, [selectedComposer]);

  // Filter pieces for the selected composer
  const filteredPieces = useMemo(() => {
    if (!selectedComposer) return [];
    
    // Match notes based on composer name
    let matched = pieces.filter(piece => {
      const compName = piece.composer.toLowerCase();
      if (selectedComposer === 'beethoven') return compName.includes('beethoven');
      if (selectedComposer === 'chopin') return compName.includes('chopin');
      if (selectedComposer === 'mozart') return compName.includes('mozart');
      if (selectedComposer === 'verdi') return compName.includes('verdi');
      return false;
    });

    if (searchQuery.trim() !== '') {
      matched = matched.filter(piece => 
        piece.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return matched;
  }, [pieces, selectedComposer, searchQuery]);

  const displayedPieces = useMemo(() => {
    return filteredPieces.slice(0, visibleCount);
  }, [filteredPieces, visibleCount]);

  // Count how many files each composer has
  const composerCounts = useMemo(() => {
    const counts: Record<string, number> = { beethoven: 0, chopin: 0, mozart: 0, verdi: 0 };
    pieces.forEach(piece => {
      const compName = piece.composer.toLowerCase();
      if (compName.includes('beethoven')) counts.beethoven++;
      else if (compName.includes('chopin')) counts.chopin++;
      else if (compName.includes('mozart')) counts.mozart++;
      else if (compName.includes('verdi')) counts.verdi++;
    });
    return counts;
  }, [pieces]);

  const handleDownload = (piece: MidiPiece) => {
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DOWNLOAD_MIDI', fileUrl: piece.fileUrl, title: piece.title })
    }).catch(() => {});
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-[80vh]">
      
      <AnimatePresence mode="wait">
        {!selectedComposer ? (
          /* ── 1. COMPOSER SELECTION GRID ── */
          <motion.div
            key="composer-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-slate-800 dark:text-white bg-gradient-to-r from-primary via-slate-800 to-secondary dark:from-white dark:via-slate-100 dark:to-sky-300 bg-clip-text text-transparent">
                Musiqa tinglash
              </h1>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                Jahon mumtoz musiqa merosining buyuk namoyandalari ijodi bilan interaktiv virtual pianino hamda MIDI formatlari orqali tanishing.
              </p>
            </div>

            {loading && pieces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <span className="text-xs text-slate-500">Musiqa kutubxonasi yuklanmoqda...</span>
              </div>
            ) : (
              /* Composers Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {COMPOSERS.map((composer) => {
                  const count = composerCounts[composer.id] || 0;
                  return (
                    <motion.div
                      key={composer.id}
                      onClick={() => setSelectedComposer(composer.id)}
                      whileHover={{ y: -6 }}
                      className={`glass rounded-3xl overflow-hidden border shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between group ${composer.glow} ${composer.hoverGlow}`}
                    >
                      {/* Portrait Header */}
                      <div className="relative h-64 overflow-hidden bg-slate-950">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                        <img
                          src={composer.image}
                          alt={composer.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Composer Meta Tag */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-sky-400 border border-slate-700/50 uppercase tracking-wider">
                            {composer.country}
                          </span>
                        </div>

                        {/* Counts Tag */}
                        <div className="absolute bottom-4 right-4 z-20">
                          <span className="px-2.5 py-1 rounded-full bg-secondary/85 text-[10px] font-bold text-white shadow-md">
                            {count} ta asar
                          </span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 bg-white dark:bg-dark-card flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display group-hover:text-secondary dark:group-hover:text-sky-400 transition-colors">
                            {composer.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{composer.lifespan}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {composer.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-secondary dark:text-sky-400">
                          <span>Kuy ro'yxati</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* ── 2. COMPOSER DETAIL VIEW (MIDI list) ── */
          <motion.div
            key="composer-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Back button */}
            <button
              onClick={() => { setSelectedComposer(null); setSearchQuery(''); }}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kompozitorlar ro'yxatiga qaytish</span>
            </button>

            {/* Composer Profile Banner */}
            {composerDetails && (
              <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${composerDetails.accent} opacity-5 dark:opacity-10 blur-3xl pointer-events-none`} />
                
                {/* Image */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-slate-950 flex-shrink-0 shadow-lg border border-slate-200 dark:border-slate-800">
                  <img
                    src={composerDetails.image}
                    alt={composerDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
                      {composerDetails.name}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {composerDetails.lifespan}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                      <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {composerDetails.country}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                      <span className="flex items-center gap-1 text-sky-400 font-bold"><Music className="w-3.5 h-3.5" /> {filteredPieces.length} ta asar</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {composerDetails.description}
                  </p>
                </div>
              </div>
            )}

            {/* Filter toolbar inside composer */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-dark-card/20 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Asar nomini qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                />
              </div>

              <div className="text-xs text-slate-400">
                Mumtoz musiqa MIDI fayllari virtual fortepianoga to'liq integratsiya qilingan.
              </div>
            </div>

            {/* MIDI Pieces List */}
            {filteredPieces.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <Music className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {searchQuery ? "Qidiruv bo'yicha hech qanday asar topilmadi." : "Ushbu kompozitor uchun asarlar yuklanmoqda yoki topilmadi."}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPieces.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                            Klassika
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <FileDown className="w-3 h-3" /> {item.fileSize}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white font-display truncate" title={item.title}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {item.composer}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* MIDI Synthesizer Player */}
                      <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                        <MidiPlayer
                          fileUrl={item.fileUrl}
                          title={item.title}
                          composer={item.composer}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPieces.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-800/60 cursor-pointer shadow-md hover:shadow-lg"
                    >
                      Ko'proq yuklash ({filteredPieces.length - visibleCount} ta asar qoldi)
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

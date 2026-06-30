'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, BookOpen, FileDown, Music, Award, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import MidiPlayer from '@/components/music/MidiPlayer';

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

export default function MidiLibraryPage() {
  const { t } = useLanguage();
  const [pieces, setPieces] = useState<MidiPiece[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  // Fetch all MIDI files
  useEffect(() => {
    fetchMidis();
  }, []);

  const fetchMidis = () => {
    setLoading(true);
    fetch('/api/midis')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPieces(data);
        }
      })
      .catch((err) => console.error('Error fetching library:', err))
      .finally(() => setLoading(false));
  };

  const activePieces = pieces;

  // Extract unique genres for filters
  const genres = ['all', ...Array.from(new Set(activePieces.map((p) => p.genre)))];

  // Filtering Logic
  const filteredPieces = activePieces.filter((piece) => {
    const matchesSearch = 
      piece.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      piece.composer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || piece.grade.toString() === selectedGrade;
    const matchesDifficulty = selectedDifficulty === 'all' || piece.difficulty.toUpperCase() === selectedDifficulty.toUpperCase();
    const matchesGenre = selectedGenre === 'all' || piece.genre === selectedGenre;

    return matchesSearch && matchesGrade && matchesDifficulty && matchesGenre;
  });

  const handleDownload = (piece: MidiPiece) => {
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DOWNLOAD_MIDI', fileUrl: piece.fileUrl, title: piece.title })
    }).catch(() => {});
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
            {t.midiLib.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.midiLib.subtitle}
          </p>
        </div>
        
        <button
          onClick={fetchMidis}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass p-6 rounded-2xl glow-primary space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3 text-slate-700 dark:text-slate-300">
          <SlidersHorizontal className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wider">{t.common.filter}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.midiLib.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors cursor-pointer"
            >
              <option value="all">{t.common.grade}: {t.common.all}</option>
              <option value="5">5-{t.common.grade.toLowerCase()}</option>
              <option value="6">6-{t.common.grade.toLowerCase()}</option>
              <option value="7">7-{t.common.grade.toLowerCase()}</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors cursor-pointer"
            >
              <option value="all">{t.common.genre}: {t.common.all}</option>
              {genres.filter(g => g !== 'all').map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors cursor-pointer"
            >
              <option value="all">{t.common.difficulty}: {t.common.all}</option>
              <option value="EASY">{t.common.easy}</option>
              <option value="MEDIUM">{t.common.medium}</option>
              <option value="HARD">{t.common.hard}</option>
            </select>
          </div>

        </div>
      </div>

      {/* MIDI List Output */}
      {loading ? (
        <div className="text-center py-24 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <span className="text-xs text-slate-400">{t.common.loading}</span>
        </div>
      ) : filteredPieces.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800">
          <Music className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t.common.noData}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -2 }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 text-[9px] font-bold uppercase">
                    {t.common.grade} {piece.grade}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FileDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>{piece.downloadCount} {t.common.downloads.toLowerCase()}</span>
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-800 dark:text-white font-display truncate">
                  {piece.title}
                </h3>
                
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{piece.composer}</span>
                  <span>{piece.duration}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {piece.description}
                </p>

                {/* Compatibility Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {piece.compatSoftware.map((sw) => (
                    <span
                      key={sw}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-medium"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Player and Download buttons */}
              <div className="space-y-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60">
                <MidiPlayer
                  fileUrl={piece.fileUrl}
                  title={piece.title}
                  composer={piece.composer}
                />
                
                <a
                  href={piece.fileUrl}
                  download={`${piece.title}.mid`}
                  onClick={() => handleDownload(piece)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{t.common.download} MIDI ({piece.fileSize})</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

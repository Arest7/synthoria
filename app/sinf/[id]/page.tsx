'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music, FileDown, BookOpen, Layers, Award, ShieldAlert, Heart, Play, ChevronDown } from 'lucide-react';
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
  compatSoftware: string[];
  educationalNote: string;
  downloadCount: number;
}

export default function GradePage() {
  const params = useParams();
  const { t } = useLanguage();
  const gradeId = parseInt(params.id as string) || 5;

  const [pieces, setPieces] = useState<MidiPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedNotes, setExpandedNotes] = useState<{ [id: string]: boolean }>({});

  // Fetch pieces for this grade
  useEffect(() => {
    setLoading(true);
    fetch(`/api/midis?grade=${gradeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPieces(data);
        }
      })
      .catch((err) => console.error('Error fetching grade pieces:', err))
      .finally(() => setLoading(false));
  }, [gradeId]);

  // Fallback seed pieces if DB empty
  const localSeedPieces: { [grade: number]: MidiPiece[] } = {
    5: [
      {
        id: '1',
        title: 'Vatanim',
        composer: 'Shermat Yormatov',
        description: 'O‘zbekiston vatanparvarlik ruhidagi eng mashhur bolalar qo‘shiqlaridan biri. Kuy mayin, tantanavor va yorqin ohanglarga boy.',
        grade: 5,
        genre: 'Bolalar qo‘shig‘i / Vatanparvarlik',
        difficulty: 'EASY',
        fileUrl: '/uploads/vatanim.mid',
        compatSoftware: ['SeeMusic', 'Synthesia', 'vanBasco'],
        educationalNote: 'Bu qo‘shiq o‘quvchilarda Vatan tuyg‘usini, jo‘r ovozda kuylash va ritmni to‘g‘ri saqlash ko‘nikmalarini rivojlantiradi. Asar lya minor tonalligida bo‘lib, boshlang‘ich pianino ijrochilariga mos keladi.',
        downloadCount: 45
      },
      {
        id: '2',
        title: 'Chamanzor',
        composer: 'Folklor kuy',
        description: 'O‘zbek xalq musiqa merosiga mansub quvnoq va sho‘x ohangli xalq qo‘shig‘i. Ritmik harakatlari va milliy bezaklari bilan ajralib turadi.',
        grade: 5,
        genre: 'Xalq musiqasi / Milliy kuy',
        difficulty: 'MEDIUM',
        fileUrl: '/uploads/chamanzor.mid',
        compatSoftware: ['Synthesia', 'Midiano', 'ProfM-2DRUM'],
        educationalNote: 'Xalq musiqasining milliy bezaklarini (nolalarni) IT dasturlari orqali ko‘rish va his etish uchun juda qulay asar. Ritmik asosi doira zarblari bilan boyitilgan.',
        downloadCount: 29
      }
    ],
    6: [
      {
        id: '3',
        title: 'Bahor keldi',
        composer: 'Soli Aliyev',
        description: 'Tabiat go‘zalligi va bahor faslining tarovatini madh etuvchi yengil va quvnoq bolalar qo‘shiqlaridan biri.',
        grade: 6,
        genre: 'Klassik bolalar musiqasi',
        difficulty: 'MEDIUM',
        fileUrl: '/uploads/bahor_keldi.mid',
        compatSoftware: ['SeeMusic', 'Synthesia', 'Midiano'],
        educationalNote: 'Ushbu asar yordamida o‘quvchilar tempning o‘zgarishi (accelerando, ritardando) va lirik ohang tarovatini IT dasturlaridagi vizual to‘lqinlar orqali o‘rganadilar.',
        downloadCount: 32
      },
      {
        id: '5',
        title: 'Ko‘cha bog‘lari',
        composer: 'Xalq musiqa merosi',
        description: 'Sho‘x, jozibador va murakkab ritmlarga ega bo‘lgan o‘zbek xalq kuyi.',
        grade: 6,
        genre: 'Xalq musiqasi / Ritmik kuy',
        difficulty: 'HARD',
        fileUrl: '/uploads/kocha_boglari.mid',
        compatSoftware: ['Synthesia', 'ProfM-2DRUM', 'Kanto Player'],
        educationalNote: 'Bu asar o‘quvchilarga murakkab sinkopali ritmlarni va milliy zarblarni baraban va doira dasturlarida mashq qilishga yordam beradi.',
        downloadCount: 18
      }
    ],
    7: [
      {
        id: '4',
        title: 'Tanovar',
        composer: 'Xalq kuyi',
        description: 'O‘zbek mumtoz musiqasining eng yuksak namunalaridan biri. Lirik va chuqur estetik ma’noga ega bo‘lgan asar.',
        grade: 7,
        genre: 'Mumtoz kuy / Maqom yo‘li',
        difficulty: 'HARD',
        fileUrl: '/uploads/tanovar.mid',
        compatSoftware: ['SeeMusic', 'Synthesia', 'Midiano'],
        educationalNote: '7-sinf o‘quvchilarining oliy estetik didini rivojlantirishga xizmat qiladi. Murakkab ohanglar, yarim tonlar va chuqur hissiy ifodalarni tahlil qilish uchun eng to‘g‘ri namuna.',
        downloadCount: 68
      },
      {
        id: '6',
        title: 'O‘zbekiston',
        composer: 'Mutal Burhonov',
        description: 'O‘zbekiston kompozitorlik maktabining durdona asarlaridan biri. Kuchli dinamika va jo‘shqin akkordlarga ega.',
        grade: 7,
        genre: 'Akademik musiqa / Simfonik',
        difficulty: 'HARD',
        fileUrl: '/uploads/ozbekiston.mid',
        compatSoftware: ['SeeMusic', 'Synthesia', 'Kanto Player'],
        educationalNote: 'Asarda polifoniya elementlari va uyg‘unlik darslariga oid materiallar mavjud. O‘quvchilar bir necha ovozlarning (partiyalarning) birgalikda chiroyli ijro etilishini tahlil qiladilar.',
        downloadCount: 42
      }
    ]
  };

  const activePieces = pieces.length > 0 ? pieces : (localSeedPieces[gradeId] || []);

  // Toggle Educational Note details
  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Favorites
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(item => item !== id));
    } else {
      setFavorites(prev => [...prev, id]);
    }
  };

  const handleDownload = (piece: MidiPiece) => {
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'DOWNLOAD_MIDI', fileUrl: piece.fileUrl, title: piece.title })
    }).catch(() => {});
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Grade Header */}
      <div className="glass p-8 rounded-3xl glow-primary space-y-4">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
            <Layers className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {gradeId === 5 ? t.grade.title5 : gradeId === 6 ? t.grade.title6 : t.grade.title7}
            </h1>
            <p className="text-xs text-slate-400">
              {t.common.grade} {gradeId} • Musiqa madaniyati darsligi asosida
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {gradeId === 5 ? t.grade.desc5 : gradeId === 6 ? t.grade.desc6 : t.grade.desc7}
        </p>
      </div>

      {/* Main Grid display of pieces */}
      {activePieces.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.grade.noPieces}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activePieces.map((piece) => {
            const isNotesOpen = expandedNotes[piece.id];
            
            return (
              <motion.div
                key={piece.id}
                className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                whileHover={{ y: -3 }}
              >
                {/* Card Header (Title & tags) */}
                <div className="p-6 space-y-4 flex-grow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-display">
                        {piece.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {piece.composer}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(piece.id)}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                          favorites.includes(piece.id)
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(piece.id) ? 'fill-rose-500' : ''}`} />
                      </button>
                      
                      {/* Difficulty badge */}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getDifficultyColor(piece.difficulty)}`}>
                        {piece.difficulty === 'EASY' ? t.common.easy : piece.difficulty === 'MEDIUM' ? t.common.medium : t.common.hard}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {piece.description}
                  </p>

                  {/* Software compatibility tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {piece.compatSoftware.map((sw) => (
                      <span
                        key={sw}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-medium"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic MIDI Player */}
                  <div className="pt-4">
                    <MidiPlayer
                      fileUrl={piece.fileUrl}
                      title={piece.title}
                      composer={piece.composer}
                    />
                  </div>
                </div>

                {/* Card Footer actions (Download and Expandable notes) */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 p-4 space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    
                    {/* Expand/Collapse Methodical Notes */}
                    <button
                      onClick={() => toggleNotes(piece.id)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-secondary" />
                      <span>{t.grade.eduNotes}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isNotesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* MIDI Download Button */}
                    <a
                      href={piece.fileUrl}
                      download={`${piece.title}.mid`}
                      onClick={() => handleDownload(piece)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-[10px] font-bold hover:bg-sky-500 transition-colors shadow-sm cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>MIDI {t.common.download}</span>
                    </a>

                  </div>

                  {/* Expandable Academic Notes */}
                  {isNotesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-slate-600 dark:text-slate-400 bg-sky-50/40 dark:bg-sky-950/10 border border-sky-100/40 dark:border-sky-900/20 p-3.5 rounded-xl space-y-1.5"
                    >
                      <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Darsdagi didaktik qo‘llanilishi:</span>
                      </div>
                      <p className="leading-relaxed text-[11px]">
                        {piece.educationalNote}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Music, Laptop, Award, ArrowRight, Play, FileDown, CheckCircle } from 'lucide-react';
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
  downloadCount: number;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredMidis, setFeaturedMidis] = useState<MidiPiece[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured MIDIs — API now always returns data (DB or local JSON store)
  useEffect(() => {
    fetch('/api/midis?featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeaturedMidis(data.slice(0, 3));
        }
      })
      .catch((err) => console.error('Error fetching featured midis:', err))
      .finally(() => setLoading(false));
  }, []);

  const localFeatured = featuredMidis;

  return (
    <div className="w-full relative overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-950 via-primary/80 to-slate-900 text-white flex flex-col justify-between pt-20 overflow-hidden">
        
        {/* Animated grid/matrix background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* MIDI wave sphere graphic */}
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-pulse-slow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-12">
          <div className="max-w-3xl space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-3 py-1.5 rounded-full bg-secondary/25 text-sky-300 text-xs font-semibold tracking-wide uppercase border border-secondary/30">
                🎓 PhD Dissertatsiyasi
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl font-extrabold font-display leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {t.home.heroTitle}
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-slate-300 font-medium max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t.home.heroSubtitle}
            </motion.p>

            <motion.div
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl text-slate-200 text-xs md:text-sm leading-relaxed shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <p className="font-semibold italic leading-relaxed">
                “{t.home.heroConcept}”
              </p>
            </motion.div>

            {/* CTAs Grade Links */}
            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Link href="/sinf/5" className="px-6 py-3 rounded-xl bg-secondary hover:bg-sky-400 text-white font-bold text-sm shadow-lg hover:shadow-sky-500/20 transition-all cursor-pointer">
                {t.home.cta5}
              </Link>
              <Link href="/sinf/6" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer">
                {t.home.cta6}
              </Link>
              <Link href="/sinf/7" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer">
                {t.home.cta7}
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Abstract Piano Keyboard Bottom graphic */}
        <div className="w-full h-24 bg-slate-900 border-t border-slate-800 flex relative mt-12 overflow-hidden opacity-80 select-none">
          {Array.from({ length: 48 }).map((_, idx) => {
            const isBlack = [1, 3, 6, 8, 10].includes(idx % 12);
            return (
              <div
                key={idx}
                className={`h-full border-r transition-all duration-300 ${
                  isBlack 
                    ? 'bg-slate-950 border-slate-800 w-[1.5%] h-3/5 z-20' 
                    : 'bg-white border-slate-200 w-[2.5%] z-10 hover:bg-sky-100'
                }`}
              />
            );
          })}
        </div>

      </section>

      {/* 2. ADVANTAGES SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-dark-bg/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.home.advantagesTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.home.advantagesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="glass p-6 rounded-2xl glow-primary hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">
                {t.home.adv1Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.home.adv1Desc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass p-6 rounded-2xl glow-secondary hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">
                {t.home.adv2Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.home.adv2Desc}
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass p-6 rounded-2xl glow-primary hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">
                {t.home.adv3Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.home.adv3Desc}
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass p-6 rounded-2xl glow-secondary hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">
                {t.home.adv4Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.home.adv4Desc}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED MIDI LIBRARY */}
      <section className="py-20 bg-white dark:bg-dark-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
                {t.home.featuredMidi}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.home.featuredMidiSub}
              </p>
            </div>
            <Link href="/midi-library" className="text-xs font-bold text-secondary hover:text-primary dark:hover:text-sky-400 flex items-center gap-1 cursor-pointer">
              <span>{t.common.all} {t.nav.midiLibrary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured MIDI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {localFeatured.map((item) => (
              <div key={item.id} className="flex flex-col justify-between bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md p-6 hover:shadow-lg transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-500 text-[10px] font-bold uppercase">
                      {t.common.grade} {item.grade}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <FileDown className="w-3 h-3" /> {item.downloadCount} {t.common.downloads}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white font-display truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {item.composer}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                
                {/* Embedded MIDI Synth Player */}
                <div className="mt-6">
                  <MidiPlayer
                    fileUrl={item.fileUrl}
                    title={item.title}
                    composer={item.composer}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3.5. CLASSICAL MUSIC ROOM SECTION (Musiqa tinglash) */}
      <section className="py-20 bg-slate-50 dark:bg-dark-bg/20 border-t border-b border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass p-8 md:p-12 rounded-3xl glow-primary flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left side: text details */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider">
                🎵 Mumtoz Musiqa Merosi
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white font-display leading-tight">
                Jahon klassik musiqasini interaktiv tinglang
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Darslik kuylari bilan birga, dunyo tan olgan buyuk kompozitorlar — <strong>Lyudvig van Betxoven, Volfgang Amadey Motsart, Frederik Shopen</strong> va <strong>Juzeppe Verdi</strong> ijodiga mansub o'nlab asarlarning interaktiv MIDI to'plami. Ularni tinglang, virtual klaviatura orqali tahlil qiling va musiqiy estetik idrokingizni rivojlantiring.
              </p>
              
              <div className="pt-4 flex justify-center lg:justify-start">
                <Link
                  href="/musiqa-tinglash"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg hover:shadow-sky-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play size={14} className="fill-white text-white" />
                  <span>Musiqa tinglash xonasiga kirish</span>
                </Link>
              </div>
            </div>

            {/* Right side: Mosaic portraits of composers */}
            <div className="flex-1 w-full max-w-md grid grid-cols-2 gap-4">
              {[
                { name: 'Beethoven', img: '/images/composers/beethoven.png', glow: 'hover:shadow-amber-500/20 hover:border-amber-500/30' },
                { name: 'Mozart', img: '/images/composers/mozart.png', glow: 'hover:shadow-rose-500/20 hover:border-rose-500/30' },
                { name: 'Chopin', img: '/images/composers/chopin.png', glow: 'hover:shadow-sky-500/20 hover:border-sky-500/30' },
                { name: 'Verdi', img: '/images/composers/verdi.png', glow: 'hover:shadow-emerald-500/20 hover:border-emerald-500/30' }
              ].map((c) => (
                <Link
                  key={c.name}
                  href="/musiqa-tinglash"
                  className={`relative h-28 md:h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group cursor-pointer transition-all duration-300 ${c.glow}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="text-[10px] md:text-xs font-bold text-white tracking-wide font-display block">
                      {c.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. IT EDUCATIONAL PROGRAMS (SHORT CUT) */}
      <section className="py-20 bg-slate-50 dark:bg-dark-bg/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.home.itIntro}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.home.itIntroSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-2xl border border-pink-500/10 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center text-sm font-bold mb-4">
                SM
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">SeeMusic</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                MIDI yozuvlarini 3D yorug‘lik effektlari va rangli zarrachalar bilan vizualizatsiya qiluvchi zamonaviy dastur.
              </p>
              <Link href="/it-programs#seemusic" className="text-xs font-bold text-pink-500 hover:underline flex items-center gap-1 cursor-pointer">
                <span>{t.common.details}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="glass p-6 rounded-2xl border border-blue-500/10 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm font-bold mb-4">
                SY
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">Synthesia</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                O‘quvchilar uchun klavishlarni bosish tartibini o‘yin shaklida o‘rgatuvchi ko‘rgazmali pianino repetitori.
              </p>
              <Link href="/it-programs#synthesia" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer">
                <span>{t.common.details}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="glass p-6 rounded-2xl border border-emerald-500/10 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold mb-4">
                MD
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">Midiano</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Qurilmaga o‘rnatishni talab qilmaydigan, to‘g‘ridan-to‘g‘ri brauzerda ishlovchi interaktiv virtual pianino.
              </p>
              <Link href="/it-programs#midiano" className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer">
                <span>{t.common.details}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SCIENTIFIC RESEARCH SUMMARIZED */}
      <section className="py-20 bg-white dark:bg-dark-card/20 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-8 md:p-12 rounded-3xl glow-primary flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block">
                {t.nav.research}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display leading-tight">
                {t.research.purpose}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.research.purposeDesc}
              </p>
              <div className="pt-4">
                <Link href="/research" className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-md hover:shadow-sky-500/20 transition-all inline-flex items-center gap-2 cursor-pointer">
                  <span>Tadqiqot natijalarini ko‘rish</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Visual Statistics Badge */}
            <div className="w-48 h-48 rounded-full bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none" />
              <span className="text-xs text-slate-400 tracking-wider">ESTETIK IDROK</span>
              <span className="text-4xl font-black text-sky-400 font-display my-1">+24%</span>
              <span className="text-[9px] text-slate-500 leading-tight">AKT integratsiyasi dars samaradorligini oshirdi</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

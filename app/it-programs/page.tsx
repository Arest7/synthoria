'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, ExternalLink, ShieldCheck, HelpCircle, Check, Info, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Software {
  name: string;
  slug: string;
  iconColor: string;
  description: string;
  purpose: string;
  eduValue: string;
  advantages: string[];
  howToUse: string;
  formats: string[];
  websiteUrl: string;
}

export default function ItProgramsPage() {
  const { t } = useLanguage();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // 7 core educational programs requested by the user
  const programs: Software[] = [
    {
      name: 'SeeMusic',
      slug: 'seemusic',
      iconColor: 'from-pink-500 to-rose-500 bg-pink-500',
      description: 'SeeMusic musiqa ijrosini 3D pianino klaviaturasi animatsiyalari, tushuvchi notalar va rang-barang vizual effektlar ko‘rinishida tasvirlovchi ilg‘or dasturdir.',
      purpose: 'Musiqa darslarida o‘quvchilarning badiiy-estetik his-tuyg‘ularini vizual shakllar va ranglar uyg‘unligi orqali boyitish.',
      eduValue: 'Tovush balandligi, ritm va dinamikani ko‘rgazmali tarzda tushuntiradi. O‘quvchilar asar ritmini ranglar tezligi va klavishlarning porlashi orqali vizual tarzda idrok etadilar. Bu eshitish va ko‘rish retseptorlarini birlashtirib, dars samaradorligini keskin oshiradi.',
      advantages: [
        'Musiqiy videolarni tezda yaratish va darslarda ko‘rgazmali vosita sifatida foydalanish.',
        'MIDI klaviatura bilan sinxronizatsiya qilinib, chalish jarayonini real vaqtda animatsiya qilish.',
        'O‘quvchilarning estetik dunyoqarashini va badiiy ijodkorligini rivojlantirish.',
        'Har bir musiqa asariga mos alohida ranglar va zarrachalar spektrini sozlash imkoniyati.'
      ],
      howToUse: 'Musiqa o‘qituvchisi darslikdagi kuyning MIDI variantini SeeMusic dasturiga yuklaydi. O‘quvchilar ekranda o‘sha kuyning 3D formatdagi chiroyli animatsiyasini (yorug‘lik to‘lqinlari, yulduzchalar) tomosha qilib, asarning hissiy mazmunini tushunib yetadilar.',
      formats: ['MIDI', 'MP4', 'WAV'],
      websiteUrl: 'https://www.visualmusicdesign.com/',
    },
    {
      name: 'Synthesia',
      slug: 'synthesia',
      iconColor: 'from-blue-500 to-indigo-500 bg-blue-500',
      description: 'Synthesia - bu pianino chalish ko‘nikmalarini o‘yinlashtirilgan interfeys yordamida o‘rgatuvchi jahondagi eng mashhur dasturiy ta’minotdir.',
      purpose: 'O‘quvchilarda pianino chalish amaliy ko‘nikmalarini notalarsiz, o‘yin tarzida shakllantirish.',
      eduValue: 'Klavishlarni to‘g‘ri bosish ketma-ketligini va asar ritmini osongina o‘zlashtirishga yordam beradi. Dastur xatolarni avtomatik qayd etib, o‘quvchilarga o‘z ustida mustaqil representsiyalar o‘tkazish va o‘z-o‘zini baholash imkonini beradi.',
      advantages: [
        'Tushuvchi rangli yo‘llar orqali notalarsiz pianinoda kuy ijro etishni o‘rganish.',
        'Chap va o‘ng qo‘l mashqlarini alohida tempda (tezlikda) mashq qilish rejimining mavjudligi.',
        'Maxsus ballar tizimi orqali dars jarayonini o‘yinlashtirish (gamification).',
        'Minglab tayyor MIDI darsliklar va mashqlarning qo‘llab-quvvatlanishi.'
      ],
      howToUse: 'O‘quvchilar sinfdagi raqamli pianinoni (yoki kompyuter klaviaturasini) Synthesia dasturiga ulaydilar. Ekrandan tushayotgan rangli yo‘nalishlar bo‘ylab to‘g‘ri klavishlarni bosib, kuy chalishni o‘rganadilar. Dastur ularning aniqligini foizlarda baholaydi.',
      formats: ['MIDI', 'MusicXML'],
      websiteUrl: 'https://www.synthesiagame.com/',
    },
    {
      name: 'Midiano',
      slug: 'midiano',
      iconColor: 'from-emerald-500 to-teal-500 bg-emerald-500',
      description: 'Midiano - bu hech qanday dasturni kompyuterga o‘rnatmasdan, to‘g‘ridan-to‘g‘ri brauzerda ishlovchi virtual pianino va MIDI pleyerdir.',
      purpose: 'Sinfda pianino asbobi yetishmagan hollarda yoki darsdan tashqari vaqtlarda o‘quvchilar uchun qulay virtual asbob taqdim etish.',
      eduValue: 'Oddiy kompyuter klaviaturasi orqali pianino chalish imkoniyatini yaratadi. O‘quvchilarda kompyuter texnologiyalari yordamida musiqiy asarlar yaratish va chalish qiziqishini uyg‘otadi.',
      advantages: [
        'Brauzer orqali yuklanuvchi yengil interfeys (mobil qurilmalarda ham ishlaydi).',
        'Kompyuter klaviaturasidagi harflarga moslashtirilgan oson klavishlar boshqaruvi.',
        'Muzikani yozib olish (record) va MIDI fayllarni yuklab chalish.',
        'Musiqiy tovushlarni real vaqtda chiroyli vizualizatsiya qilish.'
      ],
      howToUse: 'Smartfon, planshet yoki kompyuter orqali Midiano saytiga kiriladi. O‘quvchilar ekrandagi virtual tugmalar yoki klaviaturadagi tugmachalarni bosib, oddiy kuylarni (masalan, "Vatanim" qo‘shig‘ining boshlanish akkordlarini) mashq qiladilar.',
      formats: ['MIDI'],
      websiteUrl: 'https://midiano.com/',
    },
    {
      name: 'Note Bounce',
      slug: 'note-bounce',
      iconColor: 'from-amber-500 to-orange-500 bg-amber-500',
      description: 'Note Bounce - musiqa ritmi va tovush to‘lqinlarini jozibador sakrovchi to‘plar fizikasi orqali tasvirlovchi interaktiv dastur.',
      purpose: 'O‘quvchilarning ritmik sezgisini va dinamik idrokini rivojlantirish.',
      eduValue: 'Ritmik zarblarning vizual masofalar bilan aloqadorligini tushuntiradi. Musiqadagi har bir zarb va akkord ekrandagi chiroyli to‘plarning turli balandlikda sakrab, tovush chiqarishiga sabab bo‘ladi. Ritmik mashqlarni qiziqarli qiladi.',
      advantages: [
        'Ritm va dinamikani ko‘rgazmali tarzda fizik harakatlar orqali tushunish.',
        'Boshlang‘ich sinf o‘quvchilari uchun darsga jalb etish darajasining yuqoriligi.',
        'Ritmik asarlar uchun tayyor andozalarni tezda ishga tushirish imkoniyati.'
      ],
      howToUse: 'Darsda ritm va taktlarni o‘tish jarayonida Note Bounce vizualizatsiyasi yoqiladi. O‘quvchilar to‘plarning to‘siqlardan sakrab o‘tishi bilan darslikdagi qo‘shiq ritmini sinxron ravishda chapak chalib takrorlaydilar.',
      formats: ['MIDI'],
      websiteUrl: 'https://notebounce.com/',
    },
    {
      name: 'vanBasco Karaoke Player',
      slug: 'vanbasco',
      iconColor: 'from-violet-500 to-purple-500 bg-violet-500',
      description: 'vanBasco Karaoke Player - bu matnli MIDI va KAR formatidagi fayllarni ijro etish va darsda birgalikda qo‘shiq kuylash uchun mo‘ljallangan eng yengil, klassik pleyerdir.',
      purpose: 'Musiqa darslarida jamoaviy (xor) va yakkaxon kuylash faoliyatini mukammal tashkil etish.',
      eduValue: 'O‘quvchilarning vokal-xor ijrochiligi ko‘nikmalarini rivojlantiradi. Tonallikni (key) o‘zgartirish orqali o‘qituvchi qo‘shiqni o‘quvchilarning ovoz diapazoniga moslashtira oladi. Tempni o‘zgartirish orqali esa asarni sekinroq o‘rganish mumkin.',
      advantages: [
        'Karaoke (matnli) MIDI fayllarini to‘liq qo‘llab-quvvatlashi va ekranga chiqarishi.',
        'Musiqa tempini (tezligini) va tonalligini dars davomida tezda sozlash imkoniyati.',
        'MIDI kanallarini (masalan, faqat pianino yoki faqat baraban) alohida yoqish/o‘chirish.',
        'Tizim talablarining o‘ta pastligi (har qanday eski maktab kompyuterida ham ishlaydi).'
      ],
      howToUse: 'O‘qituvchi darsda o‘tilayotgan xor qo‘shig‘ining karaoke MIDI variantini yuklaydi. O‘quvchilar doskadagi yuguruvchi matnga qarab, chiroyli fon musiqasi (minusovka) ostida jo‘r ovozda kuylaydilar.',
      formats: ['MIDI', 'KAR'],
      websiteUrl: 'http://www.vanbasco.com/',
    },
    {
      name: 'Kanto Player',
      slug: 'kanto-player',
      iconColor: 'from-cyan-500 to-sky-500 bg-cyan-500',
      description: 'Kanto Player - zamonaviy formatlar (MIDI, MP3, CDG, MP4) bilan ishlovchi professional multimedia va karaoke pleyeri.',
      purpose: 'Maktab tadbirlarida va musiqa darslarida yuqori sifatli audio va video kontent taqdim etish.',
      eduValue: 'O‘quvchilarda multimedia texnologiyalarini amaliy qo‘llash ko‘nikmalarini shakllantiradi. Musiqaning sifatli va estetik jihatdan chiroyli ijro etilishini ta’minlaydi.',
      advantages: [
        'MIDI, KAR, MP3 va video formatlarini birlashtirgan universal pleyer.',
        'Qo‘shiqlarning navbati bilan silliq o‘tishi (crossfade) va pleylistlar tizimi.',
        'Ovoz yozish va yuqori sifatli audio-mikser funksiyalarining mavjudligi.'
      ],
      howToUse: 'Dars yakunida qo‘shiq kuylash musobaqalari tashkil etilganda yoki maktab sahnasidagi tadbirlarda fon musiqalarini boshqarish va o‘quvchilar ijrolarini yozib olish uchun ishlatiladi.',
      formats: ['MIDI', 'KAR', 'MP3', 'WAV', 'MP4'],
      websiteUrl: 'https://www.kantokaraoke.com/',
    },
    {
      name: 'ProfM-2DRUM',
      slug: 'profm-2drum',
      iconColor: 'from-amber-600 to-yellow-600 bg-amber-600',
      description: 'ProfM-2DRUM - bu o‘quvchilarga ritm va turli zarbli cholg‘u asboblari (baraban, doira) andozalarini o‘rgatuvchi virtual zarbli asboblar simulyatoridir.',
      purpose: 'O‘quvchilarning ritmik sezgisini va zarbli cholg‘u asboblarida chalish malakasini oshirish.',
      eduValue: 'Musiqiy o‘lchovlarni (2/4, 3/4, 4/4 va hokazo) va har xil ritm andozalarini (milliy usullar, doira zarblari) vizual klaviatura orqali tushuntiradi. O‘quvchining poliritmik tafakkurini boyitadi.',
      advantages: [
        'Virtual zarbli cholg‘ular klaviaturasi va yuqori sifatli ovoz kutubxonasi.',
        'Tayyor milliy va jahon ritmlari andozalari bazasi.',
        'Ritm va tempni o‘quvchi o‘zi o‘zgartirib mashq qilishi qulayligi.'
      ],
      howToUse: 'O‘quvchilar ekran orqali doira yoki baraban tasvirlarini bosib, ritm takrorlaydilar. Darslikdagi ritmik mashqlarni ushbu virtual simulyatorda chalib, o‘zlarini sinab ko‘radilar.',
      formats: ['MIDI', 'WAV'],
      websiteUrl: '#',
    }
  ];

  const toggleDetails = (slug: string) => {
    setActiveSlug(activeSlug === slug ? null : slug);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="glass p-8 rounded-3xl glow-primary space-y-3">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.itPrograms.title}
            </h1>
            <p className="text-xs text-slate-400">
              Musiqa madaniyati ta’limini raqamlashtirish vositalari
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t.itPrograms.subtitle}
        </p>
      </div>

      {/* Software Program Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {programs.map((sw) => {
          const isOpen = activeSlug === sw.slug;
          
          return (
            <motion.div
              key={sw.slug}
              id={sw.slug}
              className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg overflow-hidden transition-all duration-300 flex flex-col justify-between scroll-mt-24"
              whileHover={{ y: -3 }}
            >
              <div className="p-6 space-y-4">
                
                {/* Card Title & Icon block */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${sw.iconColor} text-white flex items-center justify-center text-base font-bold shadow-md`}>
                    {sw.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-display">
                      {sw.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sw.formats.map((f) => (
                        <span key={f} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[8px] font-bold rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sw.description}
                </p>

                {/* Purpose section */}
                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    {t.itPrograms.purpose}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {sw.purpose}
                  </p>
                </div>

                {/* Expand / Collapse triggers */}
                {isOpen ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60"
                  >
                    {/* Educational Value */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-secondary" />
                        <span>{t.itPrograms.eduValue}</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {sw.eduValue}
                      </p>
                    </div>

                    {/* How to use */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-secondary" />
                        <span>{t.itPrograms.howToUse}</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {sw.howToUse}
                      </p>
                    </div>

                    {/* Advantages */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                        <span>{t.itPrograms.advantages}</span>
                      </span>
                      <ul className="space-y-1.5">
                        {sw.advantages.map((adv, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </motion.div>
                ) : null}

              </div>

              {/* Footer actions */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4 flex justify-between items-center">
                
                <button
                  onClick={() => toggleDetails(sw.slug)}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-sky-400 cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5 text-secondary" />
                  <span>{isOpen ? 'Ma’lumotlarni yopish' : t.common.details}</span>
                </button>

                {sw.websiteUrl !== '#' ? (
                  <a
                    href={sw.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-secondary hover:text-primary dark:hover:text-sky-400 cursor-pointer"
                  >
                    <span>{t.itPrograms.visitWebsite}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400">Offline virtual asbob</span>
                )}

              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

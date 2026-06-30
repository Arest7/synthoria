'use client';

import React, { useState } from 'react';
import { BookOpen, GraduationCap, ChevronDown, Award, Bookmark, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MethodItem {
  id: string;
  titleKey: 'sec1' | 'sec2' | 'sec3' | 'sec4' | 'sec5' | 'sec6' | 'sec7';
  icon: React.ReactNode;
  description: string;
  details: string[];
  references: string[];
}

export default function MethodologyPage() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);

  const methods: MethodItem[] = [
    {
      id: '1',
      titleKey: 'sec1',
      icon: <GraduationCap className="w-5 h-5 text-secondary" />,
      description: 'Musiqa ta’limida AKT vositalarini joriy qilishning didaktik prinsiplari va interaktiv o‘qitish metodikasi.',
      details: [
        'An’anaviy dars tushunchasini interaktiv o‘yinlar, ko‘rgazmali animatsiyalar va virtual pianino mashqlari bilan uyg‘unlashtirish.',
        'Musiqiy bilimlarni vizualizatsiya orqali yetkazish (ko‘rish va eshitish retseptorlarining o‘zaro uyg‘unligi).',
        'Darsda guruh bo‘lib ishlash va individual musiqiy loyihalar yaratishni rag‘batlantirish.',
        'Sinf va uy vazifalarini raqamli pleyerlar yordamida uzviy bog‘lash.'
      ],
      references: [
        'Shermatov Sh. "Musiqa o‘qitish metodikasi" - Toshkent, 2018.',
        'Yusupov R. "Pedagogikada axborot texnologiyalari" - TDPU, 2021.',
        'Johnson L. "Visual Music in Modern Pedagogy" - Oxford Press, 2019.'
      ]
    },
    {
      id: '2',
      titleKey: 'sec2',
      icon: <Award className="w-5 h-5 text-secondary" />,
      description: 'Dars jarayonida shakllantirilishi lozim bo‘lgan asosiy musiqiy, kognitiv va badiiy-estetik kompetensiyalar ro‘yxati.',
      details: [
        'Musiqiy-estetik idrok: kuyni chuqur tushunish, asarning janri va obrazli mazmunini farqlash.',
        'Amaliy-ijrochilik kompetensiyasi: virtual va real klaviatura yordamida kuy va ritmlarni to‘g‘ri takrorlay olish.',
        'Ijodiy va estetik tafakkur: musiqiy ranglar uyg‘unligini tushunish va kompyuter dasturlarida shaxsiy vizual dizaynlarni yarata olish.',
        'Musiqiy-nazariy savodxonlik: notalar, ritm o‘lchovlari va temp o‘zgarishlarini raqamli chizmalar orqali tahlil qilish.'
      ],
      references: [
        'O‘zbekiston Respublikasi Xalq ta’limi vazirligi "Musiqa madaniyati o‘quv dasturi" - 2023.',
        'Aliev S. "O‘quvchilar badiiy dunyoqarashini shakllantirish muammolari" - Fan nashriyoti, 2017.'
      ]
    },
    {
      id: '3',
      titleKey: 'sec3',
      icon: <BookOpen className="w-5 h-5 text-secondary" />,
      description: 'O‘quvchilarda musiqiy asar shakli, dinamikasi va xarakterini interaktiv tahlil qilish orqali estetik idrokni tarbiyalash.',
      details: [
        'Musiqaning dinamik o‘zgarishlarini (forte, piano) SeeMusic dasturidagi yorug‘lik to‘lqinlarining kengligi va intensivligi orqali vizual kuzatish.',
        'Kuy xarakterining o‘zgarishiga qarab vizual ranglar spektrini moslash va rang-tovush uyg‘unligini (sinesteziya) o‘rganish.',
        'Asar qismlarini (kuplet va pripev) vizual o‘tishlar yordamida aniqlash.',
        'Klassik va milliy kuylarning falsafiy mazmunini tahlil qilish.'
      ],
      references: [
        'Burhonov M. "Musiqiy asarlar tahlili" - Toshkent, 2015.',
        'Scriabin A. "The Philosophy of Color and Sound integration" - Reprint, 2020.'
      ]
    },
    {
      id: '4',
      titleKey: 'sec4',
      icon: <GraduationCap className="w-5 h-5 text-secondary" />,
      description: 'O‘quvchilarning ijodiy tasavvurini, badiiy didini va musiqiy-estetik ideallarini rivojlantirish tizimi.',
      details: [
        'Musiqa tinglash jarayonida asarga bag‘ishlangan rasmlar chizish yoki IT vizual effektlarini mustaqil loyihalash.',
        'Milliy folklore namunalari va jahon klassik musiqalarining estetik farqlarini raqamli tahlillar yordamida o‘rganish.',
        'O‘quvchilarda kompozitorlik san’atiga bo‘lgan qiziqishni virtual cholg‘ular orqali uyg‘otish.',
        'Musiqa va atrof-muhit go‘zalligining o‘zaro uyg‘unligini tushuntirish.'
      ],
      references: [
        'Kadirov R. "Musiqa pedagogikasi" - G‘afur G‘ulom nashriyoti, 2019.',
        'Gardner H. "Frames of Mind: The Theory of Multiple Intelligences" - Basic Books, 2011.'
      ]
    },
    {
      id: '5',
      titleKey: 'sec5',
      icon: <Award className="w-5 h-5 text-secondary" />,
      description: 'Ritmik o‘lchovlar, taktdagi urg‘ular va sinkopali ritmlarni virtual zarbli asboblar (doira, baraban) yordamida mashq qilish.',
      details: [
        'ProfM-2DRUM va Note Bounce dasturlaridan foydalangan holda ritmik andozalarni amaliy takrorlash.',
        'Qo‘shiq kuylash darslarida doira usullarini virtual shaklda ijro etib, jo‘rlik qilish.',
        'Murakkab o‘lchovlarni (3/4, 6/8, doira zarblari) vizual sakrovchi to‘plar yordamida tahlil qilish.',
        'Ritmik diktantlarni interaktiv o‘yinlar shaklida o‘tkazish.'
      ],
      references: [
        'Rajabov I. "Maqomlar asoslari va ritmik doira usullari" - Toshkent, 1992.',
        'Smith J. "Rhythm development using digital drum interfaces" - Music Tech Journal, 2022.'
      ]
    },
    {
      id: '6',
      titleKey: 'sec6',
      icon: <BookOpen className="w-5 h-5 text-secondary" />,
      description: 'Turli cholg‘u asboblarining (nay, doira, g‘ijjak, pianino) tembr xususiyatlarini IT dasturlari orqali eshitib, vizual farqlash.',
      details: [
        'Har bir cholg‘u asbobining tovush to‘lqini shaklini (waveform) osillograf dasturlari orqali kuzatish.',
        'vanBasco pleyerida alohida cholg‘u yo‘llarini (MIDI channels) o‘chirib-yoqish orqali tembr tozaligini his qilish.',
        'Cholg‘ular orkestrdagi o‘rni va ularning o‘zaro uyg‘unligini virtual darslarda o‘rganish.',
        'Eshitish diqqatini va tovush balandligini farqlash mashqlarini o‘tkazish.'
      ],
      references: [
        'Yormatov Sh. "Bolalar xori va ovoz tarbiyasi" - Musiqa nashriyoti, 2016.',
        'Taylor R. "Acoustic physics and timbre recognition in schools" - Academic Press, 2020.'
      ]
    },
    {
      id: '7',
      titleKey: 'sec7',
      icon: <GraduationCap className="w-5 h-5 text-secondary" />,
      description: 'Virtual pianino chalish, karaoke kuylash va dars doirasida shaxsiy musiqiy taqdimotlar tayyorlash faoliyatini boshqarish.',
      details: [
        'Sinfdagi darsda virtual pianino yordamida o‘zaro musobaqalar tashkil etish.',
        'Karaoke darslarida vokal mahoratini shakllantirish va guruh bo‘lib ijro etish.',
        'O‘quvchilar tomonidan SeeMusic dasturida yaratilgan eng chiroyli musiqiy videolarni maktab tadbirlarida namoyish qilish.',
        'Darsdan tashqari vaqtlarda raqamli musiqiy loyihalar va to‘garaklar faoliyatini yo‘lga qo‘yish.'
      ],
      references: [
        'Zokirov M. "Musiqiy to‘garaklarni raqamlashtirish metodikasi" - Ilm nashriyoti, 2022.',
        'UNESCO "ICT in Education: Global Trends and Guidelines for music integration" - 2021.'
      ]
    }
  ];

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="glass p-8 rounded-3xl glow-primary space-y-3">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
            <BookOpen className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-display">
              {t.method.title}
            </h1>
            <p className="text-xs text-slate-400">
              O‘qituvchilar, pedagoglar va tadqiqotchilar uchun ilmiy-metodik baza
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t.method.subtitle}
        </p>
      </div>

      {/* Intro section */}
      <div className="bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/20 p-5 rounded-2xl">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
          {t.method.intro}
        </p>
      </div>

      {/* Methodology Accordions */}
      <div className="space-y-4">
        {methods.map((item) => {
          const title = t.method[item.titleKey];
          const isOpen = activeId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Header block (Click trigger) */}
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 focus:outline-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">
                    {title}
                  </h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Expandable Body */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-5">
                  
                  {/* Summary */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  {/* Bullet details */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-primary dark:text-sky-400 uppercase tracking-wider block">
                      Metodik amaliy ko‘rsatmalar:
                    </span>
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* References */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Adabiyotlar ro‘yxati (References):</span>
                    </span>
                    <ol className="list-decimal pl-4 space-y-1 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.references.map((ref, idx) => (
                        <li key={idx}>
                          {ref}
                        </li>
                      ))}
                    </ol>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

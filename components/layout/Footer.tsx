'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Award, BookOpen, Music, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* About Project / Thesis info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide font-display">
              PhD DISSERTATSIYASI
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            “Oʻquvchilarning badiiy-estetik mahoratini zamonaviy IT vositasida rivojlantirish texnologiyasi (5–7-sinflar misolida)” mavzusidagi ilmiy-tadqiqot ishi doirasida yaratilgan interaktiv platforma.
          </p>
          <div className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Andijon davlat pedagogika instituti (ADPI)
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
            {t.common.filter}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/sinf/5" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Music className="w-3.5 h-3.5 text-secondary" />
                <span>{t.nav.grade5}</span>
              </Link>
            </li>
            <li>
              <Link href="/sinf/6" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Music className="w-3.5 h-3.5 text-secondary" />
                <span>{t.nav.grade6}</span>
              </Link>
            </li>
            <li>
              <Link href="/sinf/7" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Music className="w-3.5 h-3.5 text-secondary" />
                <span>{t.nav.grade7}</span>
              </Link>
            </li>
            <li>
              <Link href="/midi-library" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                <BookOpen className="w-3.5 h-3.5 text-secondary" />
                <span>{t.nav.midiLibrary}</span>
              </Link>
            </li>
            <li>
              <Link href="/musiqa-tinglash" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Music className="w-3.5 h-3.5 text-secondary" />
                <span>{t.nav.classicalMusic}</span>
              </Link>
            </li>
            <li>
              <Link href="/it-programs" className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Award className="w-3.5 h-3.5 text-secondary" />
                <span>{t.nav.itPrograms}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
            {t.contact.infoTitle}
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-sky-400" />
              <a href="mailto:maruf79@bk.ru" className="hover:text-white transition-colors">
                maruf79@bk.ru
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-sky-400" />
              <a href="tel:+998888000251" className="hover:text-white transition-colors">
                +998 (88) 800-02-51
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-400 mt-0.5" />
              <span>
                {t.contact.address}
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} Synthoria IT-Music Education. Barcha huquqlar himoyalangan.</p>
        <p className="hover:text-slate-400 transition-colors">
          Andijon, O‘zbekiston
        </p>
      </div>
    </footer>
  );
};
export default Footer;

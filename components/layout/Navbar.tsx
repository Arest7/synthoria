'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Globe, Award, Settings, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Language } from '@/lib/translations';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  const menuStructure = [
    { type: 'link', name: t.nav.home, href: '/' },
    {
      type: 'dropdown',
      id: 'music',
      name: t.nav.musicEducation,
      items: [
        { name: t.nav.grade5, href: '/sinf/5', desc: "5-sinf darslik qo'shiq va kuylari" },
        { name: t.nav.grade6, href: '/sinf/6', desc: "6-sinf musiqiy janr va asarlar" },
        { name: t.nav.grade7, href: '/sinf/7', desc: "7-sinf maqom va simfoniya asosi" },
        { name: t.nav.midiLibrary, href: '/midi-library', desc: "Raqamli o'quv MIDI asarlar arxivi" },
        { name: t.nav.classicalMusic, href: '/musiqa-tinglash', desc: "Jahon klassik asarlari xonasi" },
      ]
    },
    {
      type: 'dropdown',
      id: 'science',
      name: t.nav.scienceMethods,
      items: [
        { name: t.nav.itPrograms, href: '/it-programs', desc: "Esterik ta'limiy musiqiy IT dasturlar" },
        { name: t.nav.methodology, href: '/methodology', desc: "O'qituvchilar uchun metodik tizim" },
        { name: t.nav.research, href: '/research', desc: "Magistrlik dissertatsiyasi tadqiqoti" },
      ]
    },
    { type: 'link', name: t.nav.aboutAuthor, href: '/about-author' },
    { type: 'link', name: t.nav.contact, href: '/contact' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false;
    return pathname.startsWith(href);
  };

  const isDropdownActive = (items: { href: string }[]) => {
    return items.some(item => pathname.startsWith(item.href));
  };

  const toggleMobileDropdown = (id: string) => {
    setMobileExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Title */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block leading-tight font-display tracking-wide">
                Synthoria
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block tracking-wider leading-none mt-0.5">
                IT-MUSIC EDUCATION
              </span>
            </div>
          </Link>

          {/* Desktop Grouped Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {menuStructure.map((item, idx) => {
              if (item.type === 'link' && item.href) {
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary dark:bg-sky-500/10 dark:text-sky-400 font-bold'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-100 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }

              if (item.type === 'dropdown' && item.items) {
                const active = isDropdownActive(item.items);
                return (
                  <div key={idx} className="relative group py-2">
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1 cursor-pointer outline-hidden ${
                        active
                          ? 'text-primary dark:text-sky-400 font-bold'
                          : 'text-slate-600 hover:text-primary hover:bg-slate-100 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200 text-slate-400 dark:text-slate-500" />
                    </button>

                    {/* Dropdown glass block */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 backdrop-blur-xl p-3 shadow-xl pointer-events-none opacity-0 translate-y-2 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50 before:content-[''] before:absolute before:bottom-full before:left-0 before:right-0 before:h-3"
                    >
                      <div className="flex flex-col gap-1.5">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex flex-col p-2.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-all cursor-pointer group/item ${
                              pathname === sub.href
                                ? 'bg-primary/5 text-primary dark:bg-sky-500/5 dark:text-sky-400 font-bold'
                                : ''
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-primary dark:group-hover/item:text-sky-400 transition-colors">
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </nav>

          {/* Utility buttons (Lang, Theme, Admin, Mobile Toggle) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer text-xs font-semibold uppercase">
                <Globe className="w-4 h-4 text-secondary" />
                <span>{language}</span>
              </button>
              <div className="absolute right-0 mt-1 w-24 rounded-lg shadow-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 py-1 hidden group-hover:block z-50">
                {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 uppercase cursor-pointer"
                  >
                    {lang === 'uz' ? 'O‘zbek' : lang === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-accent" />}
            </button>

            {/* Admin Panel Link */}
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              title={t.nav.admin}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            {menuStructure.map((item, idx) => {
              if (item.type === 'link' && item.href) {
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary dark:bg-sky-500/10 dark:text-sky-400 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }

              if (item.type === 'dropdown' && item.id && item.items) {
                const expanded = mobileExpanded[item.id] || false;
                const active = isDropdownActive(item.items);

                return (
                  <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleMobileDropdown(item.id!)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer outline-hidden ${
                        active ? 'text-primary dark:text-sky-400' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 text-slate-400 ${expanded ? 'rotate-180' : ''}`} />
                    </button>

                    {expanded && (
                      <div className="bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 px-2 py-1.5 flex flex-col gap-1">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex flex-col p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                              pathname === sub.href
                                ? 'bg-primary/5 text-primary dark:bg-sky-500/5 dark:text-sky-400 font-bold'
                                : ''
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {sub.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;

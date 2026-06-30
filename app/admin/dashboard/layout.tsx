import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LayoutDashboard, Music, FileText, Newspaper, LogOut, ArrowLeft, ShieldCheck, User } from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Protect Route: Check session on Server Side
  const session = getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">
        
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black block tracking-wider uppercase">BOSHQARUV</span>
              <span className="text-[9px] text-slate-500 block">ADMIN DASHBOARD</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex flex-col text-xs font-bold">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Statistika</span>
            </Link>

            <Link
              href="/admin/dashboard/midis"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Music className="w-4 h-4 text-sky-400" />
              <span>MIDI Fayllar</span>
            </Link>

            <Link
              href="/admin/dashboard/pdfs"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>PDF Hujjatlar</span>
            </Link>

            <Link
              href="/admin/dashboard/news"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Newspaper className="w-4 h-4 text-sky-400" />
              <span>Nashrlar & Yangiliklar</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-4 pt-6 border-t border-slate-800/80 text-xs">
          
          {/* Quick profile badge */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block truncate leading-tight">Admin</span>
              <span className="text-[9px] text-slate-500 block">Tizim administratori</span>
            </div>
          </div>

          {/* Return to website */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Saytga qaytish</span>
          </Link>

          {/* Logout Button */}
          <form action="/api/auth/logout" method="POST" className="w-full">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Tizimdan chiqish</span>
            </button>
          </form>

        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10">
        {children}
      </main>

    </div>
  );
}
